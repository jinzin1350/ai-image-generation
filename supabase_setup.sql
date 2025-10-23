
-- ============================================
-- Complete Supabase Database Setup
-- ============================================

-- Step 1: Create Tables
-- ============================================

-- Create samples table
CREATE TABLE IF NOT EXISTS samples (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  before_image_url TEXT NOT NULL,
  after_image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create generated_images table
CREATE TABLE IF NOT EXISTS generated_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Enable Row Level Security
-- ============================================

ALTER TABLE samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;

-- Step 3: Create Storage Policies
-- ============================================

-- Allow authenticated users to read from storage
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;
CREATE POLICY "Allow authenticated reads"
ON storage.objects FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to upload samples
DROP POLICY IF EXISTS "Allow authenticated sample uploads" ON storage.objects;
CREATE POLICY "Allow authenticated sample uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'samples');

-- Allow authenticated users to upload generated images
DROP POLICY IF EXISTS "Allow user generated uploads" ON storage.objects;
CREATE POLICY "Allow user generated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'generated');

-- Step 4: Create Table Policies
-- ============================================

-- Samples table policies
DROP POLICY IF EXISTS "Allow authenticated reads on samples" ON samples;
CREATE POLICY "Allow authenticated reads on samples"
ON samples FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Allow authenticated inserts on samples" ON samples;
CREATE POLICY "Allow authenticated inserts on samples"
ON samples FOR INSERT
TO authenticated
WITH CHECK (true);

-- Generated images table policies
DROP POLICY IF EXISTS "Allow users to read their own images" ON generated_images;
CREATE POLICY "Allow users to read their own images"
ON generated_images FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Allow users to insert their own images" ON generated_images;
CREATE POLICY "Allow users to insert their own images"
ON generated_images FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================
-- Setup Complete!
-- 
-- Next Steps:
-- 1. در Supabase Dashboard → Storage، دو bucket ایجاد کنید:
--    - 'samples' (Public)
--    - 'generated' (Public)
--
-- 2. این SQL را در Supabase SQL Editor اجرا کنید
--
-- 3. متغیرهای محیطی را در .env تنظیم کنید:
--    - SUPABASE_URL
--    - SUPABASE_ANON_KEY
--    - GEMINI_API_KEY
-- ============================================
