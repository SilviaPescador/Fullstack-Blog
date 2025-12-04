# 🌸 Spelkit Blog

Blog personal fullstack desarrollado con **Next.js 16**, **Supabase** y desplegado en **Vercel**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)

🔗 **Demo en vivo**: [https://fullstack-blog-beta.vercel.app](https://fullstack-blog-beta.vercel.app)

---

## ✨ Funcionalidades

| Función | Descripción |
|---------|-------------|
| 📝 **CRUD Posts** | Crear, leer, editar y eliminar entradas |
| 🔐 **Autenticación** | Login con Email/Password y GitHub OAuth |
| 👥 **Sistema de roles** | Admin, Usuario registrado, Usuario baneado |
| 🖼️ **Imágenes en la nube** | Almacenamiento en Supabase Storage |
| 🎨 **Diseño responsive** | Bootstrap 5 + CSS modules |
| ⚡ **Server Components** | Carga inicial rápida con SSR |
| 🔄 **SWR** | Revalidación automática de datos |
| 📄 **Paginación** | Navegación entre páginas de posts |

---

## 🔐 Sistema de Permisos

| Rol | Ver posts | Crear | Editar propios | Editar todos | Eliminar propios | Eliminar todos | Gestionar usuarios |
|-----|-----------|-------|----------------|--------------|------------------|----------------|-------------------|
| **Visitante** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Usuario** | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Baneado** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 🚀 Desarrollo Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/SilviaPescador/Fullstack-Blog.git
cd Fullstack-Blog/nextjs-blog
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea el archivo `nextjs-blog/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

> Obtén estas variables en [Supabase](https://app.supabase.com) → Settings → API

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Estructura del Proyecto

```
nextjs-blog/
├── app/                    # App Router (Next.js 16)
│   ├── api/posts/          # API Routes (backend integrado)
│   ├── (auth)/             # Páginas de autenticación
│   ├── admin/              # Panel de administración
│   ├── posts/              # Páginas de posts
│   └── page.js             # Home
├── components/             # Componentes React
├── hooks/                  # Custom hooks (useAuth)
├── lib/supabase/           # Clientes de Supabase
├── db/                     # Scripts SQL
├── services/               # Servicios API
└── styles/                 # Estilos CSS
```

---

## 🛠️ Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Frontend** | React 19, Bootstrap 5 |
| **Backend** | API Routes de Next.js |
| **Base de datos** | Supabase (PostgreSQL) |
| **Autenticación** | Supabase Auth (Email, GitHub) |
| **Almacenamiento** | Supabase Storage |
| **Hosting** | Vercel |
| **Librerías** | SWR, react-hook-form, react-dropzone, sweetalert2 |

---

## 🚢 Despliegue

El proyecto está configurado para **despliegue automático** con Vercel:

1. Cada `git push` a `main` dispara un nuevo deploy
2. Vercel detecta Next.js automáticamente
3. Las variables de entorno se configuran en el dashboard de Vercel

### Variables de entorno en Vercel

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

---

## 📖 Documentación Adicional

- [Historial de Migración](./docs/MIGRATION.md) - Detalles de la migración desde Express + MySQL

---

## 🗺️ Roadmap

- [x] Migración a Supabase
- [x] Autenticación con GitHub
- [x] Sistema de roles y permisos
- [x] Imágenes en la nube
- [x] Despliegue en Vercel
- [ ] Autenticación con Google
- [ ] Comentarios en posts
- [ ] Búsqueda de posts
- [ ] Editor de texto enriquecido

---

## 👩‍💻 Autora

**Silvia Pescador** - [@SilviaPescador](https://github.com/SilviaPescador)

---

<p align="center">
  <sub>Desarrollado con 💜 usando Next.js + Supabase</sub>
</p>
