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
-- BUSINESS INFO (onboarding data)
-- ============================================
-- Stores business category, professional type, work location, business hours, and job seeker info
CREATE TABLE IF NOT EXISTS business_info (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  business_category TEXT CHECK (business_category IN ('shop_salon_owner', 'mobile_service', 'job_seeker')),
  professional_type TEXT NOT NULL CHECK (professional_type IN ('barber', 'hairdresser', 'stylist', 'colorist', 'other')),
  work_location TEXT CHECK (work_location IS NULL OR work_location IN ('my_place', 'client_location', 'both')),
  business_hours JSONB DEFAULT '[]'::jsonb,
  years_of_experience TEXT CHECK (years_of_experience IS NULL OR years_of_experience IN ('less_than_1', '1_to_3', '3_to_5', '5_to_10', 'more_than_10')),
  has_certificate BOOLEAN,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- business_hours JSONB format example:
-- [
--   {"dayOfWeek": 0, "isOpen": false, "openTime": null, "closeTime": null},
--   {"dayOfWeek": 1, "isOpen": true, "openTime": "10:00", "closeTime": "19:00"},
--   {"dayOfWeek": 2, "isOpen": true, "openTime": "10:00", "closeTime": "19:00"},
--   ...
-- ]

CREATE INDEX IF NOT EXISTS idx_business_info_user_id ON business_info(user_id);

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

-- -- Add business_category column if migrating from foreign key
-- ALTER TABLE business_info ADD COLUMN IF NOT EXISTS business_category TEXT;
-- ALTER TABLE business_info DROP CONSTRAINT IF EXISTS business_info_business_category_check;
-- ALTER TABLE business_info ADD CONSTRAINT business_info_business_category_check 
--   CHECK (business_category IS NULL OR business_category IN ('shop_salon_owner', 'mobile_service', 'job_seeker'));
-- ALTER TABLE business_info DROP COLUMN IF EXISTS business_category_id;

-- -- Fix work_location constraint (allow NULL for job seekers)
-- ALTER TABLE business_info DROP CONSTRAINT IF EXISTS barber_business_info_work_location_check;
-- ALTER TABLE business_info DROP CONSTRAINT IF EXISTS business_info_work_location_check;
-- ALTER TABLE business_info ALTER COLUMN work_location DROP NOT NULL;
-- ALTER TABLE business_info ADD CONSTRAINT business_info_work_location_check 
--   CHECK (work_location IS NULL OR work_location IN ('my_place', 'client_location', 'both'));

-- -- Add job seeker columns
-- ALTER TABLE business_info ADD COLUMN IF NOT EXISTS years_of_experience TEXT;
-- ALTER TABLE business_info ADD COLUMN IF NOT EXISTS has_certificate BOOLEAN;
-- ALTER TABLE business_info DROP CONSTRAINT IF EXISTS business_info_years_of_experience_check;
-- ALTER TABLE business_info ADD CONSTRAINT business_info_years_of_experience_check 
--   CHECK (years_of_experience IS NULL OR years_of_experience IN ('less_than_1', '1_to_3', '3_to_5', '5_to_10', 'more_than_10'));

-- -- Drop unused business_category lookup table
-- DROP TABLE IF EXISTS business_category CASCADE;
