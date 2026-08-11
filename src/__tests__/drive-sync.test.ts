import { describe, it, expect } from 'vitest';
import { generateProofConfirmationCode } from '../lib/drive-sync';

describe('Audit Proof Code Generation', () => {
  it('should generate valid confirmation codes with OA prefix', () => {
    const code1 = generateProofConfirmationCode('job_123456', 'Acme Corp');
    const code2 = generateProofConfirmationCode('job_123456', 'Acme Corp');

    expect(code1).toBeDefined();
    expect(code1.startsWith('OA-ACM-')).toBe(true);
    expect(code1).toEqual(code2);
  });

  it('should generate different confirmation codes for different job IDs', () => {
    const code1 = generateProofConfirmationCode('job_123456', 'Acme Corp');
    const code2 = generateProofConfirmationCode('job_987654', 'Acme Corp');

    expect(code1).not.toEqual(code2);
  });
});
