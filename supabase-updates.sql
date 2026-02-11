-- Admin Dashboard Support Tables
-- Run this in Supabase SQL Editor to enable full admin functionality

-- ============================================
-- NOTIFICATION TEMPLATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_type TEXT UNIQUE NOT NULL, -- 'confirmation', 'reminder', 'cancellation', 'email_confirmation', etc.
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_sms BOOLEAN DEFAULT false,
  is_email BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default templates
INSERT INTO notification_templates (template_type, name, content, is_sms, is_email) VALUES
  ('confirmation', 'SMS Confirmation', 'Hi {name}! Your appointment at {location} is confirmed for {date} at {time}. Reply HELP for assistance.', true, false),
  ('reminder', 'SMS Reminder', 'Reminder: You have an appointment at {location} tomorrow at {time}. Reply CANCEL to cancel.', true, false),
  ('cancellation', 'SMS Cancellation', 'Your appointment at {location} on {date} at {time} has been cancelled.', true, false),
  ('email_confirmation', 'Email Confirmation', 'Dear {name},\n\nYour appointment has been confirmed:\n\n📅 Date: {date}\n⏰ Time: {time}\n📍 Location: {location}\n💇 Service: {service}\n\nThank you for choosing ServiceGenie!', false, true),
  ('email_reminder', 'Email Reminder', 'Dear {name},\n\nThis is a friendly reminder about your upcoming appointment:\n\n📅 Date: {date}\n⏰ Time: {time}\n📍 Location: {location}\n💇 Service: {service}\n\nWe look forward to seeing you!', false, true),
  ('email_cancellation', 'Email Cancellation', 'Dear {name},\n\nYour appointment has been cancelled:\n\n📅 Date: {date}\n⏰ Time: {time}\n📍 Location: {location}\n💇 Service: {service}\n\nIf you did not request this cancellation, please contact us.', false, true),
  ('email_marketing', 'Marketing Email', 'Dear {name},\n\n{content}\n\n---\n\nTo manage your communication preferences, visit your account settings or reply STOP to opt out.', false, true)
ON CONFLICT (template_type) DO NOTHING;

-- ============================================
-- SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT 1, -- Single row config
  business_name TEXT DEFAULT 'ServiceGenie Salon',
  default_language TEXT DEFAULT 'en',
  supported_languages TEXT[] DEFAULT ARRAY['en', 'es', 'fr'],
  auto_detect_language BOOLEAN DEFAULT false,
  large_text_mode BOOLEAN DEFAULT false,
  high_contrast_mode BOOLEAN DEFAULT false,
  reduce_motion BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- CAMPAIGNS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'both')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  content TEXT NOT NULL,
  target_segment TEXT, -- 'all', 'vip', 'new', 'inactive', etc.
  recipient_count INT DEFAULT 0,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- GIFT CARD PURCHASES (extended tracking)
-- ============================================
ALTER TABLE gift_cards ADD COLUMN IF NOT EXISTS recipient_name TEXT;
ALTER TABLE gift_cards ADD COLUMN IF NOT EXISTS recipient_email TEXT;
ALTER TABLE gift_cards ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE gift_cards ADD COLUMN IF NOT EXISTS purchased_by_email TEXT;

-- ============================================
-- INTEGRATIONS TABLE (for OAuth tokens)
-- ============================================
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT UNIQUE NOT NULL, -- 'quickbooks', 'xero', 'square', 'clover', 'mailchimp', 'klaviyo'
  name TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  config JSONB DEFAULT '{}',
  is_connected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert integration placeholders
INSERT INTO integrations (provider, name) VALUES
  ('quickbooks', 'QuickBooks Online'),
  ('xero', 'Xero'),
  ('square', 'Square'),
  ('clover', 'Clover'),
  ('mailchimp', 'Mailchimp'),
  ('klaviyo', 'Klaviyo')
ON CONFLICT (provider) DO NOTHING;

-- ============================================
-- RLS for new tables
-- ============================================
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated access" ON notification_templates FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated access" ON settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated access" ON campaigns FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated access" ON integrations FOR ALL TO authenticated USING (true);

-- ============================================
-- FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-updated_at
CREATE TRIGGER update_notification_templates_updated_at BEFORE UPDATE ON notification_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
