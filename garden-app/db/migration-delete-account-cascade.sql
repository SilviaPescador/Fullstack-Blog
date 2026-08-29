-- The Garden - explicit cascade on account deletion (29 ago 2026)
-- FKs already cascade: auth.users -> profiles -> posts -> waterings,
-- and waterings.user_id -> auth.users. This makes the RPC delete
-- posts/profile/waterings/storage explicitly so nothing is left behind.

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
  DELETE FROM public.posts WHERE author_id = uid;
  DELETE FROM public.profiles WHERE id = uid;
  DELETE FROM auth.users WHERE id = uid;
END;
$$;
