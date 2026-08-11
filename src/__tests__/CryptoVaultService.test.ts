import { describe, it, expect } from 'vitest';
import { CryptoVaultService } from '../infrastructure/security/CryptoVaultService';

describe('CryptoVaultService (AES-256-GCM Web Crypto)', () => {
  it('should encrypt and decrypt API keys securely', async () => {
    const rawApiKey = 'sk-proj-test1234567890abcdefghijklmn';

    const encrypted = await CryptoVaultService.encrypt(rawApiKey);
    expect(encrypted).toBeDefined();
    expect(encrypted).not.toEqual(rawApiKey);

    const decrypted = await CryptoVaultService.decrypt(encrypted);
    expect(decrypted).toEqual(rawApiKey);
  });

  it('should fallback cleanly when decrypting unencrypted legacy text', async () => {
    const legacyText = 'legacy_plain_key';
    const decrypted = await CryptoVaultService.decrypt(legacyText);
    expect(decrypted).toEqual(legacyText);
  });
});
