-- Schema for Memorial Site Database
-- הרץ את הקובץ הזה ב-Supabase SQL Editor

-- Create soldiers table
CREATE TABLE IF NOT EXISTS soldiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  date_of_death DATE NOT NULL,
  story TEXT,
  profile_image TEXT,
  gallery_images TEXT[], -- Array of image URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create memories table
CREATE TABLE IF NOT EXISTS memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  soldier_id UUID REFERENCES soldiers(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  text TEXT NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_id UUID -- Will reference admin users table in future
);

-- Create admin_users table for admin authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_soldiers_slug ON soldiers(slug);
CREATE INDEX IF NOT EXISTS idx_memories_soldier_id ON memories(soldier_id);
CREATE INDEX IF NOT EXISTS idx_memories_status ON memories(status);
CREATE INDEX IF NOT EXISTS idx_soldiers_name ON soldiers USING gin(to_tsvector('hebrew', name));

-- Enable Row Level Security (RLS)
ALTER TABLE soldiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policies for soldiers table (public read access)
CREATE POLICY "Soldiers are viewable by everyone" ON soldiers
  FOR SELECT USING (true);

-- Policies for memories table
-- Anyone can read approved memories
CREATE POLICY "Approved memories are viewable by everyone" ON memories
  FOR SELECT USING (status = 'approved');

-- Anyone can insert new memories (they will be pending)
CREATE POLICY "Anyone can insert memories" ON memories
  FOR INSERT WITH CHECK (true);

-- Admin users can update memories (approve/reject)
-- Note: This will be handled server-side with service role key for now
CREATE POLICY "Admins can update memories" ON memories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() AND admin_users.is_admin = true
    )
  );

-- Policies for admin_users table
CREATE POLICY "Admin users are viewable by admins only" ON admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() AND admin_users.is_admin = true
    )
  );

-- Create storage bucket for images
-- Note: Run this in Supabase Dashboard > Storage after creating the tables
-- The bucket name should be 'soldiers-images'
-- Make it public for reading, but only service role can write

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_soldiers_updated_at BEFORE UPDATE ON soldiers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

