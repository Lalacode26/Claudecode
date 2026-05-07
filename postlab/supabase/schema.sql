-- PostLab — Supabase Schema
-- Chạy file này trong SQL Editor của Supabase project

CREATE TABLE IF NOT EXISTS posts (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title        TEXT        NOT NULL,
  caption      TEXT,
  hashtags     TEXT[],
  status       TEXT        NOT NULL DEFAULT 'idea'
                           CHECK (status IN ('idea', 'draft', 'ready', 'posted')),
  scheduled_at TIMESTAMPTZ,
  category     TEXT        NOT NULL DEFAULT 'tips'
                           CHECK (category IN ('tips', 'announcement', 'quote', 'testimonial', 'event', 'other')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security: mỗi user chỉ thấy data của mình
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_posts" ON posts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "insert_own_posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "delete_own_posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);
