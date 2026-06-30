-- ============================================================
-- Calculator Leads — captures emails from the cart loss calculator
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS calculator_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  monthly_revenue DECIMAL(10,2) NOT NULL,
  estimated_lost DECIMAL(10,2) NOT NULL,
  estimated_recoverable DECIMAL(10,2) NOT NULL,
  shopify_domain TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calculator_leads_created_at ON calculator_leads(created_at DESC);

ALTER TABLE calculator_leads ENABLE ROW LEVEL SECURITY;
-- Service role bypasses RLS (used in API routes)
