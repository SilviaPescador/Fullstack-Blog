# Our Garden

Plataforma de escritura colectiva con moderacion asistida por IA. Cada post aprobado genera una planta unica en un jardin interactivo SVG, basada en el analisis semantico del contenido.

**Stack**: Next.js 16 - Supabase - Claude API - GSAP - Resend - Vercel

**Demo**: [https://fullstack-blog-beta.vercel.app](https://fullstack-blog-beta.vercel.app)

---

## Concepto

No es un blog. Es un espacio vivo que crece con la comunidad. Cuando un post es aprobado, una planta procedural nace en el jardin de la home -- su forma, color y tipo dependen del contenido del post, analizado por IA.

- **Posts tecnicos** generan plantas geometricas (circuitos, nodos angulares)
- **Posts reflexivos** generan plantas organicas (curvas, hojas naturales)
- **Posts creativos** generan plantas con flores (petalos, color rico)
- **Posts educativos** generan cristales (facetados, estructurados)

Los usuarios pueden "regar" posts que les gusten, haciendo crecer sus plantas.

---

## Funcionalidades

| Funcion | Descripcion |
|---------|-------------|
| Jardin SVG interactivo | Canvas procedural en la home con GSAP animations |
| Moderacion IA | Claude analiza, resume, clasifica y genera el ADN visual |
| Realtime | El jardin se actualiza en vivo al aprobar posts (Supabase Realtime) |
| Sistema de riego | Reacciones unicas que hacen crecer las plantas |
| Particulas flotantes | Fondo animado con particulas tipo firefly (portado del portfolio) |
| Cursor glow | Resplandor que sigue al raton con gradiente radial |
| Dark/Light mode | Design system unificado con portfolio (CSS custom properties) |
| Auth completa | Email, Google, GitHub OAuth con Supabase Auth |
| Roles | Admin, Usuario, Baneado con RLS en PostgreSQL |
| i18n | Espanol e Ingles (next-intl) |
| Panel admin | Cola de moderacion con preview de plantas y aprobacion en un click |
| Notificaciones | Email al autor cuando su post es aprobado (Resend) |
| Seguridad | Input sanitization, CSP headers, rate limit prep, open redirect protection |

---

## Arquitectura

```
Usuario crea post
    -> status: pending
    -> API /moderate -> Claude API
    -> Claude genera: summary, tags, visual DNA, spam/toxicity score
    -> status: reviewed_by_ai

Admin aprueba
    -> status: approved
    -> Supabase Realtime broadcast
    -> Jardin muestra nueva planta con animacion de nacimiento
    -> Email al autor via Resend
```

---

## Seguridad

- Input sanitization (titulo, contenido, imagenes) con limites de longitud y tipo
- Validacion de IDs en todas las API routes (UUID y bigint)
- RLS en PostgreSQL: posts pendientes solo visibles para admin/autor
- Proteccion contra open redirect en flujo de login
- Content Security Policy (CSP) headers
- Proteccion contra usuarios baneados en middleware y API routes
- Content-Type validation en endpoints JSON
- Prompt truncation para Claude API (max 3000 chars)

---

## Desarrollo local

### 1. Clonar e instalar

```bash
git clone https://github.com/SilviaPescador/Fullstack-Blog.git
cd Fullstack-Blog/nextjs-blog
pnpm install
```

### 2. Variables de entorno

Crear `nextjs-blog/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

# Opcional: moderacion con IA (funciona sin esto, pero no genera AI summary)
ANTHROPIC_API_KEY=sk-ant-...

# Opcional: notificaciones por email
RESEND_API_KEY=re_...

# Opcional: URL base para emails
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Migracion de base de datos

Ejecutar `db/migration-garden.sql` en el SQL Editor de Supabase.

### 4. Ejecutar

```bash
pnpm dev
```

---

## Estructura del proyecto

```
nextjs-blog/
  app/
    page.js                     Home con jardin SVG
    layout.js                   Root layout con particulas y cursor glow
    api/
      posts/                    CRUD de posts
      moderate/                 Moderacion con Claude
      water/                    Sistema de riego
      posts/approve/            Aprobar/rechazar posts
    admin/
      queue/                    Cola de moderacion
      users/                    Gestion de usuarios
    posts/[id]/                 Detalle de post
    (auth)/                     Login, registro, banned
  components/
    garden/
      Garden.js                 Contenedor SVG con Realtime
      Plant.js                  Planta individual con GSAP
      PlantGenerator.js         Generacion procedural SVG
      PlantTooltip.js           Tooltip en hover
      gardenUtils.js            Posiciones, PRNG, DNA por defecto
    Particles.js                Particulas flotantes (fireflies)
    CursorGlow.js               Resplandor que sigue al cursor
    Icons.js                    Sistema de iconos SVG
    ThemeToggle.js              Dark/light mode
    WaterButton.js              Boton de riego
    layout.js                   Shell del sitio (nav con logo SVG)
    postArticle.js              Tarjeta de post
    ...
  lib/
    claude.js                   Cliente Claude API
    email.js                    Notificaciones Resend
    validation.js               Sanitizacion y validacion de inputs
    supabase/                   Clientes Supabase (client, server, middleware)
  styles/
    tokens.css                  Design tokens (colores, tipografia, spacing)
    global.css                  Estilos base, particulas, cursor glow, utilidades
    garden.css                  Estilos del jardin
  db/
    migration-garden.sql        Migracion para Our Garden
```

---

## Stack

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| Frontend | React 19, CSS Custom Properties, GSAP |
| Backend | API Routes de Next.js |
| Base de datos | Supabase (PostgreSQL + Realtime) |
| Auth | Supabase Auth (Email, Google, GitHub) |
| IA | Claude API (Haiku) |
| Email | Resend |
| Hosting | Vercel |
| i18n | next-intl (ES/EN) |

---

## Autora

**Silvia Pescador** - [@SilviaPescador](https://github.com/SilviaPescador)
