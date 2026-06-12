-- Doc Vault Database Migration Schemas
-- Target: PostgreSQL 13+ / Supabase

-- Enable pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. USERS (Consumers Sovereign Accounts)
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Argon2id / bcrypt hashed on server for API access
    key_derivation_salt VARCHAR(64) NOT NULL, -- Hex-encoded salt used for client-side PBKDF2
    wrapped_vault_key TEXT NOT NULL, -- Hex/Base64 string representing client SVEK key encrypted with master key
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Index user emails for fast credential lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ==========================================
-- 2. DOCUMENTS (Sovereign Vault Inventory)
-- ==========================================
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    custom_label VARCHAR(255) NOT NULL, -- Set by Guided Metadata Override
    original_filename VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(128) NOT NULL,
    s3_object_key VARCHAR(512) NOT NULL, -- Encrypted S3/R2 storage pointer
    checksum_sha256 VARCHAR(64) NOT NULL, -- Cryptographic hash of the cleartext file
    auto_classification_tags JSONB DEFAULT '[]'::jsonb NOT NULL, -- Array of potential labels from OCR
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Index document ownership
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);

-- ==========================================
-- 3. SERVICE PROVIDERS (Enterprise Partners)
-- ==========================================
CREATE TABLE IF NOT EXISTS service_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    developer_email VARCHAR(255) UNIQUE NOT NULL,
    api_key_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of API authorization key
    public_key_pem TEXT NOT NULL, -- RSA/ECDH Public Key for EDK key-wrapping
    webhook_url VARCHAR(512), -- Endpoint to receive purge/decision notifications
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_providers_api_key ON service_providers(api_key_hash);

-- ==========================================
-- 4. RETENTION POLICIES (Published Schemas)
-- ==========================================
CREATE TABLE IF NOT EXISTS retention_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
    application_type VARCHAR(128) NOT NULL, -- e.g. 'home_loan', 'car_loan'
    required_documents JSONB NOT NULL, -- Schema rules array, e.g. [{"class": "primary_id", "qty": 1}]
    retention_terms JSONB NOT NULL, -- Key-value map of TTL seconds per class, e.g. {"primary_id": 86400}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(provider_id, application_type)
);

-- ==========================================
-- 5. HANDSHAKES (Active Verification Sessions)
-- ==========================================
CREATE TABLE IF NOT EXISTS handshakes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
    policy_id UUID NOT NULL REFERENCES retention_policies(id) ON DELETE RESTRICT,
    status VARCHAR(64) DEFAULT 'pending_approval' NOT NULL, -- 'pending_approval', 'active_shared', 'decision_purged', 'ttl_expired'
    shared_documents_meta JSONB DEFAULT '[]'::jsonb NOT NULL, -- Ephemeral S3 cache keys + expiration clocks
    timer_started_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    decision_made_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_handshakes_user ON handshakes(user_id);
CREATE INDEX IF NOT EXISTS idx_handshakes_provider ON handshakes(provider_id);
CREATE INDEX IF NOT EXISTS idx_handshakes_expires ON handshakes(expires_at) WHERE expires_at IS NOT NULL;

-- ==========================================
-- 6. AUDIT LOGS (Immutable Compliance Ledger)
-- ==========================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    handshake_id UUID NOT NULL REFERENCES handshakes(id) ON DELETE CASCADE,
    event_type VARCHAR(128) NOT NULL, -- 'HANDSHAKE_INITIATED', 'PROVIDER_FETCH', 'TTL_PURGED', 'DECISION_SHRED'
    event_metadata JSONB DEFAULT '{}'::jsonb NOT NULL, -- Document hashes, encryption signatures
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_handshake ON audit_logs(handshake_id);
