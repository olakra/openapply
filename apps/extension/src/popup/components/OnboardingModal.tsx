import React, { useState } from 'react';
import { Shield, Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Key, BarChart3 } from 'lucide-react';
import { OpenApplyUserConfig } from '@openapply/shared-types';
import { Button, ToggleSwitch, Badge } from '@/src/components/atomic/Atoms';

/**
 * Props schema for OnboardingModal component.
 */
export interface OnboardingModalProps {
  config: OpenApplyUserConfig;
  onSaveConfig: (updated: OpenApplyUserConfig) => void;
  onComplete: () => void;
}

/**
 * 4-Step First-Time User Onboarding Modal component for OpenApply extension.
 */
export const OnboardingModal: React.FC<OnboardingModalProps> = ({ config, onSaveConfig, onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [tempConfig, setTempConfig] = useState<OpenApplyUserConfig>(config);
  const [validationState, setValidationState] = useState<'idle' | 'testing' | 'valid' | 'invalid'>('idle');

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      const finalConfig = { ...tempConfig, onboardingCompleted: true };
      onSaveConfig(finalConfig);
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const testApiKey = () => {
    if (!tempConfig.aiProvider.apiKey || !tempConfig.aiProvider.apiKey.startsWith('sk-')) {
      setValidationState('invalid');
      return;
    }
    setValidationState('testing');
    setTimeout(() => {
      setValidationState('valid');
      setTempConfig((prev) => ({
        ...prev,
        aiProvider: { ...prev.aiProvider, isValidated: true }
      }));
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-5 space-y-4">
        {/* Header indicator */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-900">Welcome to OpenApply</span>
          </div>
          <Badge color="emerald">Step {step} of 4</Badge>
        </div>

        {/* Step 1: Welcome & Privacy Commitment */}
        {step === 1 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Your Privacy-First Job Search Copilot</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              OpenApply puts you back in control of your LinkedIn experience. Filter noise, dim sponsored listings, and
              keep 100% of your data private inside your browser.
            </p>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs space-y-1.5">
              <div className="font-semibold flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600" /> 100% Client-Side Privacy
              </div>
              <p className="text-[11px] text-emerald-700">
                Your credentials and browsing activity are stored locally using bank-grade AES-256 browser storage
                encryption. Zero tracking servers.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Job Board Display Preferences */}
        {step === 2 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Configure Display Preferences</h2>
            <p className="text-xs text-slate-600">Choose how noisy postings are presented on your job feed.</p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <ToggleSwitch
                label="Hide or dim sponsored and promoted job postings"
                checked={tempConfig.preferences.hidePromotedJobs}
                onChange={(checked) =>
                  setTempConfig({
                    ...tempConfig,
                    preferences: { ...tempConfig.preferences, hidePromotedJobs: checked }
                  })
                }
              />
              <div className="pt-2 border-t border-slate-200">
                <ToggleSwitch
                  label="Hide or dim jobs that already have a high applicant volume"
                  checked={tempConfig.preferences.hideHighApplicantJobs}
                  onChange={(checked) =>
                    setTempConfig({
                      ...tempConfig,
                      preferences: { ...tempConfig.preferences, hideHighApplicantJobs: checked }
                    })
                  }
                />
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-xs text-slate-600">Maximum Applicant Threshold</span>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    value={tempConfig.preferences.maxApplicantThreshold}
                    onChange={(e) =>
                      setTempConfig({
                        ...tempConfig,
                        preferences: {
                          ...tempConfig.preferences,
                          maxApplicantThreshold: parseInt(e.target.value, 10) || 50
                        }
                      })
                    }
                    className="w-16 px-2 py-1 text-xs font-mono font-bold text-slate-800 bg-white border border-slate-200 rounded text-right"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: ChatGPT API Key Setup */}
        {step === 3 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">ChatGPT AI Key Setup (BYOK)</h2>
            <p className="text-xs text-slate-600">
              Enter your personal OpenAI API key to power ATS scorecards and cover letter tailoring.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-600" /> OpenAI API Key (<span className="font-mono">sk-...</span>
                )
              </label>
              <input
                type="password"
                placeholder="sk-proj-..."
                value={tempConfig.aiProvider.apiKey}
                onChange={(e) => {
                  setValidationState('idle');
                  setTempConfig({
                    ...tempConfig,
                    aiProvider: { ...tempConfig.aiProvider, apiKey: e.target.value, isValidated: false }
                  });
                }}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded font-mono text-slate-900"
              />
              <div className="flex items-center justify-between pt-1">
                <Button size="sm" variant="outline" onClick={testApiKey}>
                  {validationState === 'testing' ? 'Validating...' : 'Test Connection'}
                </Button>
                {validationState === 'valid' && (
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Key Validated
                  </span>
                )}
                {validationState === 'invalid' && (
                  <span className="text-[11px] text-red-600 font-semibold">Invalid API Key Pattern</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Optional Analytics Consent */}
        {step === 4 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Usage Analytics Preferences</h2>
            <p className="text-xs text-slate-600">
              Help improve OpenApply with completely anonymous usage metrics. No personal data or keys are ever
              collected.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-semibold text-slate-800">Anonymous Telemetry</span>
              </div>
              <ToggleSwitch
                label="Help improve OpenApply with anonymous usage metrics"
                checked={tempConfig.analytics.optIn}
                onChange={(checked) =>
                  setTempConfig({
                    ...tempConfig,
                    analytics: { ...tempConfig.analytics, optIn: checked }
                  })
                }
              />
              <p className="text-[10px] text-slate-500 mt-1">Default is OFF. Strictly guarded by opt-in consent.</p>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          {step > 1 ? (
            <Button size="sm" variant="outline" onClick={handleBack}>
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Button>
          ) : (
            <div></div>
          )}
          <Button size="sm" variant="primary" onClick={handleNext}>
            {step === 4 ? 'Complete Onboarding' : 'Next'} <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
