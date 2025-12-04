# 📋 Historial de Migración

Este documento detalla la migración del proyecto desde una arquitectura separada (Express + Next.js Pages Router) a una arquitectura fullstack integrada con Next.js App Router.

---

## 🔄 Resumen de la Migración

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Next.js** | 13 (Pages Router) | 16 (App Router) |
| **React** | 18 | 19 |
| **Backend** | Express separado (puerto 3001) | API Routes integradas |
| **Routing** | `pages/` directory | `app/` directory |
| **Peticiones HTTP** | Axios | Fetch API nativo |
| **Servidores** | 2 (frontend + backend) | 1 (fullstack) |
| **CORS** | Configuración necesaria | No necesario |

---

## 📂 Cambios en la Estructura

### Estructura Anterior (Express + Pages Router)

```
proyecto/
├── node-server/              # ❌ ELIMINADO
│   ├── controllers/
│   ├── routes/
│   ├── db/
│   └── public/images/
└── nextjs-blog/
    └── pages/                # ❌ ELIMINADO
        ├── _app.js
        ├── index.js
        └── posts/
            ├── [id].js
            └── create-new.js
```

### Estructura Actual (Next.js Fullstack)

```
nextjs-blog/
├── app/                      # ✅ NUEVO - App Router
│   ├── api/posts/            # API Routes (reemplaza Express)
│   │   ├── route.js          # GET all, POST
│   │   └── [id]/route.js     # GET one, PATCH, DELETE
│   ├── layout.js             # Layout raíz
│   ├── page.js               # Home (Server Component)
│   ├── HomeClient.js         # Home (Client Component)
│   └── posts/
│       ├── [id]/
│       │   ├── page.js
│       │   └── PostPageClient.js
│       └── create-new/page.js
├── lib/
│   └── db.js                 # ✅ NUEVO - Conexión MySQL
├── db/
│   └── next-blog-db.sql      # Esquema de base de datos
└── public/images/            # Imágenes (movidas desde node-server)
```

---

## 🔧 Cambios Técnicos Principales

### 1. API Routes (Reemplazo de Express)

**Antes** - Express con controladores:
```javascript
// node-server/routes/posts.js
router.get("/:id?", postController.getPosts);
router.post("/", upload.single("image"), postController.createPost);
```

**Después** - Route Handlers de Next.js:
```javascript
// app/api/posts/route.js
export async function GET() { ... }
export async function POST(request) { ... }
```

### 2. Conexión a Base de Datos

**Antes** - En servidor Express separado:
```javascript
// node-server/db/connection.js
const pool = mysql.createPool({ ... });
```

**Después** - Integrado en Next.js:
```javascript
// lib/db.js
import mysql from 'mysql2/promise';
const pool = mysql.createPool({ ... });
```

### 3. Componentes Client/Server

**Antes** - Todo renderizado del lado del cliente:
```javascript
// pages/index.js
export default function Home({ initialData }) {
  const { data } = useSWR("http://localhost:3001/posts", fetcher);
}
```

**Después** - Server Components + Client Components:
```javascript
// app/page.js (Server Component)
export default async function Home() {
  const posts = await getPosts(); // Directo a DB
  return <HomeClient initialPosts={posts} />;
}

// app/HomeClient.js (Client Component)
'use client';
export default function HomeClient({ initialPosts }) {
  const { data } = useSWR('/api/posts', fetcher);
}
```

### 4. Navegación

**Antes**:
```javascript
import { useRouter } from 'next/router';
```

**Después**:
```javascript
import { useRouter } from 'next/navigation';
```

### 5. Servicio de Posts

**Antes** - Llamadas a servidor externo con Axios:
```javascript
const API_URL = "http://localhost:3001/posts/";
const response = await axios.get(url);
```

**Después** - Llamadas internas con Fetch:
```javascript
const API_URL = '/api/posts';
const response = await fetch(url);
```

---

## ✅ Beneficios de la Migración

1. **Despliegue simplificado**: Un solo servidor en lugar de dos
2. **Sin configuración CORS**: Las API Routes son internas
3. **Mejor rendimiento**: Server Components para carga inicial
4. **Código más limpio**: Sin duplicación de lógica
5. **Variables de entorno centralizadas**: Un solo `.env.local`
6. **Mejor DX**: Hot reload más rápido, debugging integrado

---

## 📅 Fecha de Migración

**Diciembre 2024**

---

## 🔗 Referencias

- [Next.js App Router](https://nextjs.org/docs/app)
- [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

