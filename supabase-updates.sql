-- ServiceGenie Database Updates
-- Created: 2026-02-10
-- All features implemented: Loyalty, Gift Cards, Marketing, POS, API, Multi-Language

-- ============================================
-- LOYALTY & REWARDS PROGRAM
-- ============================================

-- Create loyalty_points table
CREATE TABLE IF NOT EXISTS loyalty_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id),
    provider_id UUID REFERENCES providers(id),
    appointment_id UUID REFERENCES appointments(id),
    points_earned INTEGER NOT NULL DEFAULT 0,
    points_redeemed INTEGER NOT NULL DEFAULT 0,
    points_balance INTEGER GENERATED ALWAYS AS (points_earned - points_redeemed) STORED,
    transaction_type VARCHAR(20) NOT NULL, -- 'earn', 'redeem', 'expire', 'bonus'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create loyalty_tiers table
CREATE TABLE IF NOT EXISTS loyalty_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    min_points INTEGER NOT NULL DEFAULT 0,
    max_points INTEGER,
    points_multiplier DECIMAL(3,2) DEFAULT 1.00,
    birthday_bonus INTEGER DEFAULT 0,
    perks TEXT[],
    color_code VARCHAR(20) DEFAULT '#94a3b4',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default tiers
INSERT INTO loyalty_tiers (name, min_points, max_points, points_multiplier, birthday_bonus, perks, color_code)
VALUES 
    ('Bronze', 0, 499, 1.00, 0, ARRAY['1 point per dollar spent'], '#94a3b4'),
    ('Silver', 500, 1499, 1.50, 50, ARRAY['1.5 points per dollar spent', 'Birthday bonus: 50 points'], '#f59e0b'),
    ('Gold', 1500, NULL, 2.00, 100, ARRAY['2 points per dollar spent', 'Birthday bonus: 100 points', 'Priority booking', 'Free add-on with each visit'], '#10b981')
ON CONFLICT (name) DO NOTHING;

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    points_cost INTEGER NOT NULL,
    reward_type VARCHAR(50) NOT NULL, -- 'discount_fixed', 'discount_percent', 'free_service', 'product'
    discount_amount DECIMAL(10,2),
    service_id UUID REFERENCES services(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default rewards
INSERT INTO rewards (name, description, points_cost, reward_type, discount_amount)
VALUES 
    ('$5 Off', '$5 discount on any service', 500, 'discount_fixed', 5.00),
    ('$25 Off', '$25 discount on any service', 2500, 'discount_fixed', 25.00),
    ('Free Scalp Treatment', 'Free scalp treatment add-on', 1000, 'free_service', NULL),
    ('Free Haircut', 'Free basic haircut service', 3000, 'free_service', NULL)
ON CONFLICT DO NOTHING;

-- Create customer_rewards_redemptions table
CREATE TABLE IF NOT EXISTS customer_rewards_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id),
    reward_id UUID REFERENCES rewards(id),
    appointment_id UUID REFERENCES appointments(id),
    points_used INTEGER NOT NULL,
    discount_applied DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'redeemed', -- 'redeemed', 'used', 'expired'
    redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    used_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- GIFT CARDS
-- ============================================

-- Create gift_cards table
CREATE TABLE IF NOT EXISTS gift_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    initial_value DECIMAL(10,2) NOT NULL,
    current_balance DECIMAL(10,2) NOT NULL,
    purchaser_id UUID REFERENCES customers(id),
    recipient_name VARCHAR(100) NOT NULL,
    recipient_email VARCHAR(255),
    sender_name VARCHAR(100) NOT NULL,
    message TEXT,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'partial', 'redeemed', 'expired', 'cancelled'
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    template_id UUID
);

-- Create gift_card_transactions table
CREATE TABLE IF NOT EXISTS gift_card_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gift_card_id UUID REFERENCES gift_cards(id),
    appointment_id UUID REFERENCES appointments(id),
    amount DECIMAL(10,2) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- 'purchase', 'redeem', 'refund', 'adjustment'
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- ============================================
-- MARKETING & CAMPAIGNS
-- ============================================

-- Create marketing_campaigns table
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    campaign_type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'push', 'multi'
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'scheduled', 'active', 'paused', 'completed'
    target_segment TEXT[], -- 'all', 'vip', 'new', 'inactive', etc.
    content TEXT NOT NULL,
    subject_line TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaign_analytics table
CREATE TABLE IF NOT EXISTS campaign_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES marketing_campaigns(id),
    total_sent INTEGER DEFAULT 0,
    delivered INTEGER DEFAULT 0,
    opened INTEGER DEFAULT 0,
    clicked INTEGER DEFAULT 0,
    bounced INTEGER DEFAULT 0,
    unsubscribed INTEGER DEFAULT 0,
    open_rate DECIMAL(5,2),
    click_rate DECIMAL(5,2),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- POS & TRANSACTIONS
-- ============================================

-- Create pos_transactions table (additional to existing payments)
CREATE TABLE IF NOT EXISTS pos_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    terminal_id VARCHAR(100) NOT NULL,
    terminal_name VARCHAR(100),
    payment_provider VARCHAR(50) NOT NULL, -- 'square', 'clover', 'stripe', 'cash'
    transaction_type VARCHAR(20) NOT NULL, -- 'sale', 'refund', 'void', 'tip', 'adjustment'
    amount DECIMAL(10,2) NOT NULL,
    tip_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) GENERATED ALWAYS AS (amount + tip_amount + tax_amount) STORED,
    currency VARCHAR(3) DEFAULT 'USD',
    external_transaction_id VARCHAR(255),
    device_id VARCHAR(100),
    receipt_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'refunded'
    customer_id UUID REFERENCES customers(id),
    appointment_id UUID REFERENCES appointments(id),
    provider_id UUID REFERENCES providers(id),
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pos_terminals table
CREATE TABLE IF NOT EXISTS pos_terminals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL, -- 'square', 'clover'
    device_id VARCHAR(100) NOT NULL UNIQUE,
    location_id UUID REFERENCES locations(id),
    status VARCHAR(20) DEFAULT 'online', -- 'online', 'offline', 'maintenance'
    last_transaction_at TIMESTAMP WITH TIME ZONE,
    last_heartbeat TIMESTAMP WITH TIME ZONE,
    settings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- API KEYS
-- ============================================

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    key_prefix VARCHAR(20) NOT NULL, -- 'sk_live_', 'sk_test_'
    key_hash VARCHAR(255) NOT NULL,
    key_masked VARCHAR(50) NOT NULL,
    provider_id UUID REFERENCES customers(id), -- Optional: restrict to specific provider
    permissions TEXT[] DEFAULT '{}',
    rate_limit INTEGER DEFAULT 1000, -- requests per hour
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'revoked', 'expired'
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create api_usage_log table
CREATE TABLE IF NOT EXISTS api_usage_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id UUID REFERENCES api_keys(id),
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    ip_address INET,
    user_agent TEXT,
    request_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MULTI-LANGUAGE SUPPORT
-- ============================================

-- Add language columns to existing tables
ALTER TABLE locations ADD COLUMN IF NOT EXISTS default_language VARCHAR(10) DEFAULT 'en';
ALTER TABLE locations ADD COLUMN IF NOT EXISTS supported_languages TEXT[] DEFAULT ARRAY['en'];
ALTER TABLE customers ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(10) DEFAULT 'en';
ALTER TABLE providers ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(10) DEFAULT 'en';

-- Create translations table for app content
CREATE TABLE IF NOT EXISTS translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    translated_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(table_name, field_name, record_id, language_code)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_translations_lookup ON translations(table_name, field_name, record_id, language_code);

-- ============================================
-- ACCESSIBILITY SETTINGS
-- ============================================

-- Add accessibility columns to customers
ALTER TABLE customers ADD COLUMN IF NOT EXISTS accessibility_settings JSONB DEFAULT '{}';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS large_text_mode BOOLEAN DEFAULT false;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS high_contrast_mode BOOLEAN DEFAULT false;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS reduce_motion BOOLEAN DEFAULT false;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS screen_reader_enabled BOOLEAN DEFAULT false;

-- ============================================
-- REVIEWS & RATINGS
-- ============================================

-- Create reviews table if not exists
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id),
    provider_id UUID REFERENCES providers(id),
    appointment_id UUID REFERENCES appointments(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    content TEXT,
    is_public BOOLEAN DEFAULT true,
    status VARCHAR(20) DEFAULT 'published', -- 'pending', 'published', 'flagged', 'hidden'
    helpful_count INTEGER DEFAULT 0,
    response_content TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create review_helpful votes table
CREATE TABLE IF NOT EXISTS review_helpful (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID REFERENCES reviews(id),
    customer_id UUID REFERENCES customers(id),
    is_helpful BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(review_id, customer_id)
);

-- ============================================
-- CROSS-TRAINING SKILLS
-- ============================================

-- Create provider_skills table
CREATE TABLE IF NOT EXISTS provider_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES providers(id),
    skill_name VARCHAR(100) NOT NULL,
    category VARCHAR(50), -- 'hair', 'nails', 'spa', 'beauty', 'massage'
    proficiency_level VARCHAR(20) DEFAULT 'certified', -- 'learning', 'certified', 'expert'
    certified_at TIMESTAMP WITH TIME ZONE,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(provider_id, skill_name)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_loyalty_points_customer ON loyalty_points(customer_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON gift_cards(code);
CREATE INDEX IF NOT EXISTS idx_gift_cards_status ON gift_cards(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON marketing_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_pos_transactions_terminal ON pos_transactions(terminal_id);
CREATE INDEX IF NOT EXISTS idx_pos_transactions_created ON pos_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_api_keys_status ON api_keys(status);
CREATE INDEX IF NOT EXISTS idx_reviews_provider ON reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating DESC);
CREATE INDEX IF NOT EXISTS idx_provider_skills_provider ON provider_skills(provider_id);

-- ============================================
-- FOREIGN KEYS ADDED AS CONSTRAINTS
-- ============================================

ALTER TABLE loyalty_points 
    ADD CONSTRAINT fk_loyalty_points_customer 
    FOREIGN KEY (customer_id) REFERENCES customers(id);

ALTER TABLE loyalty_points 
    ADD CONSTRAINT fk_loyalty_points_provider 
    FOREIGN KEY (provider_id) REFERENCES providers(id);

ALTER TABLE gift_cards 
    ADD CONSTRAINT fk_gift_cards_purchaser 
    FOREIGN KEY (purchaser_id) REFERENCES customers(id);

ALTER TABLE pos_transactions 
    ADD CONSTRAINT fk_pos_transactions_customer 
    FOREIGN KEY (customer_id) REFERENCES customers(id);

ALTER TABLE reviews 
    ADD CONSTRAINT fk_reviews_customer 
    FOREIGN KEY (customer_id) REFERENCES customers(id);

ALTER TABLE reviews 
    ADD CONSTRAINT fk_reviews_provider 
    FOREIGN KEY (provider_id) REFERENCES providers(id);
