import { describe, it, expect } from 'vitest';
import { PIIGuardrailService } from '../infrastructure/security/PIIGuardrailService';

describe('PIIGuardrailService Sanitizer', () => {
  it('should redact SSN and credit card numbers from prompts', () => {
    const rawText = 'My SSN is 123-45-6789 and my card is 4532-1234-5678-9012.';

    const result = PIIGuardrailService.sanitize(rawText);
    expect(result.hasPII).toBe(true);
    expect(result.sanitizedText).toContain('[REDACTED_SSN]');
    expect(result.sanitizedText).toContain('[REDACTED_CREDIT_CARD]');
    expect(result.sanitizedText).not.toContain('123-45-6789');
    expect(result.sanitizedText).not.toContain('4532-1234-5678-9012');
  });

  it('should leave clean resumes without sensitive PII unchanged', () => {
    const cleanText = 'Senior React Developer with 5 years experience in TypeScript.';

    const result = PIIGuardrailService.sanitize(cleanText);
    expect(result.hasPII).toBe(false);
    expect(result.sanitizedText).toEqual(cleanText);
  });
});
