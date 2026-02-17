-- BarberBook Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table - stores user roles and basic info synced from Clerk
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT,
  role TEXT NOT NULL CHECK (role IN ('user', 'barber')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups by clerk_id
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (true);

-- Policy: Only authenticated service role can insert/update
-- (handled via service role key in API routes)

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
-- BARBER PROFILES (for barber-specific data)
-- ============================================
CREATE TABLE IF NOT EXISTS barber_profiles (
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

CREATE INDEX IF NOT EXISTS idx_barber_profiles_user_id ON barber_profiles(user_id);

ALTER TABLE barber_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Barber profiles are viewable by everyone"
  ON barber_profiles FOR SELECT
  USING (true);

DROP TRIGGER IF EXISTS update_barber_profiles_updated_at ON barber_profiles;
CREATE TRIGGER update_barber_profiles_updated_at
  BEFORE UPDATE ON barber_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
