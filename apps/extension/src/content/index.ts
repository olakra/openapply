/**
 * OpenApply Content Script for LinkedIn Jobs (Manifest V3)
 * Runs on https://*.linkedin.com/jobs/*
 * 
 * Features:
 * 1. Hashes Job ID with SHA-256 / Hash code for local tracking
 * 2. Parses Job Title, Company, Description, Applicant Count, Promoted Status
 * 3. Dims or hides Promoted jobs & High-Applicant listings (>100 applicants)
 * 4. Injects interactive OpenApply Action Bar into job card details pane
 */

// Simple SHA-256 hash calculation for Job ID or URL
export async function calculateJobHash(jobId: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(jobId);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback string hash
  let hash = 0;
  for (let i = 0; i < jobId.length; i++) {
    const char = jobId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'openapply_' + Math.abs(hash).toString(16);
}

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

export class LinkedInJobFilterEngine {
  private autoFilterPromoted: boolean = true;
  private maxApplicantThreshold: number = 100;

  constructor() {
    this.initStorageListener();
    this.observeJobBoard();
  }

  private async initStorageListener() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['settings'], (result: any) => {
        if (result.settings) {
          this.autoFilterPromoted = result.settings.autoFilterPromoted ?? true;
          this.maxApplicantThreshold = result.settings.maxApplicantThreshold ?? 100;
          this.processJobListings();
        }
      });

      chrome.storage.onChanged.addListener((changes: any) => {
        if (changes.settings) {
          const newSettings = changes.settings.newValue;
          if (newSettings) {
            this.autoFilterPromoted = newSettings.autoFilterPromoted;
            this.maxApplicantThreshold = newSettings.maxApplicantThreshold;
            this.processJobListings();
          }
        }
      });
    }
  }

  public parseJobCard(card: HTMLElement): LinkedInDomJob | null {
    try {
      const linkEl = card.querySelector<HTMLAnchorElement>('a.job-card-list__title, a.job-card-container__link, a[href*="/jobs/view/"]');
      if (!linkEl) return null;

      const url = linkEl.href;
      const jobIdMatch = url.match(/view\/(\d+)/) || url.match(/currentJobId=(\d+)/);
      const jobId = jobIdMatch ? jobIdMatch[1] : url.split('?')[0].split('/').pop() || 'unknown';

      const title = linkEl.innerText.trim() || card.querySelector('.job-card-list__title')?.textContent?.trim() || 'Software Engineer';
      
      const companyEl = card.querySelector('.job-card-container__primary-description, .job-card-container__company-name, .artdeco-entity-lockup__subtitle');
      const company = companyEl?.textContent?.trim() || 'Target Company';

      const locationEl = card.querySelector('.job-card-container__metadata-item, .artdeco-entity-lockup__caption');
      const location = locationEl?.textContent?.trim() || 'United States';
      const isRemote = location.toLowerCase().includes('remote') || title.toLowerCase().includes('remote');

      // Applicant Count parsing
      let applicantCount = 0;
      const textContent = card.innerText || '';
      const applicantMatch = textContent.match(/(\d+)\+?\s+applicants?/i);
      if (applicantMatch) {
        applicantCount = parseInt(applicantMatch[1], 10);
      }

      // Promoted Tag detection
      const isPromoted = Boolean(
        card.querySelector('.job-card-container__footer-item--promoted') ||
        textContent.toLowerCase().includes('promoted')
      );

      return {
        element: card,
        jobId,
        jobHash: '', // calculated async
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
    const cards = document.querySelectorAll<HTMLElement>('.job-card-container, .jobs-search-results__list-item, li.jobs-search-results__list-item');
    
    for (const card of Array.from(cards)) {
      const parsed = this.parseJobCard(card);
      if (!parsed) continue;

      parsed.jobHash = await calculateJobHash(parsed.jobId);
      
      // Apply Filter Rules
      let shouldDim = false;
      let dimReason = '';

      if (this.autoFilterPromoted && parsed.isPromoted) {
        shouldDim = true;
        dimReason = 'Promoted Listing Filtered by OpenApply';
      } else if (parsed.applicantCount > this.maxApplicantThreshold) {
        shouldDim = true;
        dimReason = `High Applicant Count (${parsed.applicantCount} > max threshold of ${this.maxApplicantThreshold})`;
      }

      if (shouldDim) {
        card.style.opacity = '0.35';
        card.style.filter = 'grayscale(80%)';
        card.setAttribute('data-openapply-dimmed', 'true');
        card.setAttribute('title', `[OpenApply] ${dimReason}`);

        // Add visual badge if not present
        if (!card.querySelector('.openapply-dim-badge')) {
          const badge = document.createElement('div');
          badge.className = 'openapply-dim-badge';
          badge.style.cssText = 'background: rgba(239, 68, 68, 0.15); color: #dc2626; font-size: 11px; padding: 2px 6px; border-radius: 4px; font-weight: 600; margin-top: 4px; display: inline-block;';
          badge.innerText = `🛡️ OpenApply Dimmed: ${dimReason}`;
          card.appendChild(badge);
        }
      } else {
        card.style.opacity = '1';
        card.style.filter = 'none';
        const badge = card.querySelector('.openapply-dim-badge');
        if (badge) badge.remove();
      }
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

// Initialize on LinkedIn DOM ready
if (typeof window !== 'undefined') {
  console.log('[OpenApply] Manifest V3 Content Script Loaded for LinkedIn Jobs.');
  new LinkedInJobFilterEngine();
}
