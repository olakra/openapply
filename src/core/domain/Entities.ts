import { LinkedInJobPosting, UserResume, JobScorecard, UnemploymentLogEntry } from '@openapply/shared-types';

export type JobPostingEntity = LinkedInJobPosting;
export type CandidateProfileEntity = UserResume;
export type ScorecardEntity = JobScorecard;
export type UnemploymentLogEntity = UnemploymentLogEntry;

export interface PIISanitizationResult {
  hasPII: boolean;
  sanitizedText: string;
  detectedTypes: string[];
}
