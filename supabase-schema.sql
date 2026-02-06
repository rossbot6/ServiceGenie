-- ServiceGenie Database Schema for Supabase
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CUSTOMERS TABLE
-- ============================================
CREATE TABLE customers (
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

CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_customers_phone ON customers(phone);

-- ============================================
-- PROVIDERS (STYLISTS) TABLE
-- ============================================
CREATE TABLE providers (
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

CREATE INDEX idx_providers_name ON providers(name);
CREATE INDEX idx_providers_active ON providers(is_active);

-- ============================================
-- LOCATIONS TABLE
-- ============================================
CREATE TABLE locations (
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_locations_active ON locations(is_active);

-- ============================================
-- SERVICES TABLE
-- ============================================
CREATE TABLE services (
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

CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_services_name ON services(name);

-- ============================================
-- APPOINTMENTS TABLE
-- ============================================
CREATE TABLE appointments (
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

CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_provider ON appointments(provider_id);
CREATE INDEX idx_appointments_customer ON appointments(customer_id);
CREATE INDEX idx_appointments_status ON appointments(status);

-- ============================================
-- BLOCKED TIMES TABLE
-- ============================================
CREATE TABLE blocked_times (
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

CREATE INDEX idx_blocked_provider ON blocked_times(provider_id);
CREATE INDEX idx_blocked_dates ON blocked_times(start_date, end_date);

-- ============================================
-- REVENUE/ANALYTICS TABLE
-- ============================================
CREATE TABLE daily_revenue (
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
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_times ENABLE ROW LEVEL SECURITY;

-- Simple RLS: Allow authenticated users to read/write
-- In production, you'd want more granular policies
CREATE POLICY "Allow authenticated access" ON customers FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated access" ON providers FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated access" ON appointments FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated access" ON blocked_times FOR ALL TO authenticated USING (true);

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

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate appointment end_time from start_time and duration
CREATE OR REPLACE FUNCTION calculate_end_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.end_time = NEW.start_time + (NEW.duration || ' minutes')::interval;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_appointment_end_time BEFORE INSERT OR UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION calculate_end_time();

-- ============================================
-- DONE!
-- ============================================
-- After running this, get your credentials from:
-- Supabase Dashboard > Settings > API
-- Use the URL and anon key in lib/supabase.js
