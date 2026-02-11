-- ServiceGenie Database Schema
-- Run this in Supabase SQL Editor or: supabase db push
-- Safe to run repeatedly (idempotent)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CUSTOMERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT NOT NULL,
  notes TEXT,
  total_spent DECIMAL(10,2) DEFAULT 0,
  visit_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- ============================================
-- PROVIDERS (STYLISTS) TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  specialty TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_providers_name ON providers(name);
CREATE INDEX IF NOT EXISTS idx_providers_active ON providers(is_active);

-- Add team columns if not exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'providers' AND column_name = 'team_id') THEN
    ALTER TABLE providers ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'providers' AND column_name = 'is_team_lead') THEN
    ALTER TABLE providers ADD COLUMN is_team_lead BOOLEAN DEFAULT false;
  END IF;
END $$;

-- ============================================
-- LOCATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  phone TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  opening_time TIME DEFAULT '08:00',
  closing_time TIME DEFAULT '20:00',
  is_active BOOLEAN DEFAULT true,
  min_lead_hours INT DEFAULT 24,
  buffer_minutes INT DEFAULT 15,
  default_duration INT DEFAULT 60,
  cancellation_window_hours INT DEFAULT 24,
  cancellation_fee_percent INT DEFAULT 50,
  require_deposit BOOLEAN DEFAULT false,
  deposit_amount DECIMAL(10,2) DEFAULT 0,
  no_show_fee DECIMAL(10,2) DEFAULT 25.00,
  no_show_ban_threshold INT DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_locations_active ON locations(is_active);

-- ============================================
-- SERVICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  duration INT NOT NULL DEFAULT 60,
  price DECIMAL(10,2) NOT NULL,
  color TEXT DEFAULT '#6366f1',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_name ON services(name);

-- ============================================
-- APPOINTMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration INT NOT NULL DEFAULT 60,
  price DECIMAL(10,2),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_provider ON appointments(provider_id);
CREATE INDEX IF NOT EXISTS idx_appointments_customer ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- ============================================
-- BLOCKED TIMES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blocked_times (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  day_of_week INT CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_date DATE,
  end_date DATE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  reason TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blocked_provider ON blocked_times(provider_id);
CREATE INDEX IF NOT EXISTS idx_blocked_dates ON blocked_times(start_date, end_date);

-- ============================================
-- TEAMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  color TEXT DEFAULT '#8b5cf6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WAITLIST TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  requested_date DATE NOT NULL,
  preferred_time_range TEXT,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'notified', 'booked', 'expired', 'removed')),
  position INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_date ON waitlist(requested_date);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);

-- ============================================
-- GIFT CARDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gift_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  initial_value DECIMAL(10,2) NOT NULL,
  balance DECIMAL(10,2) NOT NULL,
  purchased_by_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'partial', 'redeemed', 'expired')),
  expires_at DATE,
  recipient_name TEXT,
  recipient_email TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON gift_cards(code);

-- ============================================
-- LOYALTY PROGRAM TABLES
-- ============================================
CREATE TABLE IF NOT EXISTS loyalty_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  min_points INT NOT NULL DEFAULT 0,
  discount_percent INT DEFAULT 0,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loyalty_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  points_balance INT DEFAULT 0,
  lifetime_points INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SUBSCRIPTIONS TABLES
-- ============================================
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  frequency TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS membership_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  billing_cycle TEXT NOT NULL DEFAULT 'monthly',
  benefits TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS active_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES membership_tiers(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'expired')),
  current_period_end DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS active_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  next_shipment_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CHECK-INS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  method TEXT DEFAULT 'QR' CHECK (method IN ('QR', 'manual')),
  check_in_time TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_check_ins_time ON check_ins(check_in_time);

-- ============================================
-- DAILY REVENUE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS daily_revenue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  appointment_count INT DEFAULT 0,
  customer_count INT DEFAULT 0,
  provider_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTIFICATION TEMPLATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_type TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_sms BOOLEAN DEFAULT false,
  is_email BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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
  id UUID PRIMARY KEY DEFAULT 1,
  business_name TEXT DEFAULT 'ServiceGenie Salon',
  default_language TEXT DEFAULT 'en',
  supported_languages TEXT[] DEFAULT ARRAY['en', 'es', 'fr'],
  auto_detect_language BOOLEAN DEFAULT false,
  large_text_mode BOOLEAN DEFAULT false,
  high_contrast_mode BOOLEAN DEFAULT false,
  reduce_motion BOOLEAN DEFAULT false,
  points_per_dollar INT DEFAULT 10,
  points_expiry_months INT DEFAULT 12,
  welcome_points INT DEFAULT 50,
  referral_bonus INT DEFAULT 250,
  birthday_bonus_points INT DEFAULT 200,
  birthday_discount INT DEFAULT 15,
  payout_frequency TEXT DEFAULT 'weekly',
  payout_day TEXT DEFAULT 'Friday',
  minimum_payout_amount DECIMAL(10,2) DEFAULT 100.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO settings (id) VALUES ('11111111-1111-1111-1111-111111111111') ON CONFLICT (id) DO NOTHING;

-- ============================================
-- CAMPAIGNS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'both')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  content TEXT NOT NULL,
  target_segment TEXT,
  recipient_count INT DEFAULT 0,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INTEGRATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  config JSONB DEFAULT '{}',
  is_connected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO integrations (provider, name) VALUES
  ('quickbooks', 'QuickBooks Online'),
  ('xero', 'Xero'),
  ('square', 'Square'),
  ('clover', 'Clover'),
  ('mailchimp', 'Mailchimp'),
  ('klaviyo', 'Klaviyo')
ON CONFLICT (provider) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN 
    SELECT table_name FROM information_schema.columns 
    WHERE column_name = 'id' 
    AND table_schema = 'public'
    AND table_name NOT LIKE 'pg_%'
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);
  END LOOP;
END $$;

-- Create RLS policies one by one (PostgreSQL doesn't support CREATE POLICY IF NOT EXISTS)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated access' AND tablename = 'customers') THEN
    CREATE POLICY "Allow authenticated access" ON customers FOR ALL TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated access' AND tablename = 'providers') THEN
    CREATE POLICY "Allow authenticated access" ON providers FOR ALL TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated access' AND tablename = 'appointments') THEN
    CREATE POLICY "Allow authenticated access" ON appointments FOR ALL TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated access' AND tablename = 'blocked_times') THEN
    CREATE POLICY "Allow authenticated access" ON blocked_times FOR ALL TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated access' AND tablename = 'teams') THEN
    CREATE POLICY "Allow authenticated access" ON teams FOR ALL TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated access' AND tablename = 'waitlist') THEN
    CREATE POLICY "Allow authenticated access" ON waitlist FOR ALL TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated access' AND tablename = 'gift_cards') THEN
    CREATE POLICY "Allow authenticated access" ON gift_cards FOR ALL TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated access' AND tablename = 'loyalty_tiers') THEN
    CREATE POLICY "Allow authenticated access" ON loyalty_tiers FOR ALL TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated access' AND tablename = 'loyalty_points') THEN
    CREATE POLICY "Allow authenticated access" ON loyalty_points FOR ALL TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated access' AND tablename = 'subscription_plans') THEN
    CREATE POLICY "Allow authenticated access" ON subscription_plans FOR ALL TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated access' AND tablename = 'active_subscriptions') THEN
    CREATE POLICY "Allow authenticated access" ON active_subscriptions FOR ALL TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated access' AND tablename = 'check_ins') THEN
    CREATE POLICY "Allow authenticated access" ON check_ins FOR ALL TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated access' AND tablename = 'notification_templates') THEN
    CREATE POLICY "Allow authenticated access" ON notification_templates FOR ALL TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated access' AND tablename = 'settings') THEN
    CREATE POLICY "Allow authenticated access" ON settings FOR ALL TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated access' AND tablename = 'campaigns') THEN
    CREATE POLICY "Allow authenticated access" ON campaigns FOR ALL TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated access' AND tablename = 'integrations') THEN
    CREATE POLICY "Allow authenticated access" ON integrations FOR ALL TO authenticated USING (true);
  END IF;
END $$;

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================
-- Create the function (will replace if exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers only if they don't exist (check by function name)
DO $$
DECLARE
  trig_name text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_customers_updated_at') THEN
    CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_providers_updated_at') THEN
    CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_appointments_updated_at') THEN
    CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_loyalty_points_updated_at') THEN
    CREATE TRIGGER update_loyalty_points_updated_at BEFORE UPDATE ON loyalty_points
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Function to calculate appointment end_time
CREATE OR REPLACE FUNCTION calculate_end_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.end_time = NEW.start_time + (NEW.duration || ' minutes')::interval;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'calculate_appointment_end_time') THEN
    CREATE TRIGGER calculate_appointment_end_time BEFORE INSERT OR UPDATE ON appointments
      FOR EACH ROW EXECUTE FUNCTION calculate_end_time();
  END IF;
END $$;

-- ============================================
-- SAMPLE DATA (Optional - uncomment to add)
-- ============================================
-- INSERT INTO customers (name, email, phone) VALUES
--   ('John Smith', 'john@email.com', '555-0101'),
--   ('Sarah Johnson', 'sarah@email.com', '555-0102');

-- INSERT INTO providers (name, email, phone, specialty) VALUES
--   ('Emma Wilson', 'emma@servicegenie.com', '555-0201', 'Color Specialist'),
--   ('James Brown', 'james@servicegenie.com', '555-0202', 'Senior Stylist');

-- INSERT INTO services (name, category, duration, price, color) VALUES
--   ('Haircut', 'Cut', 60, 75.00, '#6366f1'),
--   ('Color & Style', 'Color', 120, 150.00, '#ec4899');

-- INSERT INTO loyalty_tiers (name, min_points, discount_percent, color) VALUES
--   ('Bronze', 0, 0, '#cd7f32'),
--   ('Silver', 500, 5, '#c0c0c0'),
--   ('Gold', 1500, 10, '#ffd700'),
--   ('Platinum', 5000, 15, '#e5e4e2');

-- INSERT INTO membership_tiers (name, price, billing_cycle, benefits) VALUES
--   ('Silver', 49.99, 'monthly', ARRAY['Unlimited Haircuts', '10% off products']),
--   ('Gold', 99.99, 'monthly', ARRAY['Unlimited Haircuts', '20% off products', 'Priority Booking']);

-- Done!
