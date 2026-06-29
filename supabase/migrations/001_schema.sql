-- ============================================================
-- Cart Recovery — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---- CLIENTS ----
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name TEXT NOT NULL,
  shopify_domain TEXT NOT NULL UNIQUE,
  shopify_webhook_secret TEXT NOT NULL,
  resend_api_key TEXT NOT NULL,
  from_email TEXT NOT NULL,
  logo_url TEXT,
  tone_of_voice TEXT NOT NULL DEFAULT 'friendly'
    CHECK (tone_of_voice IN ('professional', 'friendly', 'luxury', 'streetwear')),
  primary_color TEXT DEFAULT '#7C3AED',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- ABANDONED CARTS ----
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  shopify_cart_token TEXT,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  cart_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  products JSONB NOT NULL DEFAULT '[]',
  checkout_url TEXT,
  abandoned_at TIMESTAMPTZ DEFAULT NOW(),
  recovered BOOLEAN DEFAULT FALSE,
  recovered_at TIMESTAMPTZ,
  recovered_value DECIMAL(10,2),
  sequence_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (sequence_status IN ('pending', 'active', 'completed', 'cancelled')),
  emails_sent_count INTEGER NOT NULL DEFAULT 0,
  next_email_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, shopify_cart_token)
);

-- ---- EMAILS SENT ----
CREATE TABLE IF NOT EXISTS emails_sent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES abandoned_carts(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  email_number INTEGER NOT NULL CHECK (email_number IN (1, 2, 3)),
  subject TEXT NOT NULL,
  preview_text TEXT,
  body TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  resend_message_id TEXT,
  opened BOOLEAN DEFAULT FALSE,
  opened_at TIMESTAMPTZ,
  clicked BOOLEAN DEFAULT FALSE,
  clicked_at TIMESTAMPTZ,
  converted BOOLEAN DEFAULT FALSE
);

-- ---- SYSTEM LOGS ----
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  cart_id UUID REFERENCES abandoned_carts(id) ON DELETE SET NULL,
  level TEXT NOT NULL DEFAULT 'info' CHECK (level IN ('info', 'warning', 'error')),
  message TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- INDEXES ----
CREATE INDEX IF NOT EXISTS idx_carts_client_id ON abandoned_carts(client_id);
CREATE INDEX IF NOT EXISTS idx_carts_sequence_status ON abandoned_carts(sequence_status);
CREATE INDEX IF NOT EXISTS idx_carts_next_email_at ON abandoned_carts(next_email_at);
CREATE INDEX IF NOT EXISTS idx_carts_recovered ON abandoned_carts(recovered);
CREATE INDEX IF NOT EXISTS idx_emails_cart_id ON emails_sent(cart_id);
CREATE INDEX IF NOT EXISTS idx_emails_resend_id ON emails_sent(resend_message_id);
CREATE INDEX IF NOT EXISTS idx_logs_client_id ON system_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON system_logs(created_at DESC);

-- ---- ROW LEVEL SECURITY ----
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails_sent ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS (used in API routes)
-- Anon key has no access (dashboard uses service role)
