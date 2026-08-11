/**
 * OpenApply In-Page Visual Feedback Indicator Badge (Manifest V3 Content Component).
 * Displays real-time counts of hidden/dimmed promoted and high-applicant job postings on LinkedIn.
 */

/**
 * Statistics container interface for in-page visual counter badge.
 */
export interface FilterStats {
  promotedHidden: number;
  highApplicantHidden: number;
  totalHidden: number;
}

/**
 * Floating glassmorphism pill badge component injected into LinkedIn jobs listing DOM.
 */
export class FilterFeedbackBadge {
  private containerEl: HTMLElement | null = null;
  private badgeEl: HTMLElement | null = null;
  private isHardHideMode: boolean = false;
  private currentStats: FilterStats = { promotedHidden: 0, highApplicantHidden: 0, totalHidden: 0 };
  private onToggleModeCallback?: (hardHide: boolean) => void;

  constructor(onToggleMode?: (hardHide: boolean) => void) {
    this.onToggleModeCallback = onToggleMode;
    this.createBadgeContainer();
  }

  private createBadgeContainer() {
    if (document.getElementById('openapply-feedback-badge-root')) {
      return;
    }

    this.containerEl = document.createElement('div');
    this.containerEl.id = 'openapply-feedback-badge-root';
    this.containerEl.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      pointer-events: auto;
    `;

    this.badgeEl = document.createElement('div');
    this.badgeEl.className = 'openapply-feedback-pill';
    this.badgeEl.style.cssText = `
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      color: #f8fafc;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 9999px;
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s ease-in-out;
    `;

    this.badgeEl.addEventListener('click', () => this.handleBadgeClick());
    this.badgeEl.addEventListener('mouseenter', () => {
      if (this.badgeEl) this.badgeEl.style.transform = 'translateY(-2px) scale(1.02)';
    });
    this.badgeEl.addEventListener('mouseleave', () => {
      if (this.badgeEl) this.badgeEl.style.transform = 'translateY(0) scale(1)';
    });

    this.containerEl.appendChild(this.badgeEl);
    document.body.appendChild(this.containerEl);
    this.render();
  }

  /**
   * Updates current filter statistics and re-renders badge text.
   * @param stats - FilterStats object
   */
  public updateStats(stats: FilterStats) {
    this.currentStats = stats;
    this.render();
  }

  private handleBadgeClick() {
    this.isHardHideMode = !this.isHardHideMode;
    if (this.onToggleModeCallback) {
      this.onToggleModeCallback(this.isHardHideMode);
    }
    this.render();
  }

  private render() {
    if (!this.badgeEl) return;

    if (this.currentStats.totalHidden === 0) {
      this.badgeEl.innerHTML = `
        <span style="width: 8px; height: 8px; border-radius: 50%; background: #22c55e;"></span>
        <span>OpenApply Active: Monitoring Job Board</span>
      `;
      return;
    }

    const modeLabel = this.isHardHideMode ? 'Hidden' : 'Dimmed';
    this.badgeEl.innerHTML = `
      <span style="width: 8px; height: 8px; border-radius: 50%; background: #3b82f6; box-shadow: 0 0 8px #3b82f6;"></span>
      <span>OpenApply: <strong>${this.currentStats.totalHidden}</strong> noisy listings ${modeLabel.toLowerCase()} (${this.currentStats.promotedHidden} promoted, ${this.currentStats.highApplicantHidden} high-applicant)</span>
      <span style="font-size: 10px; background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 9999px; margin-left: 4px;">Click to toggle ${this.isHardHideMode ? 'Dim' : 'Hide'}</span>
    `;
  }
}
