import React, { useState } from 'react';
import { Key, Shield, Filter, BarChart3, CheckCircle2 } from 'lucide-react';
import { OpenApplyUserConfig } from '@openapply/shared-types';
import { ToggleSwitch } from '@/src/components/atomic/Atoms';

/**
 * Props schema for SettingsPanel component.
 */
export interface SettingsPanelProps {
  userConfig: OpenApplyUserConfig;
  onSaveConfig: (updated: OpenApplyUserConfig) => void;
}

/**
 * Extension popup Settings Panel component.
 */
export const SettingsPanel: React.FC<SettingsPanelProps> = ({ userConfig, onSaveConfig }) => {
  const [config, setConfig] = useState<OpenApplyUserConfig>(userConfig);
  const [isKeyVisible, setIsKeyVisible] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleChange = (updated: OpenApplyUserConfig) => {
    setConfig(updated);
    onSaveConfig(updated);
    setStatusMessage('Saved');
    setTimeout(() => setStatusMessage(null), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Display Preferences */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
        <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
          <Filter className="w-3.5 h-3.5 text-indigo-600" /> LinkedIn Job Board Preferences
        </div>

        <ToggleSwitch
          label="Hide or dim sponsored and promoted job postings"
          checked={config.preferences.hidePromotedJobs}
          onChange={(checked) =>
            handleChange({
              ...config,
              preferences: { ...config.preferences, hidePromotedJobs: checked }
            })
          }
        />

        <div className="pt-2 border-t border-slate-200">
          <ToggleSwitch
            label="Hide or dim jobs that already have a high applicant volume"
            checked={config.preferences.hideHighApplicantJobs}
            onChange={(checked) =>
              handleChange({
                ...config,
                preferences: { ...config.preferences, hideHighApplicantJobs: checked }
              })
            }
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-600">Maximum Applicant Threshold</span>
            <span className="text-xs font-mono font-bold text-emerald-700">
              {config.preferences.maxApplicantThreshold}
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="300"
            step="10"
            value={config.preferences.maxApplicantThreshold}
            onChange={(e) =>
              handleChange({
                ...config,
                preferences: { ...config.preferences, maxApplicantThreshold: parseInt(e.target.value, 10) }
              })
            }
            className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-1"
          />
        </div>
      </div>

      {/* AI Key Setup */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
          <span className="flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-amber-600" /> ChatGPT OpenAI API Key
          </span>
          <button
            onClick={() => setIsKeyVisible(!isKeyVisible)}
            className="text-[10px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
          >
            {isKeyVisible ? 'Hide' : 'Show'}
          </button>
        </div>
        <input
          type={isKeyVisible ? 'text' : 'password'}
          placeholder="sk-proj-..."
          value={config.aiProvider.apiKey}
          onChange={(e) =>
            handleChange({
              ...config,
              aiProvider: { ...config.aiProvider, apiKey: e.target.value, isValidated: false }
            })
          }
          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded font-mono text-slate-900"
        />
        <p className="text-[10px] text-slate-500 flex items-center gap-1">
          <Shield className="w-3 h-3 text-emerald-600 shrink-0" /> AES-256 encrypted in browser local storage.
        </p>
      </div>

      {/* Analytics Opt-In */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
        <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-indigo-600" /> Usage Telemetry
        </div>
        <ToggleSwitch
          label="Help improve OpenApply with anonymous usage metrics"
          checked={config.analytics.optIn}
          onChange={(checked) =>
            handleChange({
              ...config,
              analytics: { ...config.analytics, optIn: checked }
            })
          }
        />
      </div>

      {statusMessage && (
        <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 justify-end pt-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {statusMessage}
        </div>
      )}
    </div>
  );
};
