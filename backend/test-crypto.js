/**
 * Doc Vault - WebCrypto validation test runner
 */
import {
  deriveKeyFromPassword,
  encryptDocument,
  decryptDocument,
  hexToBytes,
  bytesToHex
} from './src/crypto/crypto-helper.js';

async function runTest() {
  console.log("=== Starting WebCrypto E2EE Validation ===");
  try {
    const password = "SuperSecureUserPassword2026!";
    const saltHex = "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6";
    
    console.log("1. Deriving SVEK key from password...");
    const aesKey = await deriveKeyFromPassword(password, saltHex);
    console.log("   SVEK key derived successfully.");

    console.log("2. Encrypting test document payload...");
    const cleartext = "Confidential Sovereign KYC Data - NSW Driver License DL-883719A";
    const enc = new TextEncoder();
    const cleartextBytes = enc.encode(cleartext);
    
    const encryptedBytes = await encryptDocument(cleartextBytes, aesKey);
    console.log(`   Encrypted bytes length: ${encryptedBytes.length}`);
    console.log(`   Cipher payload: ${bytesToHex(encryptedBytes.slice(0, 32))}...`);

    console.log("3. Decrypting document payload...");
    const decryptedBytes = await decryptDocument(encryptedBytes, aesKey);
    const dec = new TextDecoder();
    const decryptedText = dec.decode(decryptedBytes);
    console.log(`   Decrypted text: "${decryptedText}"`);

    if (decryptedText === cleartext) {
      console.log("\n[SUCCESS] E2EE AES-GCM Encrypt/Decrypt validation passed.");
    } else {
      throw new Error("Decrypted payload does not match original cleartext.");
    }
  } catch (error) {
    console.error("\n[FAILURE] Cryptographic test failed:", error);
    process.exit(1);
  }
}

runTest();
