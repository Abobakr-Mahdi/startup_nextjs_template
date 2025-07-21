/**
 * Crypto utility functions for encrypting and decrypting sensitive data
 * Uses Web Crypto API for secure encryption
 */

import { siteConfig } from "@/config/site";

const ENCRYPTION_KEY = siteConfig.secretKey;
// Add a prefix to identify encrypted data
const ENCRYPTION_PREFIX = "encrypted:";

/**
 * Convert a string to ArrayBuffer
 */
function stringToArrayBuffer(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

/**
 * Convert ArrayBuffer to string
 */
function arrayBufferToString(buffer: ArrayBuffer): string {
  return new TextDecoder().decode(buffer);
}

/**
 * Convert ArrayBuffer to base64 string for storage
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert base64 string back to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (error) {
    console.error("Error converting base64 to ArrayBuffer:", error);
    throw new Error("Invalid base64 string");
  }
}

/**
 * Generate a cryptographic key from the encryption key
 */
async function generateKey(salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    stringToArrayBuffer(ENCRYPTION_KEY),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Check if the environment supports the Web Crypto API
 */
export function isCryptoSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.crypto !== "undefined" &&
    typeof window.crypto.subtle !== "undefined"
  );
}

/**
 * Encrypt data
 */
export async function encrypt(data: string): Promise<string> {
  try {
    // Server-side or crypto not supported
    if (!isCryptoSupported()) {
      return data;
    }

    // Generate a random salt
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    // Generate a random IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    // Generate the key
    const key = await generateKey(salt);
    // Encrypt the data
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      stringToArrayBuffer(data)
    );

    // Combine salt, IV, and encrypted data for storage
    const combined = new Uint8Array(
      salt.length + iv.length + encryptedData.byteLength
    );
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encryptedData), salt.length + iv.length);

    // Convert to base64 for storage and add prefix
    return ENCRYPTION_PREFIX + arrayBufferToBase64(combined.buffer);
  } catch (error) {
    console.error("Encryption error:", error);
    return data; // Return original data on error
  }
}

/**
 * Decrypt data
 */
export async function decrypt(encryptedData: string): Promise<string> {
  try {
    // If not on browser or crypto not supported
    if (!isCryptoSupported()) {
      return encryptedData;
    }

    // Check if the data is actually encrypted with our prefix
    if (!encryptedData.startsWith(ENCRYPTION_PREFIX)) {
      // Check if it's URL encoded JSON
      try {
        const decodedData = decodeURIComponent(encryptedData);
        // Try to parse it to see if it's valid JSON
        JSON.parse(decodedData);
        return decodedData;
      } catch {
        // Not URL encoded JSON, return as is
        return encryptedData;
      }
    }

    // Remove the prefix
    const actualData = encryptedData.substring(ENCRYPTION_PREFIX.length);

    // Convert from base64
    const combined = base64ToArrayBuffer(actualData);

    // Extract salt, IV, and data
    const salt = new Uint8Array(combined.slice(0, 16));
    const iv = new Uint8Array(combined.slice(16, 28));
    const data = new Uint8Array(combined.slice(28));

    // Generate the key
    const key = await generateKey(salt);

    // Decrypt the data
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      data
    );

    return arrayBufferToString(decryptedData);
  } catch (error) {
    console.error("Decryption error:", error);
    // Try to handle URL encoded data if decryption fails
    try {
      const decodedData = decodeURIComponent(encryptedData);
      // Try to parse it to see if it's valid JSON
      JSON.parse(decodedData);
      return decodedData;
    } catch {
      // If all fails, return the original data
      return encryptedData;
    }
  }
}
