import React, { useState, useEffect } from 'react';
import { 
  Shield, Key, Filter, FileText, HardDrive, Download, Eye, Sparkles, 
  CheckCircle2, AlertTriangle, ExternalLink, Code2, Copy, RefreshCw, 
  Briefcase, Search, Plus, Trash2, Check, User, ArrowRight, BookOpen, 
  ShieldCheck, Layers, FileSpreadsheet, Lock
} from 'lucide-react';

import { OpenApplyPopupUI } from '../apps/extension/src/popup/App';
import { SAMPLE_LINKEDIN_JOBS } from './lib/sample-data';
import { 
  getStoredSettings, saveStoredSettings, getStoredResume, saveStoredResume, 
  getUnemploymentLogs, addUnemploymentLog 
} from './lib/storage';
import { executeAtsAnalysis, executeCoverLetterGeneration } from './lib/ai-engine';
import { generateProofConfirmationCode, exportLogsToCsv } from './lib/drive-sync';
import { 
  LinkedInJobPosting, UserResume, OpenApplySettings, JobScorecard, 
  UnemploymentLogEntry 
} from '@openapply/shared-types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'popup' | 'unemployment' | 'resume' | 'code'>('simulator');
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

  const [resume, setResume] = useState<UserResume | null>(null);
  const [unemploymentLogs, setLogs] = useState<UnemploymentLogEntry[]>([]);
  const [selectedJob, setSelectedJob] = useState<LinkedInJobPosting>(SAMPLE_LINKEDIN_JOBS[0]);
  
  // AI State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeScorecard, setActiveScorecard] = useState<JobScorecard | null>(null);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState<boolean>(false);
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<string | null>(null);
  
  // Toast / Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedCodeFile, setCopiedCodeFile] = useState<string | null>(null);
  const [selectedCodeFile, setSelectedCodeFile] = useState<'manifest' | 'content' | 'background' | 'types' | 'prompts'>('manifest');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const s = await getStoredSettings();
    const r = await getStoredResume();
    const l = await getUnemploymentLogs();
    setSettings(s);
    setResume(r);
    setLogs(l);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Perform AI ATS Analysis
  const handleAnalyzeJob = async (job: LinkedInJobPosting) => {
    if (!resume) return;
    setIsAnalyzing(true);
    setActiveScorecard(null);
    try {
      const scorecard = await executeAtsAnalysis(job, resume, settings.apiKey);
      setActiveScorecard(scorecard);
      showToast(`ATS Analysis Complete: ${scorecard.overallScore}% Match Score`);
    } catch (e: any) {
      showToast(`Error: ${e.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate BYOK Cover Letter
  const handleGenerateCoverLetter = async (job: LinkedInJobPosting) => {
    if (!resume) return;
    setIsGeneratingCoverLetter(true);
    try {
      const letter = await executeCoverLetterGeneration(job, resume, settings.apiKey);
      setGeneratedCoverLetter(letter);
      showToast('Custom 3-paragraph Cover Letter generated!');
    } catch (e: any) {
      showToast(`Cover Letter Error: ${e.message}`);
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  // Log Application for State Unemployment Claim Compliance
  const handleLogUnemploymentProof = async (job: LinkedInJobPosting) => {
    const proofCode = generateProofConfirmationCode(job.jobId, job.company);
    const newEntry: UnemploymentLogEntry = {
      id: 'log_' + Date.now(),
      dateApplied: new Date().toISOString().slice(0, 10),
      company: job.company,
      jobTitle: job.title,
      location: job.location,
      workType: job.isRemote ? 'Remote' : 'Hybrid',
      jobUrl: job.url,
      jobId: job.jobId,
      confirmationNumber: proofCode,
      status: 'Applied',
      syncedToDrive: settings.autoSyncDrive && settings.googleOAuthConnected,
      notes: `Logged automatically via OpenApply Manifest V3 Extension`
    };

    const updated = await addUnemploymentLog(newEntry);
    setLogs(updated);
    showToast(`Logged application proof for ${job.company} (${proofCode})!`);
  };

  // Code inspection contents
  const CODE_FILES = {
    manifest: {
      name: 'apps/extension/manifest.json',
      lang: 'json',
      content: `{
  "manifest_version": 3,
  "name": "OpenApply - Privacy-First Job Copilot",
  "version": "1.0.0",
  "description": "Filter LinkedIn jobs, detect fake remote listings, generate BYOK cover letters, and log applications to Google Drive for US unemployment compliance.",
  "permissions": ["storage", "activeTab", "scripting", "identity"],
  "host_permissions": ["https://*.linkedin.com/*"],
  "action": {
    "default_popup": "popup.html",
    "default_title": "OpenApply Settings & Controls"
  },
  "content_scripts": [
    {
      "matches": ["https://*.linkedin.com/jobs/*"],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ],
  "background": {
    "service_worker": "background.js",
    "type": "module"
  }
}`
    },
    content: {
      name: 'apps/extension/src/content/index.ts',
      lang: 'typescript',
      content: `// LinkedIn DOM Parsing & Filtering Content Script
export async function calculateJobHash(jobId: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(jobId);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export class LinkedInJobFilterEngine {
  // Dims Promoted & listings with >100 applicants
  public async processJobListings() {
    const cards = document.querySelectorAll('.job-card-container');
    cards.forEach(card => {
      if (card.innerText.includes('Promoted') || card.innerText.match(/(\\d+)\\+? applicants/)?.[1] > 100) {
        card.style.opacity = '0.35';
        card.setAttribute('title', '[OpenApply] Dimmed by filter');
      }
    });
  }
}`
    },
    background: {
      name: 'apps/extension/src/background/index.ts',
      lang: 'typescript',
      content: `// Background Service Worker for BYOK Requests & Drive Syncing
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'OPENAPPLY_ANALYZE_JOB') {
    handleAnalyzeJob(request.job, request.resume)
      .then((scorecard) => sendResponse({ success: true, scorecard }));
    return true;
  }
});`
    },
    types: {
      name: 'packages/shared-types/index.ts',
      lang: 'typescript',
      content: `export interface JobScorecard {
  jobId: string;
  overallScore: number;
  keyMatchingSkills: string[];
  missingSkills: string[];
  fakeRemoteRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  fakeRemoteReasons: string[];
  summary: string;
}`
    },
    prompts: {
      name: 'packages/prompt-engine/index.ts',
      lang: 'typescript',
      content: `export const SYSTEM_INSTRUCTIONS = {
  ATS_ANALYZER: "You are OpenApply's ATS Engine. Analyze job description vs candidate resume...",
  COVER_LETTER_GENERATOR: "Write a custom 3-paragraph cover letter targeting top key requirements..."
};`
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header / Branding */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-0.5 shadow-xs">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">OpenApply</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  Manifest V3 Monorepo
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Open-Source, BYOK Privacy-First LinkedIn Extension & Unemployment Log Copilot
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <a
              href="https://github.com/olakra/openapply"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg flex items-center gap-1.5 transition font-medium shadow-2xs"
            >
              <Code2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">github.com/olakra/openapply</span>
              <span className="md:hidden">GitHub</span>
            </a>
            <div className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg flex items-center gap-1.5 font-mono text-[11px] font-medium">
              <Lock className="w-3 h-3 text-slate-500" />
              <span>GPL-3.0</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 overflow-x-auto border-t border-slate-200 pt-1">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-slate-100 text-slate-900 border-emerald-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>LinkedIn Content Script Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('popup')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'popup'
                ? 'bg-slate-100 text-slate-900 border-emerald-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Extension Popup Workbench</span>
          </button>

          <button
            onClick={() => setActiveTab('unemployment')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'unemployment'
                ? 'bg-slate-100 text-slate-900 border-emerald-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Unemployment Compliance Log ({unemploymentLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('resume')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'resume'
                ? 'bg-slate-100 text-slate-900 border-emerald-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Candidate Resume Config</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-slate-100 text-slate-900 border-emerald-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Monorepo Code Inspector</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* TAB 1: LINKEDIN SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            {/* Top Info Banner */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Interactive LinkedIn Content Script Sandbox
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Simulating OpenApply Manifest V3 content script running on <code className="text-emerald-700 font-mono font-semibold">https://linkedin.com/jobs/*</code>.
                  Promoted and high-applicant listings are automatically dimmed.
                </p>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Filter Promoted:</span>
                  <span className={`font-semibold ${settings.autoFilterPromoted ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {settings.autoFilterPromoted ? 'ACTIVE' : 'OFF'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Max Applicants Limit:</span>
                  <span className="font-mono font-semibold text-emerald-700">{settings.maxApplicantThreshold}</span>
                </div>
              </div>
            </div>

            {/* Split Screen: Job Board + Job Details & OpenApply Action Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Simulated LinkedIn Job Search Results */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-emerald-600" />
                    LinkedIn Jobs Feed (4 Results)
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">DOM Scraper Running</span>
                </div>

                <div className="space-y-2.5">
                  {SAMPLE_LINKEDIN_JOBS.map((job) => {
                    const isPromotedFiltered = settings.autoFilterPromoted && job.isPromoted;
                    const isApplicantFiltered = job.applicantCount > settings.maxApplicantThreshold;
                    const isDimmed = isPromotedFiltered || isApplicantFiltered;

                    return (
                      <div
                        key={job.jobId}
                        onClick={() => setSelectedJob(job)}
                        className={`p-3.5 rounded-xl border transition cursor-pointer relative ${
                          selectedJob.jobId === job.jobId
                            ? 'bg-emerald-50/60 border-emerald-500 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                        } ${isDimmed ? 'opacity-40 grayscale-[70%]' : 'opacity-100'}`}
                      >
                        {isDimmed && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-semibold flex items-center gap-1">
                            <Filter className="w-3 h-3" />
                            {isPromotedFiltered ? 'Promoted Listing Dimmed' : `> ${settings.maxApplicantThreshold} Applicants`}
                          </div>
                        )}

                        <div className="pr-12">
                          <h3 className="text-xs font-bold text-slate-900 hover:text-emerald-700 transition">
                            {job.title}
                          </h3>
                          <p className="text-[11px] text-slate-600 font-medium mt-0.5">{job.company}</p>
                          <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                            <span>📍 {job.location}</span>
                            <span>•</span>
                            <span>👥 {job.applicantCount} applicants</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Selected Job Details & Embedded OpenApply Floating Bar */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 space-y-5 shadow-xs">
                {/* Job Title Header */}
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">{selectedJob.title}</h2>
                      <p className="text-xs text-emerald-700 font-semibold">{selectedJob.company} • {selectedJob.location}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded border border-slate-200">
                      ID: SHA256({selectedJob.jobId.slice(0, 6)})
                    </span>
                  </div>
                </div>

                {/* OpenApply Embedded Floating Action Bar (Injected into DOM) */}
                <div className="p-4 bg-slate-900 border-2 border-emerald-500 rounded-xl space-y-3 shadow-md text-white">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">OpenApply Injected Action Bar</span>
                    </div>
                    <span className="text-[10px] text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                      BYOK Active
                    </span>
                  </div>

                  {/* Primary Extension Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => handleAnalyzeJob(selectedJob)}
                      disabled={isAnalyzing}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      {isAnalyzing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>1-Click ATS Score</span>
                    </button>

                    <button
                      onClick={() => handleGenerateCoverLetter(selectedJob)}
                      disabled={isGeneratingCoverLetter}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      {isGeneratingCoverLetter ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                      <span>AI Cover Letter</span>
                    </button>

                    <button
                      onClick={() => handleLogUnemploymentProof(selectedJob)}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>Log Application Proof</span>
                    </button>
                  </div>

                  {/* Scorecard Results Display */}
                  {activeScorecard && (
                    <div className="mt-3 p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">ATS Fit Score:</span>
                        <span className={`text-sm font-black font-mono px-2 py-0.5 rounded ${
                          activeScorecard.overallScore >= 80 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {activeScorecard.overallScore}% MATCH
                        </span>
                      </div>

                      {activeScorecard.fakeRemoteRisk === 'HIGH' && (
                        <div className="p-2 bg-red-950/80 border border-red-800 text-red-300 text-[11px] rounded flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <strong>Fake Remote Warning Detected:</strong>
                            <p className="mt-0.5 text-[10px]">{activeScorecard.summary}</p>
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-slate-300">{activeScorecard.summary}</p>

                      <div className="text-[11px] space-y-1">
                        <div>
                          <strong className="text-emerald-400">Matching Skills: </strong>
                          <span className="text-slate-300">{activeScorecard.keyMatchingSkills.join(', ')}</span>
                        </div>
                        {activeScorecard.missingSkills.length > 0 && (
                          <div>
                            <strong className="text-amber-400">Missing Qualifications: </strong>
                            <span className="text-slate-400">{activeScorecard.missingSkills.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Generated Cover Letter Preview */}
                  {generatedCoverLetter && (
                    <div className="mt-3 p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-slate-100">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                        <span className="text-xs font-bold text-indigo-300">Generated 3-Paragraph Cover Letter</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(generatedCoverLetter);
                            showToast('Cover letter copied to clipboard!');
                          }}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] rounded flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" /> Copy
                        </button>
                      </div>
                      <textarea
                        readOnly
                        rows={6}
                        value={generatedCoverLetter}
                        className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded border border-slate-800 font-sans focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Job Full Description Text */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Job Description</h3>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed whitespace-pre-line font-sans">
                    {selectedJob.description}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EXTENSION POPUP WORKBENCH */}
        {activeTab === 'popup' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  Live Extension Popup Simulator (`apps/extension/src/popup/App.tsx`)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Test the actual Manifest V3 Extension Popup interface rendered in real-time.
                </p>
              </div>
            </div>

            <div className="flex justify-center py-4">
              <OpenApplyPopupUI />
            </div>
          </div>
        )}

        {/* TAB 3: UNEMPLOYMENT LOG */}
        {activeTab === 'unemployment' && (
          <div className="space-y-6">
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  State Unemployment Job Search Compliance Logs
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Audit-proof record of job applications with unique confirmation codes for state work-search verification (EDD / TWC / NY DOL).
                </p>
              </div>

              <button
                onClick={() => exportLogsToCsv(unemploymentLogs)}
                disabled={unemploymentLogs.length === 0}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Audit CSV ({unemploymentLogs.length})</span>
              </button>
            </div>

            {/* Logs Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              {unemploymentLogs.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No job applications logged yet.</p>
                  <p className="text-[11px] text-slate-500 mt-1">Use the LinkedIn simulator to click "Log Application Proof" on any position.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">Company</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Work Type</th>
                        <th className="p-3 font-mono">Proof Code</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Google Drive Sync</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {unemploymentLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-3 font-mono font-medium text-slate-800">{log.dateApplied}</td>
                          <td className="p-3 font-bold text-slate-900">{log.company}</td>
                          <td className="p-3 text-slate-800">{log.jobTitle}</td>
                          <td className="p-3 text-slate-600">{log.workType}</td>
                          <td className="p-3 font-mono text-emerald-700 font-bold text-[11px]">{log.confirmationNumber}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {log.status}
                            </span>
                          </td>
                          <td className="p-3 text-[11px]">
                            {log.syncedToDrive ? (
                              <span className="text-blue-600 flex items-center gap-1 font-medium">
                                <Check className="w-3.5 h-3.5" /> Synced to Drive
                              </span>
                            ) : (
                              <span className="text-slate-400 font-mono">Local Only</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CANDIDATE RESUME CONFIG */}
        {activeTab === 'resume' && resume && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  Candidate Resume Profile Configuration
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Used locally by OpenApply's prompt engine to calculate ATS match scores and craft cover letters.
                </p>
              </div>
              <button
                onClick={() => {
                  saveStoredResume(resume);
                  showToast('Candidate resume profile saved locally!');
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer"
              >
                Save Profile
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resume.fullName}
                    onChange={(e) => setResume({ ...resume, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={resume.email}
                    onChange={(e) => setResume({ ...resume, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Summary</label>
                <textarea
                  rows={3}
                  value={resume.summary}
                  onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={resume.skills.join(', ')}
                  onChange={(e) => setResume({ ...resume, skills: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Roles</label>
                <input
                  type="text"
                  value={resume.targetRoles.join(', ')}
                  onChange={(e) => setResume({ ...resume, targetRoles: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MONOREPO CODE INSPECTOR */}
        {activeTab === 'code' && (
          <div className="space-y-6">
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  Monorepo Architecture & Manifest V3 Code Inspector
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspect generated Manifest V3 Extension files, shared schemas, and typed prompt engines.
                </p>
              </div>

              <button
                onClick={() => {
                  const zipBlob = new Blob([JSON.stringify(CODE_FILES, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(zipBlob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'openapply_manifest_v3_extension_files.json';
                  a.click();
                  showToast('Downloaded OpenApply extension bundle files!');
                }}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export Bundle Files
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* File Selector */}
              <div className="md:col-span-4 bg-white border border-slate-200 rounded-xl p-3 space-y-1 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 block">
                  Monorepo File Structure
                </span>

                {Object.entries(CODE_FILES).map(([key, file]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCodeFile(key as any)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition flex items-center justify-between cursor-pointer ${
                      selectedCodeFile === key
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{file.name}</span>
                  </button>
                ))}
              </div>

              {/* Code Viewer */}
              <div className="md:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-xs">
                <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {CODE_FILES[selectedCodeFile].name}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(CODE_FILES[selectedCodeFile].content);
                      setCopiedCodeFile(selectedCodeFile);
                      setTimeout(() => setCopiedCodeFile(null), 2000);
                      showToast('File content copied to clipboard!');
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] rounded flex items-center gap-1 font-medium cursor-pointer"
                  >
                    {copiedCodeFile === selectedCodeFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCodeFile === selectedCodeFile ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>

                <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto bg-slate-950/90 leading-relaxed max-h-[500px]">
                  {CODE_FILES[selectedCodeFile].content}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
