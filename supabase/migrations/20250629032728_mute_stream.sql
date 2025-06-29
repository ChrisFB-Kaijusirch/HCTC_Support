/*
  # Content Management System Tables

  1. New Tables
    - `recent_updates`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `type` (text) - update, maintenance, content, feature
      - `date` (text) - display date like "2 days ago"
      - `is_active` (boolean)
      - `created_by` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `popular_topics`
      - `id` (uuid, primary key)
      - `title` (text)
      - `article_id` (text) - references knowledge base articles
      - `views` (integer)
      - `is_active` (boolean)
      - `order` (integer) - display order
      - `created_by` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Enhanced Knowledge Base
    - Add `app_name` column to knowledge_base table
    - Add indexes for better performance

  3. Security
    - Enable RLS on all new tables
    - Add policies for admin access
*/

-- Create recent_updates table
CREATE TABLE IF NOT EXISTS recent_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('update', 'maintenance', 'content', 'feature')),
  date text NOT NULL,
  is_active boolean DEFAULT true,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create popular_topics table
CREATE TABLE IF NOT EXISTS popular_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  article_id text NOT NULL,
  views integer DEFAULT 0,
  is_active boolean DEFAULT true,
  "order" integer DEFAULT 1,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add app_name column to knowledge_base if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'knowledge_base' AND column_name = 'app_name'
  ) THEN
    ALTER TABLE knowledge_base ADD COLUMN app_name text DEFAULT 'General';
  END IF;
END $$;

-- Enable RLS
ALTER TABLE recent_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE popular_topics ENABLE ROW LEVEL SECURITY;

-- Create policies for recent_updates
CREATE POLICY "Admin can manage recent updates"
  ON recent_updates
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for popular_topics
CREATE POLICY "Admin can manage popular topics"
  ON popular_topics
  FOR ALL
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recent_updates_active ON recent_updates(is_active);
CREATE INDEX IF NOT EXISTS idx_recent_updates_created_at ON recent_updates(created_at);
CREATE INDEX IF NOT EXISTS idx_popular_topics_active ON popular_topics(is_active);
CREATE INDEX IF NOT EXISTS idx_popular_topics_order ON popular_topics("order");
CREATE INDEX IF NOT EXISTS idx_knowledge_base_app_name ON knowledge_base(app_name);

-- Insert sample data for recent_updates
INSERT INTO recent_updates (title, description, type, date, created_by) VALUES
('Portfolio Manager v2.1.0 Released', 'New features include advanced analytics and improved performance', 'update', '2 days ago', 'admin'),
('Scheduled Maintenance - Analytics Dashboard', 'Brief maintenance window scheduled for this weekend', 'maintenance', '1 week ago', 'admin'),
('New Knowledge Base Articles Added', 'Added comprehensive guides for new users', 'content', '2 weeks ago', 'admin')
ON CONFLICT DO NOTHING;

-- Insert sample data for popular_topics
INSERT INTO popular_topics (title, article_id, views, "order", created_by) VALUES
('How to Reset Your Password', '1', 245, 1, 'admin'),
('Adding New Assets to Portfolio', '2', 189, 2, 'admin'),
('Understanding Analytics Reports', '3', 156, 3, 'admin')
ON CONFLICT DO NOTHING;