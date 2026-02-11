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

-- Add team columns to providers (after teams table exists)
DO $$ BEGIN
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
-- SAMPLE DATA (Optional - uncomment or run separately)
-- ============================================

-- Teams
INSERT INTO teams (name, color) VALUES
  ('Creative Team', '#8b5cf6'),
  ('Style Squad', '#ec4899'),
  ('Color Crew', '#06b6d4')
ON CONFLICT DO NOTHING;

-- Locations
INSERT INTO locations (name, address, city, state, zip, phone, opening_time, closing_time) VALUES
  ('Downtown Salon', '123 Main St', 'New York', 'NY', '10001', '(555) 100-0001', '09:00', '20:00'),
  ('Uptown Studio', '456 Park Ave', 'New York', 'NY', '10065', '(555) 100-0002', '10:00', '21:00'),
  ('Brooklyn Loft', '789 Bedford Ave', 'Brooklyn', 'NY', '11211', '(555) 100-0003', '08:00', '19:00')
ON CONFLICT DO NOTHING;

-- Providers (Stylists) - add team_id separately after teams created
INSERT INTO providers (name, email, phone, specialty, bio, avatar_url) VALUES
  ('Emma Wilson', 'emma@servicegenie.com', '(555) 200-0001', 'Color Specialist', 'Master colorist with 10+ years experience. Specializes in balayage and highlights.', NULL),
  ('James Brown', 'james@servicegenie.com', '(555) 200-0002', 'Senior Stylist', 'Expert in cuts and styling. Trained in London and Paris.', NULL),
  ('Sofia Garcia', 'sofia@servicegenie.com', '(555) 200-0003', 'Texture Expert', 'Curl specialist and natural hair care expert.', NULL),
  ('Michael Chen', 'michael@servicegenie.com', '(555) 200-0004', 'Master Stylist', 'Award-winning stylist featured in Vogue.', NULL),
  ('Aisha Patel', 'aisha@servicegenie.com', '(555) 200-0005', 'Extensions Specialist', 'Premium hair extensions and keratin treatments.', NULL)
ON CONFLICT DO NOTHING;

-- Update providers with team_id (after teams exist)
DO $$
DECLARE
  t_creative UUID := (SELECT id FROM teams WHERE name = 'Creative Team' LIMIT 1);
  t_style UUID := (SELECT id FROM teams WHERE name = 'Style Squad' LIMIT 1);
  t_color UUID := (SELECT id FROM teams WHERE name = 'Color Crew' LIMIT 1);
BEGIN
  UPDATE providers SET team_id = t_creative, is_team_lead = true WHERE name = 'Emma Wilson';
  UPDATE providers SET team_id = t_style, is_team_lead = true WHERE name = 'James Brown';
  UPDATE providers SET team_id = t_color WHERE name = 'Sofia Garcia';
  UPDATE providers SET team_id = t_style WHERE name = 'Michael Chen';
  UPDATE providers SET team_id = t_creative WHERE name = 'Aisha Patel';
END $$;

-- Customers
INSERT INTO customers (name, email, phone, notes, total_spent, visit_count) VALUES
  ('John Smith', 'john.smith@email.com', '(555) 300-0001', 'Prefers afternoon appointments', 1250.00, 15),
  ('Sarah Johnson', 'sarah.j@email.com', '(555) 300-0002', 'Allergic to ammonia', 890.50, 8),
  ('Michael Davis', 'm.davis@email.com', '(555) 300-0003', 'VIP client - always tip 25%', 2100.00, 22),
  ('Emily Rodriguez', 'emily.r@email.com', '(555) 300-0004', 'Birthday: March 15', 675.00, 6),
  ('David Kim', 'david.kim@email.com', '(555) 300-0005', 'Prefers natural products', 450.00, 4),
  ('Jessica Williams', 'jess.w@email.com', '(555) 300-0006', 'Referral: Michael Chen client', 1890.00, 18),
  ('Robert Taylor', 'rob.taylor@email.com', '(555) 300-0007 client', 'First-time referral', 0.00, 0),
  ('Amanda Martinez', 'amanda.m@email.com', '(555) 300-0008', 'Member since 2024', 3200.00, 35),
  ('Christopher Lee', 'chris.lee@email.com', '(555) 300-0009', 'Corporate account', 550.00, 5),
  ('Nicole Thompson', 'nicole.t@email.com', '(555) 300-0010', 'Loyalty Gold tier', 1450.00, 14)
ON CONFLICT DO NOTHING;

-- Services
INSERT INTO services (name, description, category, duration, price, color, is_active) VALUES
  -- Cuts
  ('Women''s Haircut', 'Precision cut and blowout', 'Cut', 60, 85.00, '#6366f1', true),
  ('Men''s Haircut', 'Classic or modern style', 'Cut', 30, 45.00, '#8b5cf6', true),
  ('Kids Haircut', 'For children under 12', 'Cut', 25, 30.00, '#a78bfa', true),
  ('Bang Trim', 'Quick trim of bangs', 'Cut', 15, 20.00, '#c4b5fd', true),
  
  -- Color
  ('Full Balayage', 'Hand-painted highlights', 'Color', 180, 180.00, '#ec4899', true),
  ('Root Touch-up', 'Cover regrowth', 'Color', 90, 95.00, '#f472b6', true),
  ('Full Color', 'Single process color', 'Color', 120, 120.00, '#f9a8d4', true),
  ('Highlights', 'Foil highlights', 'Color', 150, 150.00, '#fbcfe8', true),
  ('Gloss/Toner', 'Add shine and tone', 'Color', 45, 65.00, '#fda4af', true),
  
  -- Treatments
  ('Keratin Treatment', 'Smoothing treatment', 'Treatment', 120, 250.00, '#06b6d4', true),
  ('Deep Conditioning', 'Intensive moisture', 'Treatment', 30, 45.00, '#22d3ee', true),
  ('Scalp Treatment', 'Exfoliating scalp massage', 'Treatment', 30, 50.00, '#67e8f9', true),
  
  -- Styling
  ('Blowout', 'Professional blow dry', 'Style', 45, 55.00, '#10b981', true),
  ('Updo', 'Special occasion styling', 'Style', 90, 125.00, '#34d399', true),
  ('Bridal Styling', 'Complete wedding look', 'Style', 180, 350.00, '#6ee7b7', true),
  ('Event Styling', 'Special event prep', 'Style', 60, 85.00, '#a7f3d0', true),
  
  -- Add-ons
  ('Deep Conditioning Add-on', '', 'Add-on', 15, 25.00, '#fbbf24', true),
  ('Scalp Massage Add-on', '', 'Add-on', 15, 30.00, '#fcd34d', true),
  ('Hot Towel Finish', '', 'Add-on', 5, 10.00, '#fde68a', true)
ON CONFLICT DO NOTHING;

-- Loyalty Tiers
INSERT INTO loyalty_tiers (name, min_points, discount_percent, color) VALUES
  ('Bronze', 0, 0, '#cd7f32'),
  ('Silver', 500, 5, '#c0c0c0'),
  ('Gold', 1500, 10, '#ffd700'),
  ('Platinum', 5000, 15, '#e5e4e2')
ON CONFLICT DO NOTHING;

-- Loyalty Points
INSERT INTO loyalty_points (customer_id, points_balance, lifetime_points) VALUES
  ((SELECT id FROM customers WHERE email = 'john.smith@email.com' LIMIT 1), 12500, 15000),
  ((SELECT id FROM customers WHERE email = 'sarah.j@email.com' LIMIT 1), 4500, 5000),
  ((SELECT id FROM customers WHERE email = 'm.davis@email.com' LIMIT 1), 21000, 25000),
  ((SELECT id FROM customers WHERE email = 'emily.r@email.com' LIMIT 1), 3375, 4000),
  ((SELECT id FROM customers WHERE email = 'david.kim@email.com' LIMIT 1), 2250, 2500),
  ((SELECT id FROM customers WHERE email = 'jess.w@email.com' LIMIT 1), 9450, 11000),
  ((SELECT id FROM customers WHERE email = 'rob.taylor@email.com' LIMIT 1), 0, 0),
  ((SELECT id FROM customers WHERE email = 'amanda.m@email.com' LIMIT 1), 32000, 40000),
  ((SELECT id FROM customers WHERE email = 'chris.lee@email.com' LIMIT 1), 2750, 3000),
  ((SELECT id FROM customers WHERE email = 'nicole.t@email.com' LIMIT 1), 7250, 9000)
ON CONFLICT DO NOTHING;

-- Membership Tiers
INSERT INTO membership_tiers (name, price, billing_cycle, benefits, is_active) VALUES
  ('Silver', 49.99, 'monthly', ARRAY['Unlimited Haircuts', '10% off color services', 'Free deep conditioning'], true),
  ('Gold', 99.99, 'monthly', ARRAY['Unlimited Cuts & Styles', '15% off all services', 'Priority Booking', 'Birthday treatment on us'], true),
  ('Platinum', 199.99, 'monthly', ARRAY['All Gold benefits', '25% off all services', 'Exclusive events access', 'Complimentary products', 'VIP phone line'], true),
  ('Annual Gold', 899.99, 'yearly', ARRAY['13 months for price of 12', 'All Gold monthly benefits'], true)
ON CONFLICT DO NOTHING;

-- Active Memberships
INSERT INTO active_memberships (customer_id, tier_id, status, current_period_end) VALUES
  ((SELECT id FROM customers WHERE email = 'm.davis@email.com' LIMIT 1), (SELECT id FROM membership_tiers WHERE name = 'Gold' LIMIT 1), 'active', '2026-03-11'),
  ((SELECT id FROM customers WHERE email = 'amanda.m@email.com' LIMIT 1), (SELECT id FROM membership_tiers WHERE name = 'Platinum' LIMIT 1), 'active', '2026-04-15'),
  ((SELECT id FROM customers WHERE email = 'nicole.t@email.com' LIMIT 1), (SELECT id FROM membership_tiers WHERE name = 'Silver' LIMIT 1), 'active', '2026-02-28'),
  ((SELECT id FROM customers WHERE email = 'jess.w@email.com' LIMIT 1), (SELECT id FROM membership_tiers WHERE name = 'Gold' LIMIT 1), 'active', '2026-03-20')
ON CONFLICT DO NOTHING;

-- Subscription Plans
INSERT INTO subscription_plans (name, price, frequency, is_active) VALUES
  ('Product Box Monthly', 39.99, 'monthly', true),
  ('Product Box Quarterly', 99.99, 'quarterly', true),
  ('Hair Care Essentials', 29.99, 'monthly', true),
  ('Premium Styling Kit', 59.99, 'monthly', true)
ON CONFLICT DO NOTHING;

-- Active Subscriptions
INSERT INTO active_subscriptions (customer_id, plan_id, status, next_shipment_date) VALUES
  ((SELECT id FROM customers WHERE email = 'john.smith@email.com' LIMIT 1), (SELECT id FROM subscription_plans WHERE name = 'Product Box Monthly' LIMIT 1), 'active', '2026-02-15'),
  ((SELECT id FROM customers WHERE email = 'sarah.j@email.com' LIMIT 1), (SELECT id FROM subscription_plans WHERE name = 'Hair Care Essentials' LIMIT 1), 'active', '2026-02-20')
ON CONFLICT DO NOTHING;

-- Appointments (Sample for next 7 days)
INSERT INTO appointments (customer_id, provider_id, service_id, location_id, date, start_time, duration, price, status, notes) VALUES
  -- Today
  ((SELECT id FROM customers WHERE email = 'john.smith@email.com' LIMIT 1), (SELECT id FROM providers WHERE name = 'Emma Wilson' LIMIT 1), (SELECT id FROM services WHERE name = 'Full Balayage' LIMIT 1), (SELECT id FROM locations WHERE name = 'Downtown Salon' LIMIT 1), CURRENT_DATE, '10:00', 180, 180.00, 'confirmed', 'Client wants ash brown tones'),
  ((SELECT id FROM customers WHERE email = 'sarah.j@email.com' LIMIT 1), (SELECT id FROM providers WHERE name = 'James Brown' LIMIT 1), (SELECT id FROM services WHERE name = 'Women''s Haircut' LIMIT 1), (SELECT id FROM locations WHERE name = 'Uptown Studio' LIMIT 1), CURRENT_DATE, '11:00', 60, 85.00, 'confirmed', ''),
  ((SELECT id FROM customers WHERE email = 'm.davis@email.com' LIMIT 1), (SELECT id FROM providers WHERE name = 'Sofia Garcia' LIMIT 1), (SELECT id FROM services WHERE name = 'Keratin Treatment' LIMIT 1), (SELECT id FROM locations WHERE name = 'Downtown Salon' LIMIT 1), CURRENT_DATE, '14:00', 120, 250.00, 'completed', 'Client loves the results'),
  
  -- Tomorrow
  ((SELECT id FROM customers WHERE email = 'emily.r@email.com' LIMIT 1), (SELECT id FROM providers WHERE name = 'Michael Chen' LIMIT 1), (SELECT id FROM services WHERE name = 'Blowout' LIMIT 1), (SELECT id FROM locations WHERE name = 'Brooklyn Loft' LIMIT 1), CURRENT_DATE + 1, '09:00', 45, 55.00, 'confirmed', 'Event tomorrow night'),
  ((SELECT id FROM customers WHERE email = 'david.kim@email.com' LIMIT 1), (SELECT id FROM providers WHERE name = 'Aisha Patel' LIMIT 1), (SELECT id FROM services WHERE name = 'Women''s Haircut' LIMIT 1), (SELECT id FROM locations WHERE name = 'Uptown Studio' LIMIT 1), CURRENT_DATE + 1, '11:00', 60, 85.00, 'scheduled', ''),
  ((SELECT id FROM customers WHERE email = 'jess.w@email.com' LIMIT 1), (SELECT id FROM providers WHERE name = 'Emma Wilson' LIMIT 1), (SELECT id FROM services WHERE name = 'Root Touch-up' LIMIT 1), (SELECT id FROM locations WHERE name = 'Downtown Salon' LIMIT 1), CURRENT_DATE + 1, '15:00', 90, 95.00, 'confirmed', ''),
  
  -- Day after tomorrow
  ((SELECT id FROM customers WHERE email = 'amanda.m@email.com' LIMIT 1), (SELECT id FROM providers WHERE name = 'James Brown' LIMIT 1), (SELECT id FROM services WHERE name = 'Full Balayage' LIMIT 1), (SELECT id FROM locations WHERE name = 'Uptown Studio' LIMIT 1), CURRENT_DATE + 2, '10:00', 180, 180.00, 'confirmed', 'Platinum member - priority booking'),
  ((SELECT id FROM customers WHERE email = 'nicole.t@email.com' LIMIT 1), (SELECT id FROM providers WHERE name = 'Sofia Garcia' LIMIT 1), (SELECT id FROM services WHERE name = 'Deep Conditioning' LIMIT 1), (SELECT id FROM locations WHERE name = 'Brooklyn Loft' LIMIT 1), CURRENT_DATE + 2, '13:00', 30, 45.00, 'scheduled', ''),
  ((SELECT id FROM customers WHERE email = 'chris.lee@email.com' LIMIT 1), (SELECT id FROM providers WHERE name = 'Michael Chen' LIMIT 1), (SELECT id FROM services WHERE name = 'Men''s Haircut' LIMIT 1), (SELECT id FROM locations WHERE name = 'Downtown Salon' LIMIT 1), CURRENT_DATE + 2, '16:00', 30, 45.00, 'scheduled', 'First visit'),
  
  -- Later in week
  ((SELECT id FROM customers WHERE email = 'john.smith@email.com' LIMIT 1), (SELECT id FROM providers WHERE name = 'Aisha Patel' LIMIT 1), (SELECT id FROM services WHERE name = 'Blowout' LIMIT 1), (SELECT id FROM locations WHERE name = 'Downtown Salon' LIMIT 1), CURRENT_DATE + 3, '11:00', 45, 55.00, 'scheduled', ''),
  ((SELECT id FROM customers WHERE email = 'sarah.j@email.com' LIMIT 1), (SELECT id FROM providers WHERE name = 'Emma Wilson' LIMIT 1), (SELECT id FROM services WHERE name = 'Gloss/Toner' LIMIT 1), (SELECT id FROM locations WHERE name = 'Uptown Studio' LIMIT 1), CURRENT_DATE + 4, '14:00', 45, 65.00, 'scheduled', ''),
  ((SELECT id FROM customers WHERE email = 'm.davis@email.com' LIMIT 1), (SELECT id FROM providers WHERE name = 'James Brown' LIMIT 1), (SELECT id FROM services WHERE name = 'Bridal Styling' LIMIT 1), (SELECT id FROM locations WHERE name = 'Brooklyn Loft' LIMIT 1), CURRENT_DATE + 5, '08:00', 180, 350.00, 'confirmed', 'Trial run next week')
ON CONFLICT DO NOTHING;

-- Blocked Times (Provider time off)
INSERT INTO blocked_times (provider_id, location_id, day_of_week, start_date, end_date, start_time, end_time, reason, is_approved) VALUES
  ((SELECT id FROM providers WHERE name = 'Emma Wilson' LIMIT 1), (SELECT id FROM locations WHERE name = 'Downtown Salon' LIMIT 1), NULL, CURRENT_DATE + 7, CURRENT_DATE + 9, '09:00', '17:00', 'Vacation', true),
  ((SELECT id FROM providers WHERE name = 'James Brown' LIMIT 1), (SELECT id FROM locations WHERE name = 'Uptown Studio' LIMIT 1), 0, NULL, NULL, '10:00', '18:00', 'Day off', true),
  ((SELECT id FROM providers WHERE name = 'Sofia Garcia' LIMIT 1), (SELECT id FROM locations WHERE name = 'Brooklyn Loft' LIMIT 1), NULL, CURRENT_DATE + 3, CURRENT_DATE + 3, '00:00', '23:59', 'Personal day', true)
ON CONFLICT DO NOTHING;

-- Waitlist
INSERT INTO waitlist (customer_id, location_id, service_id, requested_date, preferred_time_range, status, position) VALUES
  ((SELECT id FROM customers WHERE email = 'rob.taylor@email.com' LIMIT 1), (SELECT id FROM locations WHERE name = 'Downtown Salon' LIMIT 1), (SELECT id FROM services WHERE name = 'Full Balayage' LIMIT 1), CURRENT_DATE + 10, 'Morning', 'waiting', 1),
  ((SELECT id FROM customers WHERE email = 'chris.lee@email.com' LIMIT 1), (SELECT id FROM locations WHERE name = 'Uptown Studio' LIMIT 1), (SELECT id FROM services WHERE name = 'Bridal Styling' LIMIT 1), CURRENT_DATE + 14, 'Afternoon', 'waiting', 2)
ON CONFLICT DO NOTHING;

-- Gift Cards
INSERT INTO gift_cards (code, initial_value, balance, purchased_by_id, status, expires_at, recipient_name, recipient_email, message) VALUES
  ('GC-001-ABC123', 100.00, 100.00, (SELECT id FROM customers WHERE email = 'john.smith@email.com' LIMIT 1), 'active', CURRENT_DATE + 365, 'Friend', 'friend@email.com', 'Happy Birthday!'),
  ('GC-002-DEF456', 50.00, 25.00, (SELECT id FROM customers WHERE email = 'sarah.j@email.com' LIMIT 1), 'partial', CURRENT_DATE + 180, 'Mom', 'mom@email.com', 'Treat yourself!'),
  ('GC-003-GHI789', 200.00, 200.00, (SELECT id FROM customers WHERE email = 'm.davis@email.com' LIMIT 1), 'active', CURRENT_DATE + 730, 'Wife', 'wife@email.com', 'Anniversary gift')
ON CONFLICT DO NOTHING;

-- Daily Revenue (Sample historical data)
INSERT INTO daily_revenue (date, location_id, total_revenue, appointment_count, customer_count, provider_count) VALUES
  (CURRENT_DATE - 7, (SELECT id FROM locations WHERE name = 'Downtown Salon' LIMIT 1), 1250.00, 12, 10, 4),
  (CURRENT_DATE - 6, (SELECT id FROM locations WHERE name = 'Downtown Salon' LIMIT 1), 980.00, 9, 8, 3),
  (CURRENT_DATE - 5, (SELECT id FROM locations WHERE name = 'Downtown Salon' LIMIT 1), 1540.00, 15, 12, 5),
  (CURRENT_DATE - 4, (SELECT id FROM locations WHERE name = 'Downtown Salon' LIMIT 1), 890.00, 8, 7, 3),
  (CURRENT_DATE - 3, (SELECT id FROM locations WHERE name = 'Downtown Salon' LIMIT 1), 2100.00, 18, 15, 5),
  (CURRENT_DATE - 2, (SELECT id FROM locations WHERE name = 'Downtown Salon' LIMIT 1), 1670.00, 14, 12, 4),
  (CURRENT_DATE - 1, (SELECT id FROM locations WHERE name = 'Downtown Salon' LIMIT 1), 1890.00, 16, 14, 5)
ON CONFLICT DO NOTHING;

-- Check-ins
INSERT INTO check_ins (appointment_id, customer_id, location_id, method, check_in_time) VALUES
  (NULL, (SELECT id FROM customers WHERE email = 'john.smith@email.com' LIMIT 1), (SELECT id FROM locations WHERE name = 'Downtown Salon' LIMIT 1), 'QR', CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
  (NULL, (SELECT id FROM customers WHERE email = 'sarah.j@email.com' LIMIT 1), (SELECT id FROM locations WHERE name = 'Uptown Studio' LIMIT 1), 'manual', CURRENT_TIMESTAMP - INTERVAL '15 minutes')
ON CONFLICT DO NOTHING;

-- Campaigns
INSERT INTO campaigns (name, type, status, content, target_segment, recipient_count, sent_at) VALUES
  ('Spring Color Event', 'email', 'sent', 'Get 20% off all color services this spring! Book by March 31st.', 'all_clients', 250, CURRENT_DATE - 3),
  ('New Stylist Introduction', 'both', 'draft', 'Meet our new specialist Aisha Patel - book your first appointment for 15% off!', 'new_clients', 50, NULL),
  ('Loyalty Rewards Reminder', 'email', 'scheduled', 'Your points are expiring soon! Redeem them for discounts on your next visit.', 'tier_silver', 120, CURRENT_DATE + 2)
ON CONFLICT DO NOTHING;

-- Integrations (placeholder connections)
INSERT INTO integrations (provider, name, is_connected, config) VALUES
  ('quickbooks', 'QuickBooks Online', false, '{"last_sync": null}'),
  ('mailchimp', 'Mailchimp', true, '{"list_id": "abc123", "last_sync": "2026-02-10"}'),
  ('klaviyo', 'Klaviyo', false, '{"api_key": "hidden"}')
ON CONFLICT DO NOTHING;

-- Done!
