-- ServiceGenie Database Schema for Supabase
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

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
  -- Booking Policies
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
  duration INT NOT NULL DEFAULT 60, -- minutes
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
  duration INT NOT NULL DEFAULT 60, -- minutes
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
  day_of_week INT CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday
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

-- Update providers to link to teams (run once)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'providers' AND column_name = 'team_id') THEN
    ALTER TABLE providers ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'providers' AND column_name = 'is_team_lead') THEN
    ALTER TABLE providers ADD COLUMN is_team_lead BOOLEAN DEFAULT false;
  END IF;
END $$;

-- ============================================
-- WAITLIST TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  requested_date DATE NOT NULL,
  preferred_time_range TEXT, -- e.g., 'Morning', 'After 5 PM'
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON gift_cards(code);

-- ============================================
-- LOYALTY PROGRAM TABLES
-- ============================================
CREATE TABLE IF NOT EXISTS loyalty_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- Bronze, Silver, etc.
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
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  frequency TEXT NOT NULL, -- 'Monthly', 'Bi-monthly'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MEMBERSHIP TIERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS membership_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  billing_cycle TEXT NOT NULL DEFAULT 'monthly', -- 'monthly', 'yearly'
  benefits TEXT[], -- e.g. ['Unlimited Haircuts', '10% off products']
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
-- REVENUE/ANALYTICS TABLE
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- Simple RLS policies (update as needed for production)
CREATE POLICY IF NOT EXISTS "Allow authenticated access" ON customers FOR ALL TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated access" ON providers FOR ALL TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated access" ON appointments FOR ALL TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated access" ON blocked_times FOR ALL TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated access" ON teams FOR ALL TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated access" ON waitlist FOR ALL TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated access" ON gift_cards FOR ALL TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated access" ON loyalty_tiers FOR ALL TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated access" ON loyalty_points FOR ALL TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated access" ON subscription_plans FOR ALL TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated access" ON active_subscriptions FOR ALL TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated access" ON check_ins FOR ALL TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated access" ON notification_templates FOR ALL TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated access" ON settings FOR ALL TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated access" ON campaigns FOR ALL TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated access" ON integrations FOR ALL TO authenticated USING (true);

-- ============================================
-- SAMPLE DATA (Optional)
-- ============================================
-- INSERT INTO customers (name, email, phone) VALUES
--   ('John Smith', 'john@email.com', '555-0101'),
--   ('Sarah Johnson', 'sarah@email.com', '555-0102'),
--   ('Mike Davis', 'mike@email.com', '555-0103');

-- INSERT INTO providers (name, email, phone, specialty) VALUES
--   ('Emma Wilson', 'emma@servicegenie.com', '555-0201', 'Color Specialist'),
--   ('James Brown', 'james@servicegenie.com', '555-0202', 'Senior Stylist'),
--   ('Lisa Chen', 'lisa@servicegenie.com', '555-0203', 'Cut & Style');

-- INSERT INTO services (name, category, duration, price, color) VALUES
--   ('Haircut', 'Cut', 60, 75.00, '#6366f1'),
--   ('Color & Style', 'Color', 120, 150.00, '#ec4899'),
--   ('Blowout', 'Style', 45, 50.00, '#10b981'),
--   ('Full Makeup', 'Beauty', 60, 85.00, '#f59e0b'),
--   ('Manicure', 'Nails', 45, 45.00, '#8b5cf6');

-- INSERT INTO locations (name, address, city, state, zip) VALUES
--   ('Downtown Salon', '123 Main St', 'New York', 'NY', '10001'),
--   ('Uptown Studio', '456 Park Ave', 'New York', 'NY', '10021');

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers only if they don't exist
DO $$
DECLARE
  trig text;
  tbl text;
BEGIN
  FOR trig, tbl IN 
    SELECT DISTINCT tgname, relname FROM pg_trigger WHERE tgname LIKE 'update_%_updated_at'
  LOOP
    -- Triggers exist, skip
  END LOOP;
  
  -- Create triggers for each table
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

-- Function to calculate appointment end_time from start_time and duration
CREATE OR REPLACE FUNCTION calculate_end_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.end_time = NEW.start_time + (NEW.duration || ' minutes')::interval;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'calculate_appointment_end_time') THEN
    CREATE TRIGGER calculate_appointment_end_time BEFORE INSERT OR UPDATE ON appointments
      FOR EACH ROW EXECUTE FUNCTION calculate_end_time();
  END IF;
END $$;

-- ============================================
-- DONE!
-- ============================================
-- After running this, get your credentials from:
-- Supabase Dashboard > Settings > API
-- Use the URL and anon key in lib/supabase.js
