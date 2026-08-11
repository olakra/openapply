/**
 * @openapply/prompt-engine
 * Dynamic Markdown Prompt Template Engine with Persona, PII Rules, and Variable Interpolation.
 */

import { LinkedInJobPosting, UserResume } from '@openapply/shared-types';

export interface PersonaConfig {
  id: string;
  title: string;
  description: string;
  tone: string;
}

export const DEFAULT_PERSONAS: Record<string, PersonaConfig> = {
  recruiter: {
    id: 'recruiter',
    title: 'Technical Recruiter',
    description: 'Evaluates candidates based on keyword matching, years of experience, and clear skill overlap.',
    tone: 'Concise, pragmatic, keyword and metrics-driven.'
  },
  hiring_manager: {
    id: 'hiring_manager',
    title: 'Engineering Hiring Manager',
    description: 'Focuses on system architecture, problem-solving impact, and business value delivery.',
    tone: 'Analytical, impact-oriented, technical.'
  },
  tech_lead: {
    id: 'tech_lead',
    title: 'Principal Software Architect',
    description: 'Scrutinizes exact technology stack experience, design patterns, and code quality.',
    tone: 'Rigorous, detail-focused, architectural.'
  },
  executive: {
    id: 'executive',
    title: 'VP of Engineering',
    description: 'Evaluates strategic alignment, leadership, and high-level team contribution.',
    tone: 'Executive, direct, high-level.'
  }
};

export const DEFAULT_PII_RULES = `1. Zero Raw Token Leakage: Never echo or include raw API keys or secrets in output.
2. PII Sanitization: Automatically mask SSNs, phone numbers, exact street addresses, or credit cards.
3. Client BYOK Privacy: Data processed exclusively through designated endpoint.`;

export const RAW_MARKDOWN_TEMPLATES = {
  ATS_ANALYZER: `# OpenApply ATS Scorecard Prompt Template

You are acting as **OpenApply's ATS Evaluation Engine** with the persona: **{{persona.title}}**.
Persona Description: {{persona.description}}

## PII & SECURITY GUARDRAILS
{{pii_rules}}

## INPUT DATA

### JOB POSTING
- **Title**: {{job.title}}
- **Company**: {{job.company}}
- **Location**: {{job.location}} (Is Remote: {{job.isRemote}})
- **Description**:
{{job.description}}

### CANDIDATE RESUME
{{resume_section}}

## EVALUATION INSTRUCTIONS
1. Compare candidate experience against job requirements through the lens of a **{{persona.title}}**.
2. Identify exact skill overlaps (\`keyMatchingSkills\`) and critical gaps (\`missingSkills\`).
3. Audit job description for **Fake Remote** flags (e.g. mandatory hybrid days, local state tax residency restrictions).
4. Provide an overall fit score from 0 to 100.

Respond strictly with valid JSON:
{
  "overallScore": number (0-100),
  "keyMatchingSkills": string[],
  "missingSkills": string[],
  "fakeRemoteRisk": "LOW" | "MEDIUM" | "HIGH",
  "fakeRemoteReasons": string[],
  "summary": string
}`,

  COVER_LETTER: `# OpenApply Cover Letter Generator Prompt Template

You are an expert career strategist acting with the persona **{{persona.title}}**.
Tone & Focus: {{persona.tone}}

## PII & COMPLIANCE GUARDRAILS
{{pii_rules}}

## TARGET POSITION
- **Title**: {{job.title}}
- **Company**: {{job.company}}
- **Job Description**:
{{job.description}}

## CANDIDATE PROFILE
- **Candidate Name**: {{resume.fullName}}
- **Key Skills**: {{resume.skills}}
- **Experience Highlights**:
{{resume.workHistory}}
- **Custom User Guidance**: {{resume.customInstructions}}

## COMPOSITION RULES
Write a 3-paragraph, maximum 250-word cover letter matching candidate achievements to company needs:
1. **Paragraph 1 (The Hook)**: Direct, high-impact hook demonstrating immediate value for {{job.title}} at {{job.company}}.
2. **Paragraph 2 (Proven Metric / Evidence)**: Specific metric or project from work history solving a core requirement.
3. **Paragraph 3 (Call to Action)**: Confident, professional close requesting a conversation.`,

  FAKE_REMOTE: `# OpenApply Fake Remote Detector Prompt Template

You are a job posting auditor specializing in detecting "Fake Remote" deceptive job listings.

## TARGET JOB LISTING
- **Title**: {{job.title}}
- **Company**: {{job.company}}
- **Location**: {{job.location}}
- **Description**:
{{job.description}}

## DETECTION CRITERIA
Audit description for deceptive disclosures:
1. "Remote for now" / "Will transition to hybrid in 90 days"
2. Mandatory local office commute / residency within 30 miles
3. Unpaid or mandatory in-office orientation / training
4. Misleading Remote title with full-time on-site requirements in fine print

Respond strictly in JSON format:
{
  "fakeRemoteRisk": "LOW" | "MEDIUM" | "HIGH",
  "fakeRemoteReasons": string[],
  "summary": string
}`
};

export class PromptTemplateEngine {
  private templates: Map<string, string>;
  private personas: Map<string, PersonaConfig>;
  private piiRules: string;

  constructor() {
    this.templates = new Map();
    this.templates.set('ats_analyzer', RAW_MARKDOWN_TEMPLATES.ATS_ANALYZER);
    this.templates.set('cover_letter', RAW_MARKDOWN_TEMPLATES.COVER_LETTER);
    this.templates.set('fake_remote', RAW_MARKDOWN_TEMPLATES.FAKE_REMOTE);

    this.personas = new Map();
    Object.entries(DEFAULT_PERSONAS).forEach(([id, p]) => this.personas.set(id, p));
    this.piiRules = DEFAULT_PII_RULES;
  }

  public setTemplate(name: string, markdownContent: string): void {
    this.templates.set(name, markdownContent);
  }

  public getTemplate(name: string): string {
    return this.templates.get(name) || '';
  }

  public getAllTemplates(): Record<string, string> {
    const result: Record<string, string> = {};
    this.templates.forEach((val, key) => {
      result[key] = val;
    });
    return result;
  }

  public setPersona(persona: PersonaConfig): void {
    this.personas.set(persona.id, persona);
  }

  public getPersona(id: string): PersonaConfig {
    return this.personas.get(id) || DEFAULT_PERSONAS.recruiter;
  }

  public renderAtsPrompt(job: LinkedInJobPosting, resume?: UserResume, personaId: string = 'recruiter'): string {
    const template = this.getTemplate('ats_analyzer');
    const persona = this.getPersona(personaId);

    const resumeSection = resume
      ? `- **Summary**: ${resume.summary}\n- **Skills**: ${resume.skills.join(', ')}\n- **Target Roles**: ${resume.targetRoles.join(', ')}\n- **Work History**: ${JSON.stringify(resume.workHistory)}`
      : '*No candidate resume attached.*';

    return this.interpolate(template, {
      'persona.title': persona.title,
      'persona.description': persona.description,
      'persona.tone': persona.tone,
      'pii_rules': this.piiRules,
      'job.title': job.title,
      'job.company': job.company,
      'job.location': job.location,
      'job.isRemote': String(job.isRemote),
      'job.description': job.description,
      'resume_section': resumeSection
    });
  }

  public renderCoverLetterPrompt(job: LinkedInJobPosting, resume: UserResume, personaId: string = 'hiring_manager'): string {
    const template = this.getTemplate('cover_letter');
    const persona = this.getPersona(personaId);

    const workHistoryStr = resume.workHistory
      .map(w => `- ${w.role} at ${w.company}: ${w.highlights.join('; ')}`)
      .join('\n');

    return this.interpolate(template, {
      'persona.title': persona.title,
      'persona.tone': persona.tone,
      'pii_rules': this.piiRules,
      'job.title': job.title,
      'job.company': job.company,
      'job.description': job.description.slice(0, 1500),
      'resume.fullName': resume.fullName,
      'resume.skills': resume.skills.join(', '),
      'resume.workHistory': workHistoryStr,
      'resume.customInstructions': resume.customInstructions || 'Professional and direct'
    });
  }

  public renderFakeRemotePrompt(job: LinkedInJobPosting): string {
    const template = this.getTemplate('fake_remote');
    return this.interpolate(template, {
      'job.title': job.title,
      'job.company': job.company,
      'job.location': job.location,
      'job.description': job.description
    });
  }

  private interpolate(template: string, vars: Record<string, string>): string {
    let result = template;
    for (const [key, val] of Object.entries(vars)) {
      const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
      result = result.replace(regex, val);
    }
    return result;
  }
}

// Global Singleton Instance
export const promptEngine = new PromptTemplateEngine();

// Backward compatibility legacy functions
export const SYSTEM_INSTRUCTIONS = {
  ATS_ANALYZER: `You are OpenApply's ATS Engine. Analyze job posting & resume. Return JSON format.`,
  COVER_LETTER_GENERATOR: `You are an expert career agent writing a 3-paragraph cover letter.`,
  FAKE_REMOTE_DETECTOR: `You are a job posting auditor detecting fake remote jobs.`
};

export function generateAtsScorecardPrompt(job: LinkedInJobPosting, resume?: UserResume): string {
  return promptEngine.renderAtsPrompt(job, resume);
}

export function generateCoverLetterPrompt(job: LinkedInJobPosting, resume: UserResume): string {
  return promptEngine.renderCoverLetterPrompt(job, resume);
}

export function generateFakeRemoteDetectionPrompt(job: LinkedInJobPosting): string {
  return promptEngine.renderFakeRemotePrompt(job);
}
