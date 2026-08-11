import { LinkedInJobPosting, UserResume, JobScorecard, UnemploymentLogEntry } from '@openapply/shared-types';

/** Alias entity for LinkedIn job posting */
export type JobPostingEntity = LinkedInJobPosting;

/** Alias entity for candidate resume profile */
export type CandidateProfileEntity = UserResume;

/** Alias entity for job evaluation scorecard */
export type ScorecardEntity = JobScorecard;

/** Alias entity for unemployment application log */
export type UnemploymentLogEntity = UnemploymentLogEntry;

/**
 * Result schema of PII sanitization pre-check.
 */
export interface PIISanitizationResult {
  hasPII: boolean;
  sanitizedText: string;
  detectedTypes: string[];
}
