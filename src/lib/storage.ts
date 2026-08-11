import { OpenApplySettings, UserResume, UnemploymentLogEntry, JobScorecard } from '@openapply/shared-types';

const STORAGE_KEYS = {
  SETTINGS: 'openapply_settings',
  RESUME: 'openapply_user_resume',
  LOGS: 'openapply_unemployment_logs',
  SCORECARDS: 'openapply_job_scorecards'
};

export const DEFAULT_SETTINGS: OpenApplySettings = {
  apiKey: '',
  provider: 'openai',
  model: 'gpt-4o-mini',
  autoFilterPromoted: true,
  maxApplicantThreshold: 100,
  hideFakeRemote: true,
  autoSyncDrive: false,
  googleOAuthConnected: false,
  unemploymentStateCode: 'US-GENERIC'
};

export const DEFAULT_RESUME: UserResume = {
  fullName: 'Alex Morgan',
  email: 'alex.morgan.tech@gmail.com',
  phone: '+1 (555) 382-9011',
  location: 'San Francisco, CA (Open to Remote)',
  summary: 'Senior Full Stack Software Engineer with 6+ years of experience building scalable TypeScript, React, Node.js, and cloud systems. Specialized in performance optimization and API design.',
  skills: ['TypeScript', 'React', 'Node.js', 'Next.js', 'Python', 'GraphQL', 'Tailwind CSS', 'Docker', 'PostgreSQL', 'AWS'],
  workHistory: [
    {
      company: 'Apex Cloud Solutions',
      role: 'Senior Software Engineer',
      duration: '2022 - 2025',
      highlights: [
        'Architected real-time microservices handling 2.5M daily active users with 99.99% uptime.',
        'Led team of 5 engineers migrating legacy monolithic React app to Vite/TypeScript monorepo, boosting build speeds by 300%.',
        'Implemented automated CI/CD pipelines reducing deployment friction.'
      ]
    },
    {
      company: 'Nexus Software Labs',
      role: 'Full Stack Engineer',
      duration: '2019 - 2022',
      highlights: [
        'Built interactive web analytics dashboard using React, D3.js, and Express.',
        'Optimized SQL query response times by 45% through index restructuring.'
      ]
    }
  ],
  education: [
    {
      institution: 'University of California, Berkeley',
      degree: 'B.S. Computer Science',
      year: '2019'
    }
  ],
  targetRoles: ['Senior Software Engineer', 'Full Stack Engineer', 'Frontend Tech Lead'],
  customInstructions: 'Highlight experience with TypeScript monorepos, React performance, and modern cloud design.'
};

export async function getStoredSettings(): Promise<OpenApplySettings> {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    return new Promise((resolve) => {
      chrome.storage.local.get(['settings'], (res: any) => {
        resolve(res.settings || DEFAULT_SETTINGS);
      });
    });
  }
  const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
}

export async function saveStoredSettings(settings: OpenApplySettings): Promise<void> {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({ settings });
  } else {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }
}

export async function getStoredResume(): Promise<UserResume> {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    return new Promise((resolve) => {
      chrome.storage.local.get(['resume'], (res: any) => {
        resolve(res.resume || DEFAULT_RESUME);
      });
    });
  }
  const raw = localStorage.getItem(STORAGE_KEYS.RESUME);
  return raw ? JSON.parse(raw) : DEFAULT_RESUME;
}

export async function saveStoredResume(resume: UserResume): Promise<void> {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({ resume });
  } else {
    localStorage.setItem(STORAGE_KEYS.RESUME, JSON.stringify(resume));
  }
}

export async function getUnemploymentLogs(): Promise<UnemploymentLogEntry[]> {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    return new Promise((resolve) => {
      chrome.storage.local.get(['unemploymentLogs'], (res: any) => {
        resolve(res.unemploymentLogs || []);
      });
    });
  }
  const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
  return raw ? JSON.parse(raw) : [];
}

export async function addUnemploymentLog(entry: UnemploymentLogEntry): Promise<UnemploymentLogEntry[]> {
  const current = await getUnemploymentLogs();
  const updated = [entry, ...current];
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({ unemploymentLogs: updated });
  } else {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
  }
  return updated;
}
