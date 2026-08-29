-- Allow a user to remove their own watering. The unique (post_id, user_id)
-- still prevents double watering. water_count is only changed by triggers.

CREATE OR REPLACE FUNCTION public.decrement_water_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.posts
  SET water_count = GREATEST(0, water_count - 1)
  WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS on_watering_delete ON public.waterings;

CREATE TRIGGER on_watering_delete
AFTER DELETE ON public.waterings
FOR EACH ROW
EXECUTE FUNCTION public.decrement_water_count();

REVOKE ALL ON FUNCTION public.decrement_water_count() FROM PUBLIC, anon, authenticated;

GRANT DELETE ON TABLE public.waterings TO authenticated;

DROP POLICY IF EXISTS "Users can remove own watering" ON public.waterings;

CREATE POLICY "Users can remove own watering"
ON public.waterings FOR DELETE
TO authenticated
USING (
  user_id = (SELECT auth.uid())
  AND NOT private.is_banned()
);
