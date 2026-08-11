/**
 * OpenApply Content Script for LinkedIn Jobs (Manifest V3)
 * Runs on https://*.linkedin.com/jobs/*
 */

/**
 * Calculates SHA-256 or fallback hash for job ID deduplication.
 * @param jobId - LinkedIn job posting ID string
 * @returns Promise resolving to hex hash string
 */
export async function calculateJobHash(jobId: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(jobId);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  let hash = 0;
  for (let i = 0; i < jobId.length; i++) {
    const char = jobId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'openapply_' + Math.abs(hash).toString(16);
}

/**
 * Parsed DOM job listing data object schema.
 */
export interface LinkedInDomJob {
  element: HTMLElement;
  jobId: string;
  jobHash: string;
  title: string;
  company: string;
  location: string;
  applicantCount: number;
  isPromoted: boolean;
  isRemote: boolean;
  url: string;
}

import { FilterFeedbackBadge } from './components/FilterFeedbackBadge';

/**
 * DOM Filtering engine for auto-dimming promoted and high-applicant job listings.
 */
export class LinkedInJobFilterEngine {
  private autoFilterPromoted: boolean = true;
  private maxApplicantThreshold: number = 50;
  private hardHideMode: boolean = false;
  private badge: FilterFeedbackBadge | null = null;

  constructor() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.badge = new FilterFeedbackBadge((hardHide) => {
        this.hardHideMode = hardHide;
        this.processJobListings();
      });
    }
    this.initStorageListener();
    this.observeJobBoard();
  }

  private async initStorageListener() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['userConfig', 'settings'], (result: any) => {
        if (result.userConfig) {
          this.autoFilterPromoted = result.userConfig.preferences?.hidePromotedJobs ?? true;
          this.maxApplicantThreshold = result.userConfig.preferences?.maxApplicantThreshold ?? 50;
        } else if (result.settings) {
          this.autoFilterPromoted = result.settings.autoFilterPromoted ?? true;
          this.maxApplicantThreshold = result.settings.maxApplicantThreshold ?? 50;
        }
        this.processJobListings();
      });

      chrome.storage.onChanged.addListener((changes: any) => {
        if (changes.userConfig) {
          const cfg = changes.userConfig.newValue;
          if (cfg?.preferences) {
            this.autoFilterPromoted = cfg.preferences.hidePromotedJobs ?? true;
            this.maxApplicantThreshold = cfg.preferences.maxApplicantThreshold ?? 50;
            this.processJobListings();
          }
        }
      });
    }
  }

  public parseJobCard(card: HTMLElement): LinkedInDomJob | null {
    try {
      const linkEl = card.querySelector<HTMLAnchorElement>(
        'a.job-card-list__title, a.job-card-container__link, a[href*="/jobs/view/"]'
      );
      if (!linkEl) return null;

      const url = linkEl.href;
      const jobIdMatch = url.match(/view\/(\d+)/) || url.match(/currentJobId=(\d+)/);
      const jobId = jobIdMatch ? jobIdMatch[1] : url.split('?')[0].split('/').pop() || 'unknown';

      const title =
        linkEl.innerText.trim() ||
        card.querySelector('.job-card-list__title')?.textContent?.trim() ||
        'Software Engineer';

      const companyEl = card.querySelector(
        '.job-card-container__primary-description, .job-card-container__company-name, .artdeco-entity-lockup__subtitle'
      );
      const company = companyEl?.textContent?.trim() || 'Target Company';

      const locationEl = card.querySelector('.job-card-container__metadata-item, .artdeco-entity-lockup__caption');
      const location = locationEl?.textContent?.trim() || 'United States';
      const isRemote = location.toLowerCase().includes('remote') || title.toLowerCase().includes('remote');

      let applicantCount = 0;
      const textContent = card.innerText || '';
      const applicantMatch = textContent.match(/(\d+)\+?\s+applicants?/i);
      if (applicantMatch) {
        applicantCount = parseInt(applicantMatch[1], 10);
      }

      const isPromoted = Boolean(
        card.querySelector('.job-card-container__footer-item--promoted') ||
        textContent.toLowerCase().includes('promoted')
      );

      return {
        element: card,
        jobId,
        jobHash: '',
        title,
        company,
        location,
        applicantCount,
        isPromoted,
        isRemote,
        url
      };
    } catch (e) {
      console.warn('[OpenApply] Error parsing job card', e);
      return null;
    }
  }

  public async processJobListings() {
    const cards = document.querySelectorAll<HTMLElement>(
      '.job-card-container, .jobs-search-results__list-item, li.jobs-search-results__list-item'
    );

    let promotedHidden = 0;
    let highApplicantHidden = 0;

    for (const card of Array.from(cards)) {
      const parsed = this.parseJobCard(card);
      if (!parsed) continue;

      parsed.jobHash = await calculateJobHash(parsed.jobId);

      let shouldDim = false;
      let dimReason = '';
      let isPromotedReason = false;

      if (this.autoFilterPromoted && parsed.isPromoted) {
        shouldDim = true;
        isPromotedReason = true;
        dimReason = 'Promoted Listing Filtered by OpenApply';
      } else if (parsed.applicantCount > this.maxApplicantThreshold) {
        shouldDim = true;
        dimReason = `High Applicant Count (${parsed.applicantCount} > max threshold of ${this.maxApplicantThreshold})`;
      }

      if (shouldDim) {
        if (isPromotedReason) {
          promotedHidden++;
        } else {
          highApplicantHidden++;
        }

        if (this.hardHideMode) {
          card.style.display = 'none';
        } else {
          card.style.display = '';
          card.style.opacity = '0.35';
          card.style.filter = 'grayscale(80%)';
          card.setAttribute('data-openapply-dimmed', 'true');
          card.setAttribute('title', `[OpenApply] ${dimReason}`);

          if (!card.querySelector('.openapply-dim-badge')) {
            const badge = document.createElement('div');
            badge.className = 'openapply-dim-badge';
            badge.style.cssText =
              'background: rgba(239, 68, 68, 0.15); color: #dc2626; font-size: 11px; padding: 2px 6px; border-radius: 4px; font-weight: 600; margin-top: 4px; display: inline-block;';
            badge.innerText = `🛡️ OpenApply Dimmed: ${dimReason}`;
            card.appendChild(badge);
          }
        }
      } else {
        card.style.display = '';
        card.style.opacity = '1';
        card.style.filter = 'none';
        const badge = card.querySelector('.openapply-dim-badge');
        if (badge) badge.remove();
      }
    }

    if (this.badge) {
      this.badge.updateStats({
        promotedHidden,
        highApplicantHidden,
        totalHidden: promotedHidden + highApplicantHidden
      });
    }
  }

  private observeJobBoard() {
    const observer = new MutationObserver(() => {
      this.processJobListings();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

if (typeof window !== 'undefined') {
  console.log('[OpenApply] Manifest V3 Content Script Loaded for LinkedIn Jobs.');
  new LinkedInJobFilterEngine();
}
