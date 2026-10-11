# MERN Todo

A todo app with a React (Vite) frontend and an Express + MongoDB backend, laid
out for a single Vercel deployment: the frontend is served as static files and
the backend runs as a serverless function under `/api/*`.

```
backend/
  api/index.js      entry point Vercel calls (also a normal server locally)
  src/app.js        Express app: routes, CORS, JSON, error handler
  src/db.js         cached Mongoose connection
  src/models/       Todo model
  src/routes/       /api/todos CRUD
frontend/
  src/App.jsx       the todo UI
  src/main.jsx      React entry
  vite.config.js    dev proxy: /api -> localhost:5000
vercel.json         build config + rewrites (API + SPA fallback)
```

## Run locally

1. **MongoDB** — either a local `mongod` or a free Atlas cluster.
2. **Backend** — in `backend/`:
   ```sh
   npm install
   # create a .env file (git-ignored) with:
   #   MONGODB_URI=mongodb://127.0.0.1:27017/todos
   #   PORT=5000
   npm run dev
   ```
3. **Frontend** — in `frontend/`:
   ```sh
   npm install
   npm run dev   # http://localhost:5173, /api proxied to :5000
   ```

## Deploy to Vercel

1. Push this repo to GitHub, then import it at vercel.com (Vercel auto-detects
   the settings from `vercel.json`).
2. In Project → Settings → Environment Variables, add `MONGODB_URI` with your
   Atlas connection string (use `mongodb+srv://…`). Never commit real secrets.
3. Deploy. The site and `/api/*` live on the same domain, so the frontend's
   relative `fetch("/api/todos")` works in dev and in production.

Notes on the config:

- `backend/api/index.js` exports the Express app — Vercel wraps it as a
  serverless function; locally it calls `app.listen()` instead (it skips that
  when the `VERCEL` env var is present).
- `db.js` caches the Mongo connection on `globalThis` because serverless
  functions can be reused between requests, and opening a fresh connection per
  request would exhaust MongoDB's connection limit.
- In Atlas, allow network access from anywhere (0.0.0.0/0) or Vercel's requests
  will be refused — serverless IPs aren't predictable.
