import { LinkedInJobPosting, UserResume, JobScorecard } from '@openapply/shared-types';

/**
 * Strategy interface for AI engine providers (OpenAI BYOK, Gemini, local heuristics).
 */
export interface IAIStrategy {
  name: string;
  analyzeJob(job: LinkedInJobPosting, resume?: UserResume, personaId?: string): Promise<JobScorecard>;
  generateCoverLetter(job: LinkedInJobPosting, resume: UserResume, personaId?: string): Promise<string>;
}
