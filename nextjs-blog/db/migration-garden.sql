-- ============================================
-- Our Garden - Database Migration
-- Run in Supabase SQL Editor
-- ============================================

-- 1. Add new columns to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' NOT NULL;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS ai_summary TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS ai_tags TEXT[];
ALTER TABLE posts ADD COLUMN IF NOT EXISTS visual_dna JSONB;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS water_count INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- 2. Set existing posts as approved
UPDATE posts SET status = 'approved', approved_at = created_at
WHERE approved_at IS NULL;

-- 3. Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts (status);

-- 4. Create waterings table
--    post_id is BIGINT to match posts.id type
CREATE TABLE IF NOT EXISTS waterings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- 5. Enable RLS on waterings
ALTER TABLE waterings ENABLE ROW LEVEL SECURITY;

-- Waterings: anyone can read
CREATE POLICY "Waterings are viewable by everyone"
ON waterings FOR SELECT
USING (true);

-- Waterings: authenticated users can water (insert)
CREATE POLICY "Authenticated users can water posts"
ON waterings FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND auth.uid() = user_id
  AND NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'banned'
  )
);

-- 6. Update posts SELECT policy: public sees only approved,
--    admin and author see all statuses
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON posts;

CREATE POLICY "Approved posts are public"
ON posts FOR SELECT
USING (
  status = 'approved'
  OR auth.uid() = author_id
  OR EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 7. Create function to increment water_count
CREATE OR REPLACE FUNCTION increment_water_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET water_count = water_count + 1 WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Trigger on watering insert
DROP TRIGGER IF EXISTS on_watering_insert ON waterings;
CREATE TRIGGER on_watering_insert
AFTER INSERT ON waterings
FOR EACH ROW
EXECUTE FUNCTION increment_water_count();

-- 9. Enable Realtime for posts table (for garden live updates)
ALTER PUBLICATION supabase_realtime ADD TABLE posts;

-- ============================================
-- Verify migration
-- ============================================
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'posts'
ORDER BY ordinal_position;
