import { OpenApplySettings, UserResume, UnemploymentLogEntry } from '@openapply/shared-types';

const STORAGE_KEYS = {
  SETTINGS: 'openapply_settings',
  RESUME: 'openapply_user_resume',
  LOGS: 'openapply_unemployment_logs',
  SCORECARDS: 'openapply_job_scorecards'
};

/**
 * Default fallback configuration settings object.
 */
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

/**
 * Default sample resume profile for local demo preview.
 */
export const DEFAULT_RESUME: UserResume = {
  fullName: 'Alex Morgan',
  email: 'alex.morgan.tech@gmail.com',
  phone: '+1 (555) 382-9011',
  location: 'San Francisco, CA (Open to Remote)',
  summary:
    'Senior Full Stack Software Engineer with 6+ years of experience building scalable TypeScript, React, Node.js, and cloud systems. Specialized in performance optimization and API design.',
  skills: [
    'TypeScript',
    'React',
    'Node.js',
    'Next.js',
    'Python',
    'GraphQL',
    'Tailwind CSS',
    'Docker',
    'PostgreSQL',
    'AWS'
  ],
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

/**
 * Retrieves stored application settings from Chrome extension storage or LocalStorage.
 * @returns Settings configuration object promise
 */
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

/**
 * Saves updated application settings to Chrome storage or LocalStorage.
 * @param settings - Updated settings configuration object
 */
export async function saveStoredSettings(settings: OpenApplySettings): Promise<void> {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({ settings });
  } else {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }
}

/**
 * Retrieves candidate resume profile from Chrome storage or LocalStorage.
 * @returns UserResume object promise
 */
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

/**
 * Saves updated candidate resume profile to Chrome storage or LocalStorage.
 * @param resume - Updated candidate resume profile
 */
export async function saveStoredResume(resume: UserResume): Promise<void> {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({ resume });
  } else {
    localStorage.setItem(STORAGE_KEYS.RESUME, JSON.stringify(resume));
  }
}

/**
 * Retrieves list of logged unemployment applications.
 * @returns List of UnemploymentLogEntry items
 */
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

/**
 * Adds a new unemployment application entry to persistent storage.
 * @param entry - UnemploymentLogEntry item
 * @returns Updated array of UnemploymentLogEntry items
 */
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

const USER_CONFIG_STORAGE_KEY = 'openapply_user_config';

/**
 * Retrieves the full OpenApplyUserConfig from storage.
 * Automatically decrypts the AI API key if encrypted and ensures an anonymous clientId exists.
 * @returns Promise resolving to OpenApplyUserConfig
 */
export async function getUserConfig(): Promise<import('@openapply/shared-types').OpenApplyUserConfig> {
  const { DEFAULT_USER_CONFIG } = await import('@openapply/shared-types');
  const { CryptoVaultService } = await import('../infrastructure/security/CryptoVaultService');

  let rawConfig: any = null;

  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    rawConfig = await new Promise((resolve) => {
      chrome.storage.local.get(['userConfig'], (res: any) => {
        resolve(res.userConfig || null);
      });
    });
  } else {
    const raw = localStorage.getItem(USER_CONFIG_STORAGE_KEY);
    if (raw) {
      try {
        rawConfig = JSON.parse(raw);
      } catch {
        rawConfig = null;
      }
    }
  }

  const mergedConfig: import('@openapply/shared-types').OpenApplyUserConfig = {
    onboardingCompleted: rawConfig?.onboardingCompleted ?? DEFAULT_USER_CONFIG.onboardingCompleted,
    preferences: {
      hidePromotedJobs: rawConfig?.preferences?.hidePromotedJobs ?? DEFAULT_USER_CONFIG.preferences.hidePromotedJobs,
      hideHighApplicantJobs:
        rawConfig?.preferences?.hideHighApplicantJobs ?? DEFAULT_USER_CONFIG.preferences.hideHighApplicantJobs,
      maxApplicantThreshold:
        rawConfig?.preferences?.maxApplicantThreshold ?? DEFAULT_USER_CONFIG.preferences.maxApplicantThreshold
    },
    aiProvider: {
      providerId: rawConfig?.aiProvider?.providerId ?? DEFAULT_USER_CONFIG.aiProvider.providerId,
      apiKey: rawConfig?.aiProvider?.apiKey ?? DEFAULT_USER_CONFIG.aiProvider.apiKey,
      isValidated: rawConfig?.aiProvider?.isValidated ?? DEFAULT_USER_CONFIG.aiProvider.isValidated
    },
    analytics: {
      optIn: rawConfig?.analytics?.optIn ?? DEFAULT_USER_CONFIG.analytics.optIn,
      clientId:
        rawConfig?.analytics?.clientId ||
        (typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : 'anon-' + Math.random().toString(36).substring(2))
    }
  };

  if (mergedConfig.aiProvider.apiKey) {
    try {
      mergedConfig.aiProvider.apiKey = await CryptoVaultService.decrypt(mergedConfig.aiProvider.apiKey);
    } catch {
      mergedConfig.aiProvider.apiKey = mergedConfig.aiProvider.apiKey;
    }
  }

  return mergedConfig;
}

/**
 * Saves the OpenApplyUserConfig to storage.
 * Automatically encrypts the AI provider API key using AES-256 Web Crypto before writing to disk.
 * @param config - OpenApplyUserConfig object to persist
 */
export async function saveUserConfig(config: import('@openapply/shared-types').OpenApplyUserConfig): Promise<void> {
  const { CryptoVaultService } = await import('../infrastructure/security/CryptoVaultService');

  const configToSave = JSON.parse(JSON.stringify(config));
  if (configToSave.aiProvider.apiKey) {
    configToSave.aiProvider.apiKey = await CryptoVaultService.encrypt(configToSave.aiProvider.apiKey);
  }

  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({ userConfig: configToSave });
  } else {
    localStorage.setItem(USER_CONFIG_STORAGE_KEY, JSON.stringify(configToSave));
  }
}
