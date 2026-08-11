import { IAIStrategy } from '../../../core/ports/IAIStrategy';
import { LinkedInJobPosting, UserResume, JobScorecard } from '@openapply/shared-types';
import { promptEngine } from '@openapply/prompt-engine';

export class OpenAIStrategy implements IAIStrategy {
  public name = 'OpenAI BYOK Strategy';

  constructor(private apiKey: string, private model: string = 'gpt-4o-mini') {}

  public async analyzeJob(job: LinkedInJobPosting, resume?: UserResume, personaId: string = 'recruiter'): Promise<JobScorecard> {
    const promptText = promptEngine.renderAtsPrompt(job, resume, personaId);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'user', content: promptText }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    return {
      jobId: job.jobId,
      overallScore: parsed.overallScore ?? 85,
      keyMatchingSkills: parsed.keyMatchingSkills || [],
      missingSkills: parsed.missingSkills || [],
      fakeRemoteRisk: parsed.fakeRemoteRisk || 'LOW',
      fakeRemoteReasons: parsed.fakeRemoteReasons || [],
      summary: parsed.summary || 'Real BYOK OpenAI Analysis Completed.',
      evaluatedAt: new Date().toISOString()
    };
  }

  public async generateCoverLetter(job: LinkedInJobPosting, resume: UserResume, personaId: string = 'hiring_manager'): Promise<string> {
    const promptText = promptEngine.renderCoverLetterPrompt(job, resume, personaId);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'user', content: promptText }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI Cover Letter generation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}
