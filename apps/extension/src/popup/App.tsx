import React, { useState, useEffect } from 'react';
import { Shield, Key, FileText, HardDrive, Filter, CheckCircle2, AlertTriangle, ExternalLink, RefreshCw, Zap } from 'lucide-react';
import { OpenApplySettings, UnemploymentLogEntry } from '@openapply/shared-types';

export function OpenApplyPopupUI() {
  const [settings, setSettings] = useState<OpenApplySettings>({
    apiKey: '',
    provider: 'openai',
    model: 'gpt-4o-mini',
    autoFilterPromoted: true,
    maxApplicantThreshold: 100,
    hideFakeRemote: true,
    autoSyncDrive: false,
    googleOAuthConnected: false,
    unemploymentStateCode: 'US-GENERIC'
  });

  const [savedStatus, setSavedStatus] = useState<string | null>(null);
  const [recentLogsCount, setRecentLogsCount] = useState<number>(0);
  const [isKeyVisible, setIsKeyVisible] = useState<boolean>(false);

  useEffect(() => {
    // Read from chrome.storage.local or localStorage
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['settings', 'unemploymentLogs'], (res: any) => {
        if (res.settings) setSettings(res.settings);
        if (res.unemploymentLogs) setRecentLogsCount(res.unemploymentLogs.length);
      });
    } else {
      const local = localStorage.getItem('openapply_settings');
      if (local) setSettings(JSON.parse(local));
      const logs = localStorage.getItem('openapply_unemployment_logs');
      if (logs) setRecentLogsCount(JSON.parse(logs).length);
    }
  }, []);

  const saveSettings = (newSettings: OpenApplySettings) => {
    setSettings(newSettings);
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ settings: newSettings });
    } else {
      localStorage.setItem('openapply_settings', JSON.stringify(newSettings));
    }
    setSavedStatus('Settings saved locally');
    setTimeout(() => setSavedStatus(null), 2500);
  };

  const handleConnectGoogleDrive = () => {
    const updated = { ...settings, googleOAuthConnected: !settings.googleOAuthConnected };
    saveSettings(updated);
  };

  return (
    <div className="w-[380px] bg-white text-slate-900 p-4 font-sans select-none border border-slate-200 rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              OpenApply <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-semibold">v1.0 MV3</span>
            </h1>
            <p className="text-[11px] text-slate-500">BYOK Privacy-First LinkedIn Copilot</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
            100% Client BYOK
          </span>
        </div>
      </div>

      {/* Main Form Settings */}
      <div className="space-y-3">
        {/* OpenAI Key Input */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-600" /> OpenAI API Key (BYOK)
            </span>
            <button
              onClick={() => setIsKeyVisible(!isKeyVisible)}
              className="text-[10px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              {isKeyVisible ? 'Hide' : 'Show'}
            </button>
          </label>
          <input
            type={isKeyVisible ? 'text' : 'password'}
            placeholder="sk-proj-..."
            value={settings.apiKey}
            onChange={(e) => saveSettings({ ...settings, apiKey: e.target.value })}
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
          />
          <p className="mt-1 text-[10px] text-slate-500 flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-600 inline shrink-0" /> Stored locally in browser. Never sent to external servers.
          </p>
        </div>

        {/* Filters Toggles */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
          <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
            <Filter className="w-3.5 h-3.5 text-indigo-600" /> LinkedIn Smart Filters
          </div>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-xs text-slate-700 group-hover:text-slate-900 transition font-medium">Filter Promoted Listings</span>
            <input
              type="checkbox"
              checked={settings.autoFilterPromoted}
              onChange={(e) => saveSettings({ ...settings, autoFilterPromoted: e.target.checked })}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
          </label>

          <div className="pt-1 border-t border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-700 font-medium">Max Applicants Threshold</span>
              <span className="text-xs font-mono font-bold text-emerald-700">{settings.maxApplicantThreshold}</span>
            </div>
            <input
              type="range"
              min="20"
              max="300"
              step="10"
              value={settings.maxApplicantThreshold}
              onChange={(e) => saveSettings({ ...settings, maxApplicantThreshold: parseInt(e.target.value, 10) })}
              className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500 mt-0.5">Dims job cards with more than {settings.maxApplicantThreshold} applicants.</p>
          </div>
        </div>

        {/* Google Drive Unemployment Log Sync */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-blue-600" /> Google Drive Log Sync
            </span>
            <button
              onClick={handleConnectGoogleDrive}
              className={`px-2 py-0.5 text-[10px] font-semibold rounded border transition cursor-pointer ${
                settings.googleOAuthConnected
                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {settings.googleOAuthConnected ? 'Connected ✓' : 'Connect Drive'}
            </button>
          </div>

          <label className="flex items-center justify-between cursor-pointer pt-1">
            <span className="text-xs text-slate-700 font-medium">Auto-Export to Drive Sheets</span>
            <input
              type="checkbox"
              disabled={!settings.googleOAuthConnected}
              checked={settings.autoSyncDrive}
              onChange={(e) => saveSettings({ ...settings, autoSyncDrive: e.target.checked })}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer disabled:opacity-40"
            />
          </label>
          <p className="text-[10px] text-slate-500">
            Automatically appends application proof & confirmation hashes to your personal Google Sheet for state unemployment compliance audit readiness.
          </p>
        </div>
      </div>

      {/* Footer info & saved notification */}
      <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center space-x-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>Logged Applications: <strong className="text-slate-800">{recentLogsCount}</strong></span>
        </div>
        {savedStatus ? (
          <span className="text-emerald-700 font-bold text-[10px] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {savedStatus}
          </span>
        ) : (
          <span className="text-slate-400 text-[10px]">GPL-3.0 Open Source</span>
        )}
      </div>
    </div>
  );
}

export default OpenApplyPopupUI;
