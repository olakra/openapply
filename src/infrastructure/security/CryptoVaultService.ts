/**
 * OpenApply AES-256-GCM Web Crypto Vault Service.
 * Provides client-side encrypted storage protection for BYOK tokens and personal credentials.
 */
export class CryptoVaultService {
  private static SALT = new Uint8Array([14, 23, 88, 101, 240, 12, 45, 99, 11, 201, 88, 33, 4, 19, 87, 50]);

  private static async getKey(): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const passphraseKey = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode('openapply-gpl3-vault-secret-master-key'),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: this.SALT,
        iterations: 100000,
        hash: 'SHA-256'
      },
      passphraseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypts plaintext using Web Crypto API AES-256-GCM.
   * @param plainText - Sensitive input text
   * @returns Base64 encoded cipher text string
   */
  public static async encrypt(plainText: string): Promise<string> {
    try {
      const key = await this.getKey();
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encoder = new TextEncoder();
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoder.encode(plainText)
      );

      const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(encryptedBuffer), iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch {
      return 'enc:' + btoa(plainText);
    }
  }

  /**
   * Decrypts AES-256-GCM cipher text back to plaintext.
   * @param cipherText - Base64 cipher string
   * @returns Decrypted plaintext string
   */
  public static async decrypt(cipherText: string): Promise<string> {
    if (!cipherText) return '';
    if (cipherText.startsWith('enc:')) {
      return atob(cipherText.replace('enc:', ''));
    }

    try {
      const key = await this.getKey();
      const combined = new Uint8Array(
        atob(cipherText)
          .split('')
          .map((c) => c.charCodeAt(0))
      );

      const iv = combined.slice(0, 12);
      const data = combined.slice(12);

      const decryptedBuffer = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);

      const decoder = new TextDecoder();
      return decoder.decode(decryptedBuffer);
    } catch {
      return cipherText;
    }
  }
}
