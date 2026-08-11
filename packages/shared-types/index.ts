/**
 * @openapply/shared-types
 * Shared TypeScript interfaces and JSON Schemas for OpenApply extension & monorepo.
 */

export interface LinkedInJobPosting {
  jobId: string;
  jobHash: string; // SHA-256 or hash of job_id for quick local deduplication
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  applicantCount: number;
  isPromoted: boolean;
  description: string;
  postedDate?: string;
  url: string;
  scrapedAt: string;
}

export type FakeRemoteRisk = 'LOW' | 'MEDIUM' | 'HIGH';

export interface JobScorecard {
  jobId: string;
  overallScore: number; // 0 - 100 ATS fit score
  keyMatchingSkills: string[];
  missingSkills: string[];
  fakeRemoteRisk: FakeRemoteRisk;
  fakeRemoteReasons: string[];
  summary: string;
  tailoredCoverLetter?: string;
  evaluatedAt: string;
}

export interface UserResume {
  fullName: string;
  email: string;
  phone?: string;
  location: string;
  summary: string;
  skills: string[];
  workHistory: Array<{
    company: string;
    role: string;
    duration: string;
    highlights: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  targetRoles: string[];
  customInstructions?: string;
}

export type ApplicationStatus = 'Applied' | 'Screening' | 'Interviewing' | 'Rejected' | 'Offer';

export interface UnemploymentLogEntry {
  id: string;
  dateApplied: string; // ISO YYYY-MM-DD
  company: string;
  jobTitle: string;
  location: string;
  workType: 'Remote' | 'Hybrid' | 'On-site';
  jobUrl: string;
  jobId: string;
  confirmationNumber: string; // Unique application proof code
  status: ApplicationStatus;
  notes?: string;
  syncedToDrive: boolean;
  syncedAt?: string;
}

export type AIProvider = 'openai' | 'gemini' | 'custom';

export interface OpenApplySettings {
  apiKey: string;
  provider: AIProvider;
  model: string;
  customEndpoint?: string;
  autoFilterPromoted: boolean;
  maxApplicantThreshold: number; // Default: 100. Dims listings above this count
  hideFakeRemote: boolean;
  autoSyncDrive: boolean;
  driveFolderId?: string;
  googleOAuthConnected: boolean;
  userEmail?: string;
  unemploymentStateCode?: string; // e.g., 'CA', 'TX', 'NY' for state claim logging format
}

export interface ChromeStorageData {
  settings?: OpenApplySettings;
  resume?: UserResume;
  unemploymentLogs?: UnemploymentLogEntry[];
  scorecards?: Record<string, JobScorecard>;
}
