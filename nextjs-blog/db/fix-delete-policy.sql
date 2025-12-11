-- ============================================
-- FIX: Actualizar política DELETE para verificar ban
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Eliminar la política existente
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;

-- Crear la política corregida (verifica que el usuario no esté baneado)
CREATE POLICY "Users can delete own posts"
ON posts FOR DELETE
USING (
  auth.uid() = author_id
  AND NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'banned'
  )
);

-- Verificar que la política se creó correctamente
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'posts' AND policyname = 'Users can delete own posts';

