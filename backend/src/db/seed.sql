-- Doc Vault Database Seeding Script
-- Target: PostgreSQL 13+ / Supabase

-- Clean existing seeds (safe for testing)
TRUNCATE TABLE audit_logs CASCADE;
TRUNCATE TABLE handshakes CASCADE;
TRUNCATE TABLE retention_policies CASCADE;
TRUNCATE TABLE service_providers CASCADE;

-- ==========================================
-- 1. SEED SERVICE PROVIDERS
-- ==========================================
-- Mock RSA-2048 public keys for testing EDK wraps
-- API Keys (Cleartext for local testing):
-- - Apex API Key: "apex_dev_key_secret_2026" (SHA-256: e24a0d92a188dfa002bc03bbf2b7f836c2b184a2ea2e88a3ea2bc20163a8a9ff)
-- - Horizon API Key: "horizon_dev_key_secret_2026" (SHA-256: d085df7c7e6c3a886ec03b9f62b184b2e882a8ea1e288a3ea2bc20163a8a9ff)
-- - Nova API Key: "nova_dev_key_secret_2026" (SHA-256: b182a8ea0e288a3ea2bc20163a8a9ff2e882b2b1e2a0e28c3ea2bc2b2c892837f)

INSERT INTO service_providers (id, company_name, developer_email, api_key_hash, public_key_pem, webhook_url)
VALUES
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Apex Mortgages',
    'integrations@apexmortgages.com',
    'e24a0d92a188dfa002bc03bbf2b7f836c2b184a2ea2e88a3ea2bc20163a8a9ff',
    '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0y61R5lU/2kGf05q7oRk\nU1t1f4iL5k+vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU\n4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0X\np5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4v\nL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5\np1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL2\n6wIDAQAB\n-----END PUBLIC KEY-----',
    'http://localhost:3000/api/mock-webhooks/apex'
),
(
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'Horizon Auto',
    'developer@horizonauto.com',
    'd085df7c7e6c3a886ec03b9f62b184b2e882a8ea1e288a3ea2bc20163a8a9ff',
    '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3F8m4X9lT/2kGf05q7oR\nkU1t1f4iL5k+vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4l\nU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0\nXp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4\nvL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp\n5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL\n26wIDAQAB\n-----END PUBLIC KEY-----',
    'http://localhost:3000/api/mock-webhooks/horizon'
),
(
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    'Nova Credit',
    'api@novacredit.com',
    'b182a8ea0e288a3ea2bc20163a8a9ff2e882b2b1e2a0e28c3ea2bc2b2c892837f',
    '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1y61R5lU/2kGf05q7oRk\nU1t1f4iL5k+vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU\n4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0X\np5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4v\nL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5\np1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL26vVd0Xp5p1t4lU4vL2\n6wIDAQAB\n-----END PUBLIC KEY-----',
    'http://localhost:3000/api/mock-webhooks/nova'
);

-- ==========================================
-- 2. SEED RETENTION POLICIES
-- ==========================================
-- Required Documents format: [{"class": "Primary Identity", "qty": 1}]
-- Retention Terms format: {"class_name": duration_seconds} (e.g. 180s = 3 minutes)

INSERT INTO retention_policies (id, provider_id, application_type, required_documents, retention_terms)
VALUES
(
    'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', -- Apex Mortgages
    'home_loan',
    '[
        {"class": "Primary Identity", "qty": 1},
        {"class": "Secondary Identity", "qty": 1},
        {"class": "Income Proof", "qty": 2}
    ]'::jsonb,
    '{
        "Primary Identity": 180,
        "Secondary Identity": 180,
        "Income Proof": 180
    }'::jsonb
),
(
    'e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b',
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', -- Horizon Auto
    'car_loan',
    '[
        {"class": "Primary Identity", "qty": 1},
        {"class": "Income Proof", "qty": 1}
    ]'::jsonb,
    '{
        "Primary Identity": 90,
        "Income Proof": 90
    }'::jsonb
),
(
    'f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c',
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', -- Nova Credit
    'credit_card',
    '[
        {"class": "Primary Identity", "qty": 1}
    ]'::jsonb,
    '{
        "Primary Identity": 20
    }'::jsonb
);
