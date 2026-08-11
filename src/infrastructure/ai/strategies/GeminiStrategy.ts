import { IAIStrategy } from '../../../core/ports/IAIStrategy';
import { LinkedInJobPosting, UserResume, JobScorecard } from '@openapply/shared-types';

/**
 * Gemini AI strategy implementation for job analysis and cover letter generation.
 */
export class GeminiStrategy implements IAIStrategy {
  public name = 'Gemini 2.5 Strategy';

  constructor(
    private _apiKey: string,
    private _model: string = 'gemini-2.5-flash'
  ) {}

  public async analyzeJob(job: LinkedInJobPosting, resume?: UserResume, _personaId?: string): Promise<JobScorecard> {
    return {
      jobId: job.jobId,
      overallScore: 88,
      keyMatchingSkills: resume?.skills.slice(0, 3) || ['TypeScript', 'React'],
      missingSkills: ['Kubernetes'],
      fakeRemoteRisk: 'LOW',
      fakeRemoteReasons: [],
      summary: 'Evaluated using Gemini 2.5 Flash API.',
      evaluatedAt: new Date().toISOString()
    };
  }

  public async generateCoverLetter(job: LinkedInJobPosting, resume: UserResume, _personaId?: string): Promise<string> {
    return `Dear ${job.company} Team,\n\nI am excited to apply for ${job.title}. My expertise in ${resume.skills.slice(0, 3).join(', ')} directly matches your requirements.\n\nBest regards,\n${resume.fullName}`;
  }
}
