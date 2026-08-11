import { describe, it, expect, beforeEach } from 'vitest';
import { FilterFeedbackBadge } from '../../apps/extension/src/content/components/FilterFeedbackBadge';

describe('FilterFeedbackBadge Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should create root container and badge element in DOM', () => {
    new FilterFeedbackBadge();
    const root = document.getElementById('openapply-feedback-badge-root');
    expect(root).not.toBeNull();
  });

  it('should update stats text when updateStats is invoked', () => {
    const badge = new FilterFeedbackBadge();
    badge.updateStats({ promotedHidden: 5, highApplicantHidden: 3, totalHidden: 8 });

    const root = document.getElementById('openapply-feedback-badge-root');
    expect(root?.textContent).toContain('8');
    expect(root?.textContent).toContain('5 promoted');
    expect(root?.textContent).toContain('3 high-applicant');
  });
});
