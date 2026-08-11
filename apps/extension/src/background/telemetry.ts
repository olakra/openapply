/**
 * OpenApply GA4 Measurement Protocol Service Worker Telemetry Module.
 * Strictly enforces user opt-in consent before dispatching anonymous usage metrics.
 */

import { OpenApplyUserConfig } from '@openapply/shared-types';

const GA_MEASUREMENT_ID = 'G-OPENAPPLY01';
const GA_API_SECRET = 'openapply_secret_token';

/**
 * Checks if candidate has granted explicit opt-in consent for anonymous telemetry.
 * @param config - OpenApplyUserConfig object
 * @returns boolean indicating consent state
 */
export function isTelemetryConsentGranted(config?: Partial<OpenApplyUserConfig>): boolean {
  return Boolean(config?.analytics?.optIn);
}

/**
 * Dispatches an anonymous event payload to GA4 Measurement Protocol if opt-in consent is active.
 * @param eventName - GA4 event name string
 * @param eventParams - Key-value pair event parameters
 * @param config - Optional OpenApplyUserConfig instance
 * @returns Promise resolving to boolean success flag
 */
export async function sendTelemetryEvent(
  eventName: string,
  eventParams: Record<string, any> = {},
  config?: OpenApplyUserConfig
): Promise<boolean> {
  if (!config) {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      config = await new Promise((resolve) => {
        chrome.storage.local.get(['userConfig'], (res: any) => resolve(res.userConfig || null));
      });
    }
  }

  if (!isTelemetryConsentGranted(config)) {
    console.debug('[OpenApply Telemetry] Event skipped (Opt-out active or no consent).');
    return false;
  }

  const clientId = config?.analytics?.clientId || 'anonymous-client';

  const payload = {
    client_id: clientId,
    events: [
      {
        name: eventName,
        params: {
          ...eventParams,
          engagement_time_msec: 100
        }
      }
    ]
  };

  try {
    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return response.ok;
  } catch (err: any) {
    console.warn('[OpenApply Telemetry] Failed to dispatch telemetry hit:', err?.message || err);
    return false;
  }
}
