-- ============================================
-- Row Level Security (RLS) Policies
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Habilitar RLS en las tablas
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS PARA PROFILES
-- ============================================

-- Todos pueden ver perfiles públicos
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Los admins pueden actualizar cualquier perfil (para cambiar roles)
CREATE POLICY "Admins can update any profile"
ON profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- POLÍTICAS PARA POSTS
-- ============================================

-- Todos pueden ver posts (lectura pública)
CREATE POLICY "Posts are viewable by everyone"
ON posts FOR SELECT
USING (true);

-- Usuarios autenticados (no baneados) pueden crear posts
CREATE POLICY "Authenticated users can create posts"
ON posts FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'banned'
  )
);

-- Usuarios pueden editar sus propios posts
CREATE POLICY "Users can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = author_id)
WITH CHECK (
  auth.uid() = author_id
  AND NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'banned'
  )
);

-- Admins pueden editar cualquier post
CREATE POLICY "Admins can update any post"
ON posts FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Usuarios pueden eliminar sus propios posts
CREATE POLICY "Users can delete own posts"
ON posts FOR DELETE
USING (auth.uid() = author_id);

-- Admins pueden eliminar cualquier post
CREATE POLICY "Admins can delete any post"
ON posts FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

