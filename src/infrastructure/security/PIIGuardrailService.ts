import { PIISanitizationResult } from '../../core/domain/Entities';

/**
 * Service for detecting, masking, and auditing Personally Identifiable Information (PII).
 */
export class PIIGuardrailService {
  private static PII_PATTERNS = [
    {
      name: 'Social Security Number (SSN)',
      regex: /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g,
      mask: '[REDACTED_SSN]'
    },
    {
      name: 'Credit Card Number',
      regex: /\b(?:\d[ -]*?){13,16}\b/g,
      mask: '[REDACTED_CREDIT_CARD]'
    },
    {
      name: 'Phone Number',
      regex: /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
      mask: '[REDACTED_PHONE]'
    },
    {
      name: 'API Key / Secret Token',
      regex: /(?:sk-[a-zA-Z0-9]{20,}|AIza[0-9A-Za-z-_]{35}|ghp_[a-zA-Z0-9]{36})/g,
      mask: '[REDACTED_API_KEY]'
    }
  ];

  /**
   * Pre-hook check before sending text to AI or saving to storage.
   * @param text - Input text string to sanitize
   * @returns Sanitization audit result object
   */
  public static sanitize(text: string): PIISanitizationResult {
    let sanitizedText = text;
    const detectedTypes: string[] = [];

    for (const pattern of this.PII_PATTERNS) {
      if (pattern.regex.test(sanitizedText)) {
        detectedTypes.push(pattern.name);
        sanitizedText = sanitizedText.replace(pattern.regex, pattern.mask);
      }
    }

    return {
      hasPII: detectedTypes.length > 0,
      sanitizedText,
      detectedTypes
    };
  }

  /**
   * Pre-commit hook to verify no secret tokens are leaked in commit payloads.
   * @param payload - Commit payload object
   * @returns Security audit clean state and warnings list
   */
  public static preCommitCheck(payload: Record<string, any>): { isClean: boolean; warnings: string[] } {
    const warnings: string[] = [];
    const str = JSON.stringify(payload);

    for (const pattern of this.PII_PATTERNS) {
      if (pattern.regex.test(str)) {
        warnings.push(`Pre-commit check failed: Detected leaked ${pattern.name}`);
      }
    }

    return {
      isClean: warnings.length === 0,
      warnings
    };
  }
}
