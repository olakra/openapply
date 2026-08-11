import React, { useState, useEffect } from 'react';
import { Shield, Settings } from 'lucide-react';
import { OpenApplyUserConfig, DEFAULT_USER_CONFIG } from '@openapply/shared-types';
import { getUserConfig, saveUserConfig } from '@/src/lib/storage';
import { OnboardingModal } from './components/OnboardingModal';
import { SettingsPanel } from './components/SettingsPanel';
import { sendTelemetryEvent } from '../background/telemetry';

/**
 * Extension popup user interface component for BYOK configuration and filter management.
 * @returns React element rendering extension popup view
 */
export function OpenApplyPopupUI() {
  const [userConfig, setUserConfig] = useState<OpenApplyUserConfig>(DEFAULT_USER_CONFIG);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  useEffect(() => {
    getUserConfig().then((cfg) => {
      setUserConfig(cfg);
      if (!cfg.onboardingCompleted) {
        setShowOnboarding(true);
      }
    });
  }, []);

  const handleSaveConfig = async (updated: OpenApplyUserConfig) => {
    setUserConfig(updated);
    await saveUserConfig(updated);

    if (updated.analytics.optIn) {
      sendTelemetryEvent(
        'preferences_updated',
        {
          hide_promoted: updated.preferences.hidePromotedJobs,
          max_applicants: updated.preferences.maxApplicantThreshold
        },
        updated
      );
    }
  };

  const handleCompleteOnboarding = () => {
    setShowOnboarding(false);
    if (userConfig.analytics.optIn) {
      sendTelemetryEvent('onboarding_completed', {}, userConfig);
    }
  };

  return (
    <div className="w-[380px] bg-white text-slate-900 p-4 font-sans select-none border border-slate-200 rounded-2xl shadow-xl relative">
      {/* Onboarding Wizard Overlay */}
      {showOnboarding && (
        <OnboardingModal config={userConfig} onSaveConfig={handleSaveConfig} onComplete={handleCompleteOnboarding} />
      )}

      {/* Popup App Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-xs bg-slate-900">
            <img src="/logo.png" alt="OpenApply Logo" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              OpenApply{' '}
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-semibold">
                v1.0 MV3
              </span>
            </h1>
            <p className="text-[11px] text-slate-500">Privacy-First LinkedIn Job Copilot</p>
          </div>
        </div>
        <button
          onClick={() => setShowOnboarding(true)}
          title="Re-run Onboarding Setup"
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Main Settings Body */}
      <SettingsPanel userConfig={userConfig} onSaveConfig={handleSaveConfig} />

      {/* Footer Info Bar */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-emerald-600" /> 100% Local Encrypted
        </span>
        <span className="text-slate-400 text-[10px]">Open Source GPL-3.0</span>
      </div>
    </div>
  );
}

export default OpenApplyPopupUI;
