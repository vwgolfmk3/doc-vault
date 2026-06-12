/**
 * Doc Vault - Mock Database API Controllers
 * Mimics relational PostgreSQL queries using in-memory state models for test-readiness.
 */

// In-Memory Database State
const db = {
  users: [],
  documents: [],
  serviceProviders: [
    {
      id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      companyName: 'Apex Mortgages',
      developerEmail: 'integrations@apexmortgages.com',
      apiKeyHash: 'e24a0d92a188dfa002bc03bbf2b7f836c2b184a2ea2e88a3ea2bc20163a8a9ff',
      publicKeyPem: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0y61R5lU/2kGf05q7oRk\nU1t1f4iL5k+vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU\n4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0X\np5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4v\nL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5\np1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL2\n6wIDAQAB\n-----END PUBLIC KEY-----',
      webhookUrl: 'http://localhost:3000/api/mock-webhooks/apex'
    }
  ],
  policies: [
    {
      id: 'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a',
      providerId: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      applicationType: 'home_loan',
      requiredDocuments: [
        { class: 'Primary Identity', qty: 1 },
        { class: 'Secondary Identity', qty: 1 },
        { class: 'Income Proof', qty: 2 }
      ],
      retentionTerms: {
        'Primary Identity': 180,
        'Secondary Identity': 180,
        'Income Proof': 180
      }
    }
  ],
  handshakes: [],
  auditLogs: []
};

// ==========================================
// 1. AUTH CONTROLLERS
// ==========================================
export function registerUser(req, res) {
  const { email, password, keyDerivationSalt, wrappedVaultKey } = req.body;
  if (!email || !password || !keyDerivationSalt || !wrappedVaultKey) {
    return res.status(400).json({ error: "Missing required registration parameters." });
  }

  const userExists = db.users.find(u => u.email === email);
  if (userExists) {
    return res.status(409).json({ error: "User email already registered." });
  }

  const newUser = {
    id: `u-${Math.random().toString(36).substr(2, 9)}`,
    email,
    passwordHash: `hash-${password}`, // Mock hashing
    keyDerivationSalt,
    wrappedVaultKey,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  res.status(201).json({
    message: "Consumer account registered successfully.",
    user: { id: newUser.id, email: newUser.email, wrappedVaultKey: newUser.wrappedVaultKey }
  });
}

export function loginUser(req, res) {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email);
  if (!user || user.passwordHash !== `hash-${password}`) {
    return res.status(401).json({ error: "Invalid login credentials." });
  }

  res.status(200).json({
    message: "Authentication successful.",
    user: {
      id: user.id,
      email: user.email,
      keyDerivationSalt: user.keyDerivationSalt,
      wrappedVaultKey: user.wrappedVaultKey
    }
  });
}

// ==========================================
// 2. VAULT CONTROLLERS
// ==========================================
export function uploadDocument(req, res) {
  const { userId, customLabel, originalFilename, fileSize, mimeType, s3ObjectKey, checksumSha256 } = req.body;
  if (!userId || !customLabel || !originalFilename || !fileSize || !s3ObjectKey || !checksumSha256) {
    return res.status(400).json({ error: "Missing required upload parameters." });
  }

  const newDoc = {
    id: `doc-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    customLabel,
    originalFilename,
    fileSize,
    mimeType: mimeType || "application/octet-stream",
    s3ObjectKey,
    checksumSha256,
    autoClassificationTags: [customLabel],
    createdAt: new Date().toISOString()
  };

  db.documents.push(newDoc);
  res.status(201).json({ message: "Sovereign document metadata saved successfully.", document: newDoc });
}

export function getDocuments(req, res) {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: "Missing userId parameter." });
  }

  const userDocs = db.documents.filter(d => d.userId === userId);
  res.status(200).json(userDocs);
}

export function overrideMetadata(req, res) {
  const { documentId, customLabel } = req.body;
  const doc = db.documents.find(d => d.id === documentId);
  if (!doc) {
    return res.status(404).json({ error: "Document not found." });
  }

  doc.customLabel = customLabel;
  if (!doc.autoClassificationTags.includes(customLabel)) {
    doc.autoClassificationTags.push(customLabel);
  }

  res.status(200).json({ message: "Guided Metadata Override processed successfully.", document: doc });
}

// ==========================================
// 3. HANDSHAKE CONTROLLERS
// ==========================================
export function createHandshake(req, res) {
  const { userId, providerId, policyId, documentIds } = req.body;
  if (!userId || !providerId || !policyId) {
    return res.status(400).json({ error: "Missing handshake configuration parameters." });
  }

  const policy = db.policies.find(p => p.id === policyId);
  if (!policy) {
    return res.status(404).json({ error: "Retention policy not found." });
  }

  const handshakeId = `h-${Math.random().toString(36).substr(2, 9)}`;
  const expiresAt = new Date(Date.now() + 180 * 1000).toISOString(); // 3-minute mock expiry

  const newHandshake = {
    id: handshakeId,
    userId,
    providerId,
    policyId,
    status: "active_shared",
    sharedDocumentsMeta: (documentIds || []).map(docId => ({
      documentId: docId,
      ephemeralObjectKey: `ephemeral-cache-${docId}`,
      expiresAt
    })),
    timerStartedAt: new Date().toISOString(),
    expiresAt,
    decisionMadeAt: null,
    createdAt: new Date().toISOString()
  };

  db.handshakes.push(newHandshake);

  // Log to immutable compliance ledger
  db.auditLogs.push({
    id: `audit-${Math.random().toString(36).substr(2, 9)}`,
    handshakeId,
    eventType: "HANDSHAKE_INITIATED",
    eventMetadata: { consentSigned: true, authorizedDocumentsCount: (documentIds || []).length },
    createdAt: new Date().toISOString()
  });

  res.status(201).json({ message: "Sovereign Handshake active.", handshake: newHandshake });
}

// ==========================================
// 4. DEVELOPER & PROVIDER CONTROLLERS
// ==========================================
export function getProviderHandshake(req, res) {
  const { id } = req.params;
  const handshake = db.handshakes.find(h => h.id === id);
  if (!handshake) {
    return res.status(404).json({ error: "Handshake session not found." });
  }

  res.status(200).json(handshake);
}

export function registerDeveloper(req, res) {
  const { companyName, developerEmail, publicKeyPem, webhookUrl } = req.body;
  if (!companyName || !developerEmail || !publicKeyPem) {
    return res.status(400).json({ error: "Missing required developer parameters." });
  }

  const newProvider = {
    id: `provider-${Math.random().toString(36).substr(2, 9)}`,
    companyName,
    developerEmail,
    apiKeyHash: `hash-key-${companyName}`, // Mock api key hash
    publicKeyPem,
    webhookUrl,
    createdAt: new Date().toISOString()
  };

  db.serviceProviders.push(newProvider);
  res.status(201).json({
    message: "Developer profile registered.",
    provider: { id: newProvider.id, apiKey: `key_${companyName}_secret` }
  });
}

export function processDecision(req, res) {
  const { id } = req.params; // handshake ID
  const { decision } = req.body; // 'approve' or 'reject'
  
  const handshake = db.handshakes.find(h => h.id === id);
  if (!handshake) {
    return res.status(404).json({ error: "Handshake session not found." });
  }

  handshake.status = "decision_purged";
  handshake.decisionMadeAt = new Date().toISOString();

  // Clear cache documents (Simulate S3 wipe)
  handshake.sharedDocumentsMeta.forEach(meta => {
    meta.ephemeralObjectKey = null; // Purged!
  });

  db.auditLogs.push({
    id: `audit-${Math.random().toString(36).substr(2, 9)}`,
    handshakeId: id,
    eventType: "DECISION_SHRED",
    eventMetadata: { decision, action: "purge_cached_verification_copies" },
    createdAt: new Date().toISOString()
  });

  res.status(200).json({
    message: "Application decision recorded. Dynamic purge routine executed successfully.",
    handshake
  });
}
