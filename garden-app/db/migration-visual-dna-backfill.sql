-- Allow filling visual_dna once when it is still NULL (legacy posts / failed after()).
-- Re-run is safe: CREATE OR REPLACE.

CREATE OR REPLACE FUNCTION public.protect_post_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF private.is_admin() THEN
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

-- Post legacy (id 3): ADN equivalente al fallback que ya pinta el jardin.
UPDATE public.posts
SET visual_dna = '{"type":"geometric","height":5,"complexity":5,"primaryColor":"#3ECF8E","secondaryColor":"#E8A87C","seed":873608664}'::jsonb
WHERE id = 3 AND visual_dna IS NULL;
