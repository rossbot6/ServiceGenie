-- Sample data for ServiceGenie testing
-- Run this in Supabase SQL Editor

-- Insert sample locations
INSERT INTO locations (id, name, address, city, state, zip, phone, timezone, opening_time, closing_time, is_active, min_lead_hours, buffer_minutes, default_duration, booking_policy, cancellation_window_hours, cancellation_fee_percent, require_deposit, deposit_amount, no_show_fee, no_show_ban_threshold) VALUES
  (uuid_generate_v4(), 'Downtown Salon', '123 Main Street', 'New York', 'NY', '10001', '(212) 555-0101', 'America/New_York', '08:00', '20:00', true, 24, 15, 60, '{"same_day_allowed": true}', 24, 50, false, 0, 25.00, 3),
  (uuid_generate_v4(), 'Brooklyn Branch', '456 Atlantic Avenue', 'Brooklyn', 'NY', '11201', '(718) 555-0201', 'America/New_York', '09:00', '19:00', true, 12, 20, 90, '{"same_day_allowed": false}', 48, 75, true, 50.00, 35.00, 2)
ON CONFLICT (address) DO NOTHING;

-- Insert sample providers
INSERT INTO providers (id, name, email, phone, specialty, bio, avatar_url, is_active) VALUES
  (uuid_generate_v4(), 'Emma Wilson', 'emma@servicegenie.com', '(212) 555-0101', 'Senior Colorist', 'Specialist in balayage and color corrections with 8 years experience', 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150', true),
  (uuid_generate_v4(), 'James Brown', 'james@servicegenie.com', '(212) 555-0102', 'Master Stylist', 'Expert in modern cuts and styling techniques', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', true),
  (uuid_generate_v4(), 'Sofia Gonzalez', 'sofia@servicegenie.com', '(718) 555-0201', 'Texture Specialist', 'Specialized in curly and textured hair', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', true),
  (uuid_generate_v4(), 'Michael Kim', 'michael@servicegenie.com', '(718) 555-0202', 'Men''s Stylist', 'Expert in men''s grooming and modern cuts', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample services
INSERT INTO services (id, name, description, category, duration, price, color, is_active) VALUES
  (uuid_generate_v4(), "Women's Haircut", 'Professional haircut with wash, cut, and style', 'Cut', 60, 85.00, '#8B5CF6', true),
  (uuid_generate_v4(), "Men's Haircut", 'Modern men''s cut with wash and style', 'Cut', 30, 45.00, '#3B82F6', true),
  (uuid_generate_v4(), 'Full Balayage', 'Hand-painted highlights for natural sun-kissed look', 'Color', 180, 180.00, '#F59E0B', true),
  (uuid_generate_v4(), 'Partial Highlights', 'Partial head highlighting with toner', 'Color', 120, 120.00, '#F59E0B', true),
  (uuid_generate_v4(), 'Keratin Treatment', 'Smoothing keratin service for frizz control', 'Treatment', 120, 250.00, '#10B981', true),
  (uuid_generate_v4(), 'Blowout + Style', 'Professional blowout with heat protection', 'Style', 45, 55.00, '#EC4899', true),
  (uuid_generate_v4(), 'Bridal Updo', 'Elegant updo for special occasions', 'Style', 90, 150.00, '#EC4899', true),
  (uuid_generate_v4(), 'Scalp Treatment', 'Deep cleansing and nourishing scalp treatment', 'Treatment', 45, 75.00, '#10B981', true)
ON CONFLICT (name) DO NOTHING;

-- Insert sample customers
INSERT INTO customers (id, name, email, phone, notes, total_spent, visit_count) VALUES
  (uuid_generate_v4(), 'Sarah Johnson', 'sarah@example.com', '(212) 555-1001', 'Prefers Emma for color work', 1250.00, 8),
  (uuid_generate_v4(), 'Michael Davis', 'michael@example.com', '(212) 555-1002', 'Allergic to sulfate products', 890.00, 5),
  (uuid_generate_v4(), 'Emily Rodriguez', 'emily@example.com', '(718) 555-2001', 'First-time client for balayage', 650.00, 3),
  (uuid_generate_v4(), 'David Chen', 'david@example.com', '(212) 555-1003', 'Regular men''s cuts', 275.00, 6),
  (uuid_generate_v4(), 'Jessica Brown', 'jessica@example.com', '(718) 555-2002', 'Loyal client, prefers morning appointments', 2100.00, 15)
ON CONFLICT (email) DO NOTHING;