# 📋 Historial de Migración

Este documento detalla las migraciones del proyecto desde su arquitectura inicial hasta la actual.

---

## 🔄 Resumen de Migraciones

### Migración 1: Express → Next.js App Router (Diciembre 2024)

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Next.js** | 13 (Pages Router) | 16 (App Router) |
| **React** | 18 | 19 |
| **Backend** | Express separado (puerto 3001) | API Routes integradas |
| **Routing** | `pages/` directory | `app/` directory |
| **Peticiones HTTP** | Axios | Fetch API nativo |
| **Servidores** | 2 (frontend + backend) | 1 (fullstack) |

### Migración 2: MySQL → Supabase (Diciembre 2024)

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Base de datos** | MySQL local | Supabase (PostgreSQL cloud) |
| **Autenticación** | Ninguna | Supabase Auth (Email, GitHub) |
| **Almacenamiento** | `/public/images/` local | Supabase Storage (cloud) |
| **Hosting** | Local | Vercel |
| **Seguridad** | Ninguna | RLS (Row Level Security) |

### Migración 3: Internacionalización + pnpm (Diciembre 2024)

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Gestor de paquetes** | npm | pnpm |
| **Idiomas** | Solo español (hardcoded) | ES/EN con next-intl |
| **Textos** | Strings en componentes | Archivos JSON centralizados |
| **Selector de idioma** | No existía | LocaleSwitcher en navbar |
| **Persistencia** | N/A | Cookie `NEXT_LOCALE` |

---

## 📂 Evolución de la Estructura

### Fase 1: Express + Pages Router (Original)

```
proyecto/
├── node-server/              # ❌ ELIMINADO
│   ├── controllers/
│   ├── routes/
│   ├── db/
│   └── public/images/
└── garden-app/
    └── pages/                # ❌ ELIMINADO
        ├── _app.js
        ├── index.js
        └── posts/
```

### Fase 2: Next.js Fullstack + MySQL (Intermedia)

```
garden-app/
├── app/                      # App Router
│   ├── api/posts/            # API Routes
│   └── posts/
├── lib/
│   └── db.js                 # Conexión MySQL
└── public/images/            # Imágenes locales
```

### Fase 3: Next.js + Supabase + Vercel

```
garden-app/
├── app/
│   ├── api/posts/            # API Routes con Supabase
│   ├── (auth)/               # ✅ NUEVO - Páginas de auth
│   │   ├── login/
│   │   ├── register/
│   │   └── banned/
│   ├── auth/callback/        # ✅ NUEVO - OAuth callback
│   ├── admin/users/          # ✅ NUEVO - Panel admin
│   └── posts/
├── hooks/
│   └── useAuth.js            # ✅ NUEVO - Hook de autenticación
├── lib/supabase/             # ✅ NUEVO - Clientes Supabase
│   ├── client.js             # Cliente para browser
│   ├── server.js             # Cliente para server
│   └── middleware.js         # Middleware de sesión
├── middleware.js             # ✅ NUEVO - Protección de rutas
└── db/
    ├── schema.sql            # Esquema PostgreSQL
    ├── rls-policies.sql      # Políticas de seguridad
    └── seed-posts.sql        # Datos iniciales
```

### Fase 4: Internacionalización con next-intl (Actual)

```
garden-app/
├── app/
│   └── layout.js             # 🔄 MODIFICADO - NextIntlClientProvider
├── components/
│   ├── layout.js             # 🔄 MODIFICADO - useTranslations + LocaleSwitcher
│   ├── LocaleSwitcher.js     # ✅ NUEVO - Selector de idioma
│   └── ...                   # 🔄 MODIFICADOS - Todos usan useTranslations
├── i18n/                     # ✅ NUEVO - Configuración i18n
│   ├── config.js             # Idiomas soportados
│   └── request.js            # Configuración de next-intl
├── messages/                 # ✅ NUEVO - Archivos de traducciones
│   ├── es.json               # Español (por defecto)
│   └── en.json               # Inglés
├── next.config.js            # 🔄 MODIFICADO - withNextIntl plugin
└── pnpm-lock.yaml            # 🔄 NUEVO - Reemplaza package-lock.json
```

---

## 🔧 Cambios Técnicos Principales

### 1. Base de Datos: MySQL → PostgreSQL (Supabase)

**Antes** - MySQL local:
```javascript
// lib/db.js
import mysql from 'mysql2/promise';
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
```

**Después** - Supabase:
```javascript
// lib/supabase/server.js
import { createServerClient } from '@supabase/ssr';
export async function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { ... } }
  );
}
```

### 2. Autenticación

**Antes** - Sin autenticación:
```javascript
// Cualquiera podía crear/editar/eliminar posts
```

**Después** - Supabase Auth:
```javascript
// API Route protegida
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
}
```

### 3. Almacenamiento de Imágenes

**Antes** - Sistema de archivos local:
```javascript
import { writeFile } from 'fs/promises';
const imagePath = path.join(process.cwd(), 'public/images', fileName);
await writeFile(imagePath, buffer);
```

**Después** - Supabase Storage:
```javascript
const { data } = await supabase.storage
  .from('post-images')
  .upload(fileName, image);
const { data: { publicUrl } } = supabase.storage
  .from('post-images')
  .getPublicUrl(data.path);
```

### 4. Sistema de Roles y Permisos

**Nuevo** - Row Level Security (RLS):
```sql
-- Solo el autor o admin puede editar
CREATE POLICY "Users can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = author_id);

CREATE POLICY "Admins can update any post"
ON posts FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### 5. Middleware de Protección

**Nuevo** - Middleware para rutas protegidas:
```javascript
// middleware.js
export async function middleware(request) {
  const { user } = await supabase.auth.getUser();
  
  if (isProtectedRoute && !user) {
    return NextResponse.redirect('/login');
  }
  
  if (user?.role === 'banned') {
    return NextResponse.redirect('/banned');
  }
}
```

### 6. Sistema de Internacionalización (next-intl)

**Configuración** - `i18n/config.js`:
```javascript
export const locales = ['es', 'en'];
export const defaultLocale = 'es';

export const localeNames = {
  es: 'Español',
  en: 'English',
};
```

**Uso en componentes**:
```javascript
'use client';
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('namespace');
  
  return <h1>{t('title')}</h1>;
}
```

**Estructura de traducciones** - `messages/es.json`:
```json
{
  "namespace": {
    "title": "Mi Título"
  }
}
```

### 7. Migración de npm a pnpm

**Motivo**: pnpm es más rápido y eficiente en uso de disco.

**Comandos actualizados**:
```bash
# Antes (npm)
npm install
npm run dev

# Ahora (pnpm)
pnpm install
pnpm dev
```

---

## ✅ Beneficios de las Migraciones

### Migración 1 (Express → Next.js)
- ✅ Despliegue simplificado: Un solo servidor
- ✅ Sin configuración CORS
- ✅ Mejor rendimiento con Server Components
- ✅ Hot reload más rápido

### Migración 2 (MySQL → Supabase)
- ✅ Base de datos en la nube (sin configuración local)
- ✅ Autenticación lista para usar (Email, OAuth)
- ✅ Almacenamiento de archivos en la nube
- ✅ Seguridad con RLS a nivel de base de datos
- ✅ Despliegue automático con Vercel
- ✅ Escalabilidad automática

### Migración 3 (Internacionalización + pnpm)
- ✅ Soporte multiidioma (Español/Inglés)
- ✅ Textos centralizados en archivos JSON
- ✅ Fácil añadir nuevos idiomas
- ✅ Selector de idioma en la interfaz
- ✅ Persistencia de preferencia de idioma
- ✅ Instalación de dependencias más rápida con pnpm
- ✅ Menor uso de espacio en disco

---

## URLs del Proyecto

| Entorno | URL |
|---------|-----|
| **Produccion** | https://fullstack-blog-beta.vercel.app |
| **Supabase** | Ver dashboard en tu cuenta de Supabase |
| **Vercel** | https://vercel.com/dashboard |
| **GitHub** | https://github.com/SilviaPescador/the-garden |

---

## 📅 Cronología

| Fecha | Evento |
|-------|--------|
| Junio 2023 | Versión inicial (Express + Next.js Pages Router) |
| Diciembre 2024 | Migración a Next.js 16 App Router |
| Diciembre 2024 | Migración a Supabase + Vercel |
| Diciembre 2024 | Internacionalización (next-intl) + pnpm |

---

## 🔗 Referencias

- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Vercel Deployment](https://vercel.com/docs)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [pnpm Documentation](https://pnpm.io/)
