import { describe, it, expect, beforeEach } from 'vitest';
import { getUserConfig, saveUserConfig } from '../lib/storage';
import { OpenApplyUserConfig, DEFAULT_USER_CONFIG } from '@openapply/shared-types';

describe('Storage UserConfig Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return DEFAULT_USER_CONFIG when storage is empty', async () => {
    const config = await getUserConfig();
    expect(config.onboardingCompleted).toBe(false);
    expect(config.preferences.hidePromotedJobs).toBe(true);
    expect(config.preferences.maxApplicantThreshold).toBe(50);
    expect(config.analytics.optIn).toBe(false);
  });

  it('should save and retrieve updated OpenApplyUserConfig', async () => {
    const updated: OpenApplyUserConfig = {
      ...DEFAULT_USER_CONFIG,
      onboardingCompleted: true,
      preferences: {
        hidePromotedJobs: true,
        hideHighApplicantJobs: false,
        maxApplicantThreshold: 75
      },
      aiProvider: {
        providerId: 'openai',
        apiKey: 'sk-test-key-1234567890',
        isValidated: true
      },
      analytics: {
        optIn: true,
        clientId: 'test-uuid-1234'
      }
    };

    await saveUserConfig(updated);
    const retrieved = await getUserConfig();

    expect(retrieved.onboardingCompleted).toBe(true);
    expect(retrieved.preferences.maxApplicantThreshold).toBe(75);
    expect(retrieved.aiProvider.apiKey).toBe('sk-test-key-1234567890');
    expect(retrieved.analytics.optIn).toBe(true);
  });
});
