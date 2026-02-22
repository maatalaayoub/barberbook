-- BarberBook Database Schema
-- Run this in your Supabase SQL Editor
-- Last updated: February 2026

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
-- Stores user roles and basic info synced from Clerk
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('user', 'business')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups by clerk_id
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
DROP POLICY IF EXISTS "Users can view own data" ON users;
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- BUSINESS PROFILE (for business-specific data)
-- ============================================
CREATE TABLE IF NOT EXISTS business_profile (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  bio TEXT,
  profile_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_business_profile_user_id ON business_profile(user_id);

ALTER TABLE business_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Business profiles are viewable by everyone" ON business_profile;
CREATE POLICY "Business profiles are viewable by everyone"
  ON business_profile FOR SELECT
  USING (true);

DROP TRIGGER IF EXISTS update_business_profile_updated_at ON business_profile;
CREATE TRIGGER update_business_profile_updated_at
  BEFORE UPDATE ON business_profile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- USER PROFILE (for normal users - customers)
-- ============================================
CREATE TABLE IF NOT EXISTS user_profile (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  phone TEXT,
  address TEXT,
  city TEXT,
  profile_image_url TEXT,
  preferred_language TEXT DEFAULT 'en',
  notification_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profile_user_id ON user_profile(user_id);

ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON user_profile;
CREATE POLICY "Users can view own profile"
  ON user_profile FOR SELECT
  USING (true);

DROP TRIGGER IF EXISTS update_user_profile_updated_at ON user_profile;
CREATE TRIGGER update_user_profile_updated_at
  BEFORE UPDATE ON user_profile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- BUSINESS INFO (base onboarding data - common to all business types)
-- ============================================
CREATE TABLE IF NOT EXISTS business_info (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  business_category TEXT NOT NULL CHECK (business_category IN ('salon_owner', 'mobile_service', 'job_seeker')),
  professional_type TEXT NOT NULL CHECK (professional_type IN ('barber', 'hairdresser', 'makeup', 'nails', 'massage')),
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_business_info_user_id ON business_info(user_id);
CREATE INDEX IF NOT EXISTS idx_business_info_category ON business_info(business_category);

ALTER TABLE business_info ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Business info viewable by everyone" ON business_info;
CREATE POLICY "Business info viewable by everyone"
  ON business_info FOR SELECT
  USING (true);

DROP TRIGGER IF EXISTS update_business_info_updated_at ON business_info;
CREATE TRIGGER update_business_info_updated_at
  BEFORE UPDATE ON business_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SHOP/SALON INFO (for salon_owner category)
-- ============================================
-- Physical location business owners
CREATE TABLE IF NOT EXISTS shop_salon_info (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_info_id UUID REFERENCES business_info(id) ON DELETE CASCADE UNIQUE,
  business_name TEXT,
  address TEXT,
  city TEXT,
  phone TEXT,
  work_location TEXT CHECK (work_location IN ('my_place', 'client_location', 'both')),
  business_hours JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- business_hours JSONB format example:
-- [
--   {"dayOfWeek": 0, "isOpen": false, "openTime": null, "closeTime": null},
--   {"dayOfWeek": 1, "isOpen": true, "openTime": "10:00", "closeTime": "19:00"},
--   ...
-- ]

CREATE INDEX IF NOT EXISTS idx_shop_salon_info_business_info_id ON shop_salon_info(business_info_id);

ALTER TABLE shop_salon_info ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Shop salon info viewable by everyone" ON shop_salon_info;
CREATE POLICY "Shop salon info viewable by everyone"
  ON shop_salon_info FOR SELECT
  USING (true);

DROP TRIGGER IF EXISTS update_shop_salon_info_updated_at ON shop_salon_info;
CREATE TRIGGER update_shop_salon_info_updated_at
  BEFORE UPDATE ON shop_salon_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- MOBILE SERVICE INFO (for mobile_service category)
-- ============================================
-- Mobile service providers who travel to clients
CREATE TABLE IF NOT EXISTS mobile_service_info (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_info_id UUID REFERENCES business_info(id) ON DELETE CASCADE UNIQUE,
  service_area TEXT,
  travel_radius_km INTEGER,
  work_location TEXT CHECK (work_location IN ('my_place', 'client_location', 'both')),
  business_hours JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mobile_service_info_business_info_id ON mobile_service_info(business_info_id);

ALTER TABLE mobile_service_info ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Mobile service info viewable by everyone" ON mobile_service_info;
CREATE POLICY "Mobile service info viewable by everyone"
  ON mobile_service_info FOR SELECT
  USING (true);

DROP TRIGGER IF EXISTS update_mobile_service_info_updated_at ON mobile_service_info;
CREATE TRIGGER update_mobile_service_info_updated_at
  BEFORE UPDATE ON mobile_service_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- JOB SEEKER INFO (for job_seeker category)
-- ============================================
-- Job seekers looking for employment
CREATE TABLE IF NOT EXISTS job_seeker_info (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_info_id UUID REFERENCES business_info(id) ON DELETE CASCADE UNIQUE,
  years_of_experience TEXT CHECK (years_of_experience IN ('less_than_1', '1_to_3', '3_to_5', '5_to_10', 'more_than_10')),
  has_certificate BOOLEAN DEFAULT false,
  preferred_city TEXT,
  resume_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_seeker_info_business_info_id ON job_seeker_info(business_info_id);

ALTER TABLE job_seeker_info ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Job seeker info viewable by everyone" ON job_seeker_info;
CREATE POLICY "Job seeker info viewable by everyone"
  ON job_seeker_info FOR SELECT
  USING (true);

DROP TRIGGER IF EXISTS update_job_seeker_info_updated_at ON job_seeker_info;
CREATE TRIGGER update_job_seeker_info_updated_at
  BEFORE UPDATE ON job_seeker_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- MIGRATION SCRIPT (run this if updating existing database)
-- ============================================
-- Uncomment and run these if you're updating an existing database:

-- -- Update role constraint from 'barber' to 'business'
-- ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
-- ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'business'));
-- UPDATE users SET role = 'business' WHERE role = 'barber';

-- -- Add first_name and last_name columns to users table
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name TEXT;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name TEXT;

-- ============================================
-- MIGRATION: From single business_info to separate tables
-- ============================================
-- If you have existing data in business_info with work_location, business_hours, etc.
-- Run these to migrate to the new structure:

-- -- Step 1: Create the new tables (already done if you ran the schema above)

-- -- Step 2: Migrate salon_owner data
-- INSERT INTO shop_salon_info (business_info_id, work_location, business_hours)
-- SELECT id, work_location, business_hours
-- FROM business_info
-- WHERE business_category = 'salon_owner';

-- -- Step 3: Migrate mobile_service data
-- INSERT INTO mobile_service_info (business_info_id, work_location, business_hours)
-- SELECT id, work_location, business_hours
-- FROM business_info
-- WHERE business_category = 'mobile_service';

-- -- Step 4: Migrate job_seeker data
-- INSERT INTO job_seeker_info (business_info_id, years_of_experience, has_certificate)
-- SELECT id, years_of_experience, has_certificate
-- FROM business_info
-- WHERE business_category = 'job_seeker';

-- -- Step 5: Drop old columns from business_info (optional - do after verifying migration)
-- ALTER TABLE business_info DROP COLUMN IF EXISTS work_location;
-- ALTER TABLE business_info DROP COLUMN IF EXISTS business_hours;
-- ALTER TABLE business_info DROP COLUMN IF EXISTS years_of_experience;
-- ALTER TABLE business_info DROP COLUMN IF EXISTS has_certificate;
