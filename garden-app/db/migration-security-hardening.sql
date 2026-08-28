-- The Garden - security hardening (28 ago 2026)
-- Apply in production. Idempotent drops + recreate.

CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (SELECT auth.uid()) AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_admin() TO anon, authenticated;

CREATE OR REPLACE FUNCTION private.is_banned()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (SELECT auth.uid()) AND role = 'banned'
  );
$$;

REVOKE ALL ON FUNCTION private.is_banned() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_banned() TO authenticated;

GRANT USAGE ON SCHEMA private TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_water_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.posts SET water_count = water_count + 1 WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.normalize_post_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT private.is_admin() THEN
    NEW.author_id := (SELECT auth.uid());
    NEW.status := 'pending';
    NEW.water_count := 0;
    NEW.visual_dna := NULL;
    NEW.ai_summary := NULL;
    NEW.ai_tags := NULL;
    NEW.approved_at := NULL;
    NEW.rejection_reason := NULL;
    NEW.reviewed_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.protect_post_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Dashboard SQL editor / service role no traen auth.uid(); no bloquear esos updates.
  IF private.is_admin() OR (SELECT auth.uid()) IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.water_count IS DISTINCT FROM OLD.water_count
     AND NEW.title IS NOT DISTINCT FROM OLD.title
     AND NEW.content IS NOT DISTINCT FROM OLD.content
     AND NEW.image_url IS NOT DISTINCT FROM OLD.image_url
     AND NEW.status IS NOT DISTINCT FROM OLD.status
     AND NEW.author_id IS NOT DISTINCT FROM OLD.author_id
     AND NEW.visual_dna IS NOT DISTINCT FROM OLD.visual_dna
     AND NEW.ai_summary IS NOT DISTINCT FROM OLD.ai_summary
     AND NEW.ai_tags IS NOT DISTINCT FROM OLD.ai_tags
     AND NEW.approved_at IS NOT DISTINCT FROM OLD.approved_at
     AND NEW.rejection_reason IS NOT DISTINCT FROM OLD.rejection_reason
     AND NEW.reviewed_at IS NOT DISTINCT FROM OLD.reviewed_at
  THEN
    RETURN NEW;
  END IF;

  IF OLD.status = 'pending'
     AND NEW.status = 'reviewed_by_ai'
     AND NEW.author_id IS NOT DISTINCT FROM OLD.author_id
     AND (SELECT auth.uid()) = OLD.author_id
  THEN
    NEW.water_count := OLD.water_count;
    NEW.author_id := OLD.author_id;
    NEW.approved_at := OLD.approved_at;
    RETURN NEW;
  END IF;

  -- Posts legacy o moderacion fallida: se puede escribir visual_dna una vez
  IF OLD.visual_dna IS NULL
     AND NEW.visual_dna IS NOT NULL
     AND NEW.author_id IS NOT DISTINCT FROM OLD.author_id
  THEN
    NEW.status := OLD.status;
    NEW.water_count := OLD.water_count;
    NEW.author_id := OLD.author_id;
    NEW.approved_at := OLD.approved_at;
    NEW.rejection_reason := OLD.rejection_reason;
    RETURN NEW;
  END IF;

  NEW.status := OLD.status;
  NEW.water_count := OLD.water_count;
  NEW.visual_dna := OLD.visual_dna;
  NEW.author_id := OLD.author_id;
  NEW.ai_summary := OLD.ai_summary;
  NEW.ai_tags := OLD.ai_tags;
  NEW.approved_at := OLD.approved_at;
  NEW.rejection_reason := OLD.rejection_reason;
  NEW.reviewed_at := OLD.reviewed_at;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.protect_profile_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.id := OLD.id;
  IF NOT private.is_admin() THEN
    NEW.role := OLD.role;
    NEW.email := OLD.email;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_normalize_post_insert ON public.posts;
CREATE TRIGGER trg_normalize_post_insert
BEFORE INSERT ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.normalize_post_insert();

DROP TRIGGER IF EXISTS trg_protect_post_columns ON public.posts;
CREATE TRIGGER trg_protect_post_columns
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.protect_post_columns();

DROP TRIGGER IF EXISTS trg_protect_profile_columns ON public.profiles;
CREATE TRIGGER trg_protect_profile_columns
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_columns();

ALTER TABLE public.posts ALTER COLUMN status SET DEFAULT 'pending';

-- ---------------------------------------------------------------------------
-- Privileges
-- ---------------------------------------------------------------------------

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.increment_water_count() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.normalize_post_insert() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.protect_post_columns() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.protect_profile_columns() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON TABLE public.posts FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.profiles FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.waterings FROM PUBLIC, anon, authenticated;

GRANT SELECT ON TABLE public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.posts TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.posts_id_seq TO authenticated;

GRANT SELECT (id, full_name, avatar_url, role, created_at, updated_at)
  ON public.profiles TO anon, authenticated;
GRANT UPDATE (full_name, avatar_url, role, updated_at)
  ON public.profiles TO authenticated;
REVOKE SELECT (email) ON public.profiles FROM anon, authenticated;

GRANT SELECT ON TABLE public.waterings TO anon;
GRANT SELECT, INSERT ON TABLE public.waterings TO authenticated;

-- ---------------------------------------------------------------------------
-- RLS policies (drop leftovers, recreate)
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
DROP POLICY IF EXISTS "Approved posts are public" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can update any post" ON public.posts;
DROP POLICY IF EXISTS "Users can update own posts, admins can update all" ON public.posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can delete any post" ON public.posts;
DROP POLICY IF EXISTS "Users can delete own posts, admins can delete all" ON public.posts;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

DROP POLICY IF EXISTS "Waterings are viewable by everyone" ON public.waterings;
DROP POLICY IF EXISTS "Authenticated users can water posts" ON public.waterings;

CREATE POLICY "Approved posts are public"
ON public.posts FOR SELECT
USING (
  status = 'approved'
  OR author_id = (SELECT auth.uid())
  OR private.is_admin()
);

CREATE POLICY "Authenticated users can create posts"
ON public.posts FOR INSERT
TO authenticated
WITH CHECK (
  author_id = (SELECT auth.uid())
  AND NOT private.is_banned()
);

CREATE POLICY "Users can update own posts"
ON public.posts FOR UPDATE
TO authenticated
USING (
  author_id = (SELECT auth.uid())
  AND NOT private.is_banned()
)
WITH CHECK (
  author_id = (SELECT auth.uid())
  AND NOT private.is_banned()
);

CREATE POLICY "Admins can update any post"
ON public.posts FOR UPDATE
TO authenticated
USING (private.is_admin())
WITH CHECK (private.is_admin());

CREATE POLICY "Users can delete own posts"
ON public.posts FOR DELETE
TO authenticated
USING (
  author_id = (SELECT auth.uid())
  AND NOT private.is_banned()
);

CREATE POLICY "Admins can delete any post"
ON public.posts FOR DELETE
TO authenticated
USING (private.is_admin());

CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = (SELECT auth.uid()))
WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (private.is_admin())
WITH CHECK (private.is_admin());

CREATE POLICY "Waterings are viewable by everyone"
ON public.waterings FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can water posts"
ON public.waterings FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT auth.uid()) IS NOT NULL
  AND user_id = (SELECT auth.uid())
  AND NOT private.is_banned()
);

-- ---------------------------------------------------------------------------
-- Admin-only email access
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.admin_list_profiles()
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  avatar_url text,
  role text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT private.is_admin() THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY
  SELECT p.id, p.email, p.full_name, p.avatar_url, p.role, p.created_at, p.updated_at
  FROM public.profiles p
  ORDER BY p.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_profile_email(target_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  result text;
BEGIN
  IF NOT private.is_admin() THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;
  SELECT p.email INTO result FROM public.profiles p WHERE p.id = target_id;
  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_list_profiles() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_profile_email(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_profiles() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_profile_email(uuid) TO authenticated;

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Authenticated users can upload 1hys5dx_0" ON storage.objects;
DROP POLICY IF EXISTS "Public read access 1hys5dx_0" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images 1hys5dx_0" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images 1hys5dx_1" ON storage.objects;
DROP POLICY IF EXISTS "Users upload own post images" ON storage.objects;
DROP POLICY IF EXISTS "Public read post images" ON storage.objects;
DROP POLICY IF EXISTS "Users update own post images" ON storage.objects;
DROP POLICY IF EXISTS "Users delete own post images" ON storage.objects;

CREATE POLICY "Public read post images"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-images');

CREATE POLICY "Users upload own post images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'post-images'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

CREATE POLICY "Users update own post images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'post-images'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
)
WITH CHECK (
  bucket_id = 'post-images'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

CREATE POLICY "Users delete own post images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'post-images'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

UPDATE storage.buckets
SET
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
WHERE id = 'post-images';
