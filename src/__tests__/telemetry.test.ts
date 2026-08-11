import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isTelemetryConsentGranted, sendTelemetryEvent } from '../../apps/extension/src/background/telemetry';
import { DEFAULT_USER_CONFIG, OpenApplyUserConfig } from '@openapply/shared-types';

describe('GA4 Measurement Protocol Telemetry Module', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return false for consent when optIn is false', () => {
    const config: OpenApplyUserConfig = { ...DEFAULT_USER_CONFIG, analytics: { optIn: false, clientId: 'anon' } };
    expect(isTelemetryConsentGranted(config)).toBe(false);
  });

  it('should return true for consent when optIn is true', () => {
    const config: OpenApplyUserConfig = { ...DEFAULT_USER_CONFIG, analytics: { optIn: true, clientId: 'anon' } };
    expect(isTelemetryConsentGranted(config)).toBe(true);
  });

  it('should not send fetch request when consent is false', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const config: OpenApplyUserConfig = { ...DEFAULT_USER_CONFIG, analytics: { optIn: false, clientId: 'anon' } };

    const result = await sendTelemetryEvent('onboarding_completed', {}, config);
    expect(result).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('should send fetch request when consent is true', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 200 }));
    const config: OpenApplyUserConfig = { ...DEFAULT_USER_CONFIG, analytics: { optIn: true, clientId: 'anon-123' } };

    const result = await sendTelemetryEvent('onboarding_completed', { test: true }, config);
    expect(result).toBe(true);
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('google-analytics.com'),
      expect.objectContaining({ method: 'POST' })
    );
  });
});
