# 🌸 Spelkit Blog

Blog personal fullstack desarrollado con **Next.js 16** y **MySQL**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)

---

## 🚀 Inicio Rápido

### 1. Configurar Base de Datos

```bash
# Importa el esquema SQL en MySQL
mysql -u root -p < nextjs-blog/db/next-blog-db.sql
```

### 2. Configurar Variables de Entorno

Crea el archivo `nextjs-blog/.env.local`:

```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=next-blog-db
DB_CHARSET=utf8mb4
```

### 3. Instalar y Ejecutar

```bash
cd nextjs-blog
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Estructura del Proyecto

```
nextjs-blog/
├── app/                    # App Router (Next.js 16)
│   ├── api/posts/          # API Routes (backend integrado)
│   ├── posts/              # Páginas de posts
│   └── page.js             # Home
├── components/             # Componentes React
├── db/                     # Esquema SQL
├── lib/                    # Utilidades (conexión DB)
├── public/images/          # Imágenes de posts
├── services/               # Servicios API
└── styles/                 # Estilos CSS
```

---

## ✨ Funcionalidades

| Función | Descripción |
|---------|-------------|
| 📝 **CRUD Posts** | Crear, leer, editar y eliminar entradas |
| 🖼️ **Subida de imágenes** | Drag & drop con react-dropzone |
| 🎨 **Diseño responsive** | Bootstrap 5 + CSS modules |
| ⚡ **Server Components** | Carga inicial rápida con SSR |
| 🔄 **SWR** | Revalidación automática de datos |

---

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **Frontend**: React 19, Bootstrap 5
- **Backend**: API Routes de Next.js
- **Base de datos**: MySQL con mysql2
- **Librerías**: SWR, react-hook-form, react-dropzone, sweetalert2

---

## 📖 Documentación Adicional

- [Historial de Migración](./docs/MIGRATION.md) - Detalles de la migración desde Express

---

## 👩‍💻 Autora

**Silvia Pescador** - [@spelkit](https://github.com/spelkit)

---

<p align="center">
  <sub>Desarrollado con 💜 usando Next.js</sub>
</p>
