-- Account deletion is done via Auth Admin API (service role), not SQL.
-- postgres cannot DELETE auth.users or storage.objects (owned by
-- supabase_auth_admin / supabase_storage_admin). The RPC below is unused.
-- Cascade still applies when Auth deletes the user:
--   auth.users -> profiles -> posts -> waterings
--   auth.users -> waterings.user_id

REVOKE ALL ON FUNCTION public.delete_own_account() FROM PUBLIC, anon, authenticated;
