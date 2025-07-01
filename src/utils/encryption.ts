/**
 * Simple client-side encryption utilities for securing AWS credentials
 * Note: This provides obfuscation, not true security. For production,
 * use backend proxy or AWS Cognito.
 */

import CryptoJS from 'crypto-js';

// Default encryption key (in production, this should be user-provided or env-specific)
const DEFAULT_ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'hctc-support-2024';

export interface EncryptedCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  encrypted: boolean;
}

export interface DecryptedCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

/**
 * Encrypt AWS credentials
 */
export function encryptCredentials(
  credentials: DecryptedCredentials,
  encryptionKey: string = DEFAULT_ENCRYPTION_KEY
): EncryptedCredentials {
  try {
    return {
      accessKeyId: CryptoJS.AES.encrypt(credentials.accessKeyId, encryptionKey).toString(),
      secretAccessKey: CryptoJS.AES.encrypt(credentials.secretAccessKey, encryptionKey).toString(),
      region: CryptoJS.AES.encrypt(credentials.region, encryptionKey).toString(),
      encrypted: true
    };
  } catch (error) {
    console.error('Failed to encrypt credentials:', error);
    throw new Error('Encryption failed');
  }
}

/**
 * Decrypt AWS credentials
 */
export function decryptCredentials(
  encryptedCredentials: EncryptedCredentials,
  encryptionKey: string = DEFAULT_ENCRYPTION_KEY
): DecryptedCredentials {
  try {
    if (!encryptedCredentials.encrypted) {
      throw new Error('Credentials are not encrypted');
    }

    const accessKeyId = CryptoJS.AES.decrypt(encryptedCredentials.accessKeyId, encryptionKey)
      .toString(CryptoJS.enc.Utf8);
    const secretAccessKey = CryptoJS.AES.decrypt(encryptedCredentials.secretAccessKey, encryptionKey)
      .toString(CryptoJS.enc.Utf8);
    const region = CryptoJS.AES.decrypt(encryptedCredentials.region, encryptionKey)
      .toString(CryptoJS.enc.Utf8);

    if (!accessKeyId || !secretAccessKey || !region) {
      throw new Error('Invalid encryption key or corrupted data');
    }

    return {
      accessKeyId,
      secretAccessKey,
      region
    };
  } catch (error) {
    console.error('Failed to decrypt credentials:', error);
    throw new Error('Decryption failed - check encryption key');
  }
}

/**
 * Check if credentials are encrypted
 */
export function areCredentialsEncrypted(credentials: any): credentials is EncryptedCredentials {
  return credentials && credentials.encrypted === true;
}

/**
 * Validate decrypted credentials format
 */
export function validateCredentials(credentials: DecryptedCredentials): boolean {
  return !!(
    credentials.accessKeyId &&
    credentials.secretAccessKey &&
    credentials.region &&
    credentials.accessKeyId.length > 10 &&
    credentials.secretAccessKey.length > 20
  );
}

/**
 * Generate a random encryption key
 */
export function generateEncryptionKey(): string {
  return CryptoJS.lib.WordArray.random(256/8).toString();
}

/**
 * Helper to safely store encrypted credentials in localStorage
 */
export function storeEncryptedCredentials(credentials: EncryptedCredentials): void {
  try {
    localStorage.setItem('hctc_encrypted_aws_credentials', JSON.stringify(credentials));
  } catch (error) {
    console.warn('Failed to store encrypted credentials:', error);
  }
}

/**
 * Helper to retrieve encrypted credentials from localStorage
 */
export function getStoredEncryptedCredentials(): EncryptedCredentials | null {
  try {
    const stored = localStorage.getItem('hctc_encrypted_aws_credentials');
    if (!stored) return null;
    
    const credentials = JSON.parse(stored);
    return areCredentialsEncrypted(credentials) ? credentials : null;
  } catch (error) {
    console.warn('Failed to retrieve encrypted credentials:', error);
    return null;
  }
}

/**
 * Clear stored credentials
 */
export function clearStoredCredentials(): void {
  try {
    localStorage.removeItem('hctc_encrypted_aws_credentials');
  } catch (error) {
    console.warn('Failed to clear stored credentials:', error);
  }
}
