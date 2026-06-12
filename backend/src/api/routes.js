import express from 'express';
import {
  registerUser,
  loginUser,
  uploadDocument,
  getDocuments,
  overrideMetadata,
  createHandshake,
  getProviderHandshake,
  registerDeveloper,
  processDecision
} from './controllers.js';

const router = express.Router();

// ==========================================
// CONSUMER ENDPOINTS
// ==========================================
// User registration and login APIs
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);

// Sovereign Vault management APIs
router.post('/vault/upload', uploadDocument);
router.get('/vault/documents', getDocuments);
router.post('/vault/override', overrideMetadata); // Guided Metadata Override

// Handshake authorisation API
router.post('/handshakes/authorize', createHandshake);

// ==========================================
// DEVELOPER / PROVIDER ENDPOINTS
// ==========================================
// Developer registration API
router.post('/developer/register', registerDeveloper);

// Retrieve approved handshake metadata
router.get('/developer/handshakes/:id', getProviderHandshake);

// Submit approval/rejection decision (triggers auto-shredding)
router.post('/developer/applications/:id/decision', processDecision);

export default router;
