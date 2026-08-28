-- The Garden - self-service account deletion (29 ago 2026)
-- Apply in production. Lets an authenticated user erase their account,
-- posts (via profiles CASCADE) and post images.

ALTER TABLE public.waterings DROP CONSTRAINT IF EXISTS waterings_user_id_fkey;
ALTER TABLE public.waterings
  ADD CONSTRAINT waterings_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE OR REPLACE FUNCTION private.delete_own_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  uid uuid := (SELECT auth.uid());
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated' USING ERRCODE = '42501';
  END IF;

  DELETE FROM storage.objects
  WHERE bucket_id = 'post-images'
    AND name LIKE uid::text || '/%';

  DELETE FROM public.waterings WHERE user_id = uid;
  DELETE FROM auth.users WHERE id = uid;
END;
$$;

REVOKE ALL ON FUNCTION private.delete_own_account() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.delete_own_account() TO authenticated;

CREATE OR REPLACE FUNCTION public.delete_own_account()
RETURNS void
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT private.delete_own_account();
$$;

REVOKE ALL ON FUNCTION public.delete_own_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_own_account() TO authenticated;
