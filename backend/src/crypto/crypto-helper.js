/**
 * Doc Vault - WebCrypto E2EE Client Helper
 * Native Web Cryptography API implementation working in both Node.js (16+) and modern browsers.
 */

// Cross-platform WebCrypto API resolution
const cryptoAPI = globalThis.crypto;
if (!cryptoAPI) {
  throw new Error("Web Cryptography API is not available in this environment.");
}

const subtle = cryptoAPI.subtle;

/**
 * Converts a hex string to a Uint8Array.
 */
export function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Converts a Uint8Array to a hex string.
 */
export function bytesToHex(bytes) {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Converts a PEM string (RSA Public/Private key) to an ArrayBuffer.
 */
export function pemToArrayBuffer(pem, header, footer) {
  const pemContents = pem
    .replace(header, "")
    .replace(footer, "")
    .replace(/\s/g, "");
  const binaryString = globalThis.atob(pemContents);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// ==========================================
// 1. KEY DERIVATION (PBKDF2)
// ==========================================

/**
 * Derives a 256-bit AES-GCM key from a user password and salt using PBKDF2.
 * @param {string} password - User plaintext password
 * @param {string} saltHex - User's hex salt
 * @returns {Promise<CryptoKey>} - Derived CryptoKey
 */
export async function deriveKeyFromPassword(password, saltHex) {
  const enc = new TextEncoder();
  const passwordKey = await subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const saltBytes = hexToBytes(saltHex);

  return subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations: 100000,
      hash: "SHA-256"
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    true, // extractable
    ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
  );
}

// ==========================================
// 2. DOCUMENT ENCRYPTION (AES-256-GCM)
// ==========================================

/**
 * Encrypts a cleartext document using AES-GCM.
 * @param {Uint8Array} cleartextBytes - The raw bytes of the file
 * @param {CryptoKey} aesKey - The derived vault key
 * @returns {Promise<Uint8Array>} - Concatenated [12-byte IV][encrypted data]
 */
export async function encryptDocument(cleartextBytes, aesKey) {
  const iv = cryptoAPI.getRandomValues(new Uint8Array(12));
  const ciphertextBuffer = await subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    aesKey,
    cleartextBytes
  );

  const ciphertextBytes = new Uint8Array(ciphertextBuffer);
  const result = new Uint8Array(iv.length + ciphertextBytes.length);
  result.set(iv, 0);
  result.set(ciphertextBytes, iv.length);

  return result;
}

/**
 * Decrypts an encrypted document payload using AES-GCM.
 * @param {Uint8Array} encryptedBytes - Concatenated [12-byte IV][encrypted data]
 * @param {CryptoKey} aesKey - The derived vault key
 * @returns {Promise<Uint8Array>} - Plaintext file bytes
 */
export async function decryptDocument(encryptedBytes, aesKey) {
  const iv = encryptedBytes.slice(0, 12);
  const ciphertextBytes = encryptedBytes.slice(12);

  const cleartextBuffer = await subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    aesKey,
    ciphertextBytes
  );

  return new Uint8Array(cleartextBuffer);
}

// ==========================================
// 3. ENVELOPE ENCRYPTION (RSA KEY WRAPPING)
// ==========================================

/**
 * Imports a SPKI RSA public key from a PEM string.
 */
export async function importPublicKey(pemString) {
  const keyBuffer = pemToArrayBuffer(
    pemString,
    "-----BEGIN PUBLIC KEY-----",
    "-----END PUBLIC KEY-----"
  );

  return subtle.importKey(
    "spki",
    keyBuffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256"
    },
    true,
    ["encrypt", "wrapKey"]
  );
}

/**
 * Imports a PKCS8 RSA private key from a PEM string.
 */
export async function importPrivateKey(pemString) {
  const keyBuffer = pemToArrayBuffer(
    pemString,
    "-----BEGIN PRIVATE KEY-----",
    "-----END PRIVATE KEY-----"
  );

  return subtle.importKey(
    "pkcs8",
    keyBuffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256"
    },
    true,
    ["decrypt", "unwrapKey"]
  );
}

/**
 * Encrypts (wraps) a symmetric AES key using a receiver's RSA public key.
 * @param {CryptoKey} aesKey - Symmetric key to encrypt
 * @param {CryptoKey} rsaPublicKey - Provider public key
 * @returns {Promise<ArrayBuffer>} - Wrapped key buffer
 */
export async function wrapAESKey(aesKey, rsaPublicKey) {
  return subtle.wrapKey(
    "raw",
    aesKey,
    rsaPublicKey,
    {
      name: "RSA-OAEP",
      hash: "SHA-256"
    }
  );
}

/**
 * Decrypts (unwraps) a symmetric AES key using a receiver's RSA private key.
 * @param {ArrayBuffer} wrappedKeyBuffer - Encrypted symmetric key
 * @param {CryptoKey} rsaPrivateKey - Provider private key
 * @returns {Promise<CryptoKey>} - Restored symmetric AES-GCM key
 */
export async function unwrapAESKey(wrappedKeyBuffer, rsaPrivateKey) {
  return subtle.unwrapKey(
    "raw",
    wrappedKeyBuffer,
    rsaPrivateKey,
    {
      name: "RSA-OAEP",
      hash: "SHA-256"
    },
    {
      name: "AES-GCM",
      length: 256
    },
    true,
    ["encrypt", "decrypt"]
  );
}
