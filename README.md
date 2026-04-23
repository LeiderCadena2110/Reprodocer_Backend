# MusicFlow 🎵

Reproductor de música fullstack con **Lista Doblemente Enlazada**, integración YouTube y soporte de archivos locales.

## Funcionalidades

- **Lista doblemente enlazada** como estructura de datos central (next, prev, jump, shuffle, insert en cualquier posición)
- **Búsqueda en YouTube** (YouTube Data API v3 proxiada en el backend → API key nunca expuesta al cliente)
- **Archivos locales** con drag & drop — los archivos se reproducen directamente en el navegador sin upload al servidor
- **Reproductor unificado** — ambas fuentes (YouTube + local) se controlan con los mismos controles
- **Inserción flexible** — start / end / posición específica
- Dark mode con diseño production-grade

---

## Estructura del proyecto

```
musicflow-backend/   → Express + TypeScript → Railway
musicflow-frontend/  → React + Vite + TypeScript → Vercel
```

---

## 1. Obtener API key de YouTube

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un proyecto (o usa uno existente)
3. Busca **"YouTube Data API v3"** y actívala
4. Ve a **Credenciales → Crear credenciales → Clave de API**
5. Copia la clave generada

---

## 2. Deploy del Backend en Railway

1. Crea una cuenta en [railway.app](https://railway.app)
2. **New Project → Deploy from GitHub repo** (sube `musicflow-backend/` a un repo)
3. Railway detecta automáticamente Node.js
4. En **Variables de entorno** agrega:

| Variable | Valor |
|----------|-------|
| `YOUTUBE_API_KEY` | `AIza...` (tu clave de YouTube) |
| `FRONTEND_URL` | `https://tu-app.vercel.app` |

> Railway configura `PORT` automáticamente.

5. Configura los comandos:
   - **Build**: `npm run build`
   - **Start**: `npm start`

6. Copia la URL generada (ej. `https://musicflow-backend.up.railway.app`)

---

## 3. Deploy del Frontend en Vercel

1. Crea una cuenta en [vercel.com](https://vercel.com)
2. **New Project → Import Git Repository** (`musicflow-frontend/`)
3. Framework: **Vite** (detectado automáticamente)
4. En **Environment Variables** agrega:

| Variable | Valor |
|----------|-------|
| `VITE_API_URL` | `https://tu-backend.up.railway.app` |

5. Deploy → Vercel genera la URL del frontend

6. Actualiza `FRONTEND_URL` en Railway con la URL de Vercel

---

## Desarrollo local

### Backend

```bash
cd musicflow-backend
cp .env.example .env      # edita con tu YOUTUBE_API_KEY
npm install
npm run dev               # http://localhost:3001
```

### Frontend

```bash
cd musicflow-frontend
cp .env.example .env.local  # edita con VITE_API_URL=http://localhost:3001
npm install
npm run dev               # http://localhost:5173
```

---

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/playlist` | Estado completo de la lista |
| GET | `/api/playlist/current` | Canción actual |
| POST | `/api/playlist/songs` | Agregar canción |
| DELETE | `/api/playlist/songs/:id` | Eliminar por ID |
| POST | `/api/playlist/next` | Siguiente |
| POST | `/api/playlist/previous` | Anterior |
| POST | `/api/playlist/jump/:id` | Saltar a ID |
| POST | `/api/playlist/play` | Marcar como playing |
| POST | `/api/playlist/pause` | Marcar como paused |
| POST | `/api/playlist/shuffle` | Fisher-Yates shuffle |
| DELETE | `/api/playlist` | Limpiar todo |
| GET | `/api/youtube/search?q=&maxResults=` | Búsqueda YouTube |
| GET | `/api/youtube/status` | Estado de la API key |
| GET | `/health` | Health check |

---

## Tecnologías

**Backend**: Node.js · Express · TypeScript · axios · uuid · dotenv  
**Frontend**: React 18 · Vite · TypeScript · axios  
**APIs**: YouTube Data API v3 · YouTube IFrame Player API · HTML5 Audio API  
**Deploy**: Railway (backend) · Vercel (frontend)
