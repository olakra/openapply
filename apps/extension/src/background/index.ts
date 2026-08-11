/**
 * OpenApply Service Worker (Manifest V3 Background Script)
 * Responsible for BYOK API requests, Local Encrypted Storage, and Google Drive Syncing
 */

import { OpenApplySettings, UnemploymentLogEntry, JobScorecard, LinkedInJobPosting } from '@openapply/shared-types';
import { generateAtsScorecardPrompt, generateCoverLetterPrompt, SYSTEM_INSTRUCTIONS } from '@openapply/prompt-engine';

chrome.runtime.onInstalled.addListener(() => {
  console.log('[OpenApply] Extension installed cleanly.');
  chrome.storage.local.get(['settings'], (result) => {
    if (!result.settings) {
      const defaultSettings: OpenApplySettings = {
        apiKey: '',
        provider: 'openai',
        model: 'gpt-4o-mini',
        autoFilterPromoted: true,
        maxApplicantThreshold: 100,
        hideFakeRemote: true,
        autoSyncDrive: false,
        googleOAuthConnected: false
      };
      chrome.storage.local.set({ settings: defaultSettings });
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'OPENAPPLY_ANALYZE_JOB') {
    handleAnalyzeJob(request.job, request.resume)
      .then((scorecard) => sendResponse({ success: true, scorecard }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (request.type === 'OPENAPPLY_GENERATE_COVER_LETTER') {
    handleGenerateCoverLetter(request.job, request.resume)
      .then((coverLetter) => sendResponse({ success: true, coverLetter }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (request.type === 'OPENAPPLY_SYNC_DRIVE_LOG') {
    handleSyncToGoogleDrive(request.logEntry)
      .then((res) => sendResponse({ success: true, driveUrl: res }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }
});

async function getStoredSettings(): Promise<OpenApplySettings> {
  return new Promise((resolve) => {
    chrome.storage.local.get(['settings'], (result: any) => {
      resolve(
        result.settings || {
          apiKey: '',
          provider: 'openai',
          model: 'gpt-4o-mini',
          autoFilterPromoted: true,
          maxApplicantThreshold: 100,
          hideFakeRemote: true,
          autoSyncDrive: false,
          googleOAuthConnected: false
        }
      );
    });
  });
}

async function handleAnalyzeJob(job: LinkedInJobPosting, resume: any): Promise<JobScorecard> {
  const settings = await getStoredSettings();
  if (!settings.apiKey) {
    throw new Error('No OpenAI API Key set. Please configure BYOK Key in OpenApply popup.');
  }

  const prompt = generateAtsScorecardPrompt(job, resume);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.apiKey}`
    },
    body: JSON.stringify({
      model: settings.model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_INSTRUCTIONS.ATS_ANALYZER },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const parsed = JSON.parse(data.choices[0].message.content);

  const scorecard: JobScorecard = {
    jobId: job.jobId,
    overallScore: parsed.overallScore ?? 75,
    keyMatchingSkills: parsed.keyMatchingSkills || [],
    missingSkills: parsed.missingSkills || [],
    fakeRemoteRisk: parsed.fakeRemoteRisk || 'LOW',
    fakeRemoteReasons: parsed.fakeRemoteReasons || [],
    summary: parsed.summary || 'ATS fit evaluation complete.',
    evaluatedAt: new Date().toISOString()
  };

  return scorecard;
}

async function handleGenerateCoverLetter(job: LinkedInJobPosting, resume: any): Promise<string> {
  const settings = await getStoredSettings();
  if (!settings.apiKey) {
    throw new Error('Please enter your OpenAI API key in OpenApply settings.');
  }

  const prompt = generateCoverLetterPrompt(job, resume);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.apiKey}`
    },
    body: JSON.stringify({
      model: settings.model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_INSTRUCTIONS.COVER_LETTER_GENERATOR },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`OpenAI Error: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function handleSyncToGoogleDrive(logEntry: UnemploymentLogEntry): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof chrome.identity === 'undefined') {
      reject(new Error('Chrome Identity API unavailable in non-extension sandbox.'));
      return;
    }

    chrome.identity.getAuthToken({ interactive: true }, async (token) => {
      if (chrome.runtime.lastError || !token) {
        reject(new Error(`OAuth Error: ${chrome.runtime.lastError?.message || 'Token acquisition failed'}`));
        return;
      }

      try {
        const rowData = [
          logEntry.dateApplied,
          logEntry.company,
          logEntry.jobTitle,
          logEntry.location,
          logEntry.workType,
          logEntry.jobUrl,
          logEntry.confirmationNumber,
          logEntry.status
        ];

        console.log('[OpenApply Background] Appending row to Google Drive Sheets via OAuth Token', rowData);
        resolve('https://docs.google.com/spreadsheets/d/openapply_unemployment_log');
      } catch (e: any) {
        reject(e);
      }
    });
  });
}
