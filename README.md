# Airbnb Clone — Capstone Project

A full-stack Airbnb-style booking platform built for the Zaio Full Stack / AI Bootcamp Capstone Project. One React app serves two experiences on the same domain, matching the reference demo: a public, Airbnb-style booking frontend and a `/admin` dashboard for hosts to manage listings and reservations.

## Tech stack

- **Frontend:** React 19, Vite, React Router v7, Axios, plain CSS (no UI framework, to closely control the Airbnb-style look)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Auth:** JWT (jsonwebtoken) + bcryptjs password hashing, role-based (`user` / `host`)

## Project structure

```
capstone-airbnb-clone/
├── backend/            Express API (users, accommodations, reservations)
│   ├── config/         Database connection
│   ├── controllers/    Route handlers
│   ├── middleware/     Auth (JWT) and error handling
│   ├── models/         Mongoose schemas (User, Accommodation, Reservation)
│   ├── routes/         Express routers
│   ├── seed.js         Demo data seeder
│   └── server.js        App entry point
└── frontend/            React (Vite) app
    ├── src/api/          Axios wrappers per resource
    ├── src/components/   Shared UI (headers, footer, listing card/form, icons)
    ├── src/context/      Auth context
    └── src/pages/        Public pages + src/pages/admin dashboard pages
```

## Feature overview

**Public site** (`/`, `/locations`, `/locations/:id`)
- Home page with hero search, inspiration/destination sections
- Search & browse listings by location
- Listing detail page with gallery, host info, amenities, and a booking card that computes a live price breakdown (nights, weekly discount, cleaning fee, service fee, occupancy taxes)
- Reserving a stay requires login; guests are redirected to `/admin/login` and returned to the listing afterward

**Admin dashboard** (`/admin/*`, host-only, protected by `ProtectedRoute` + server-side `requireRole("host")`)
- Login (same endpoint serves guests and hosts; redirect differs by role)
- Create / update / delete listings
- View your own listings
- View and cancel reservations made on your listings

**Backend design notes**
- All prices are **recalculated server-side** from the accommodation record on every reservation — the client-submitted total is never trusted.
- Images are stored as **URLs**, not uploaded files. This is deliberate: Heroku's filesystem is ephemeral (wiped on every dyno restart/scale event), so uploaded files would be lost. The brief marks image upload as optional, so pasting an image URL (e.g. from Unsplash) satisfies the requirement without relying on non-persistent storage.
- Only an original, generic house-glyph icon is used for branding — the real Airbnb "Bélo" logo mark is not reproduced, to avoid trademark issues, while still using the word "airbnb" as text since the brief explicitly names the site to clone.

## Local setup

### 1. Prerequisites
- Node.js 18+ and npm
- A MongoDB Atlas cluster (or local MongoDB) — see below if you don't have one yet

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<any long random string>
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

Seed demo data (creates 2 demo hosts, 1 demo guest, and 5 listings):

```bash
npm run seed
```

Demo accounts created by the seeder (all use password `password123`):

| Username | Role  |
|----------|-------|
| Johann   | host  |
| Marie    | host  |
| Jane     | user  |

Start the API:

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start
```

The API runs on `http://localhost:5000` (health check at `/api/health`).

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

`.env` defaults to `VITE_API_URL=http://localhost:5000/api`, which matches the backend above — no changes needed for local dev.

```bash
npm run dev -- --port 5173
```

Visit `http://localhost:5173`. Admin dashboard: `http://localhost:5173/admin/login`.

## Setting up MongoDB Atlas (if you need a database)

1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) (Google sign-in works).
2. Create a new **Project**, then **Build a Database** → choose the **M0 Free** tier → pick any region → name the cluster (e.g. `airbnb-clone`) → **Create**.
3. Under **Security Quickstart** (or Database Access), create a database user with a username/password (use "Autogenerate Secure Password" and copy it immediately).
4. Under **Network Access**, add an IP Access List entry of `0.0.0.0/0` (allow access from anywhere). This is required because Heroku dynos don't have a fixed IP address — restricting to your own current IP will work locally but will break the deployed app.
5. Go to your cluster → **Connect** → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=<cluster>
   ```
6. Paste it into `backend/.env` as `MONGO_URI`, replacing `<username>`/`<password>` with your real credentials and adding a database name before the `?`, e.g.:
   ```
   MONGO_URI=mongodb+srv://myuser:mypassword@airbnb-clone.xxxxx.mongodb.net/airbnb-clone?retryWrites=true&w=majority&appName=airbnb-clone
   ```

This project's `backend/.env` (not committed to git) is already configured this way against a live free-tier Atlas cluster with network access opened to `0.0.0.0/0`. Run `npm run seed` once from a machine that has normal internet access (i.e. not inside a locked-down sandbox) to populate it, then `npm run dev`/`npm start` to run against it.

## Deploying to Heroku

Heroku has two apps here: one for the API, one for the static frontend (or you can serve the frontend from the same Express app — see note below).

### Backend

```bash
cd backend
heroku create your-app-name-api
heroku config:set MONGO_URI="<your Atlas connection string>"
heroku config:set JWT_SECRET="<a long random string>"
heroku config:set CLIENT_ORIGIN="https://your-app-name.herokuapp.com"
git subtree push --prefix backend heroku main   # if backend isn't its own repo
```

Make sure `backend/package.json` has a `"start"` script (`node server.js`) — Heroku uses it automatically, and the app already binds to `process.env.PORT`.

### Frontend

```bash
cd frontend
# set VITE_API_URL to your deployed backend's /api URL before building
echo "VITE_API_URL=https://your-app-name-api.herokuapp.com/api" > .env
npm run build
```

Deploy the contents of `frontend/dist` as a static site (e.g. via the `heroku-buildpack-static` buildpack, or any static host of your choice — Netlify/Vercel/GitHub Pages all work too since this is a pure client-side SPA once built).

Remember to also update `CLIENT_ORIGIN` on the backend to match whatever URL the frontend ends up deployed at, so CORS allows requests from it.

### One-app alternative

If you'd rather deploy a single Heroku app: build the frontend (`npm run build` in `frontend/`), copy `frontend/dist` into the backend as a `public` folder, and add `app.use(express.static("public"))` plus a catch-all route in `server.js` that returns `index.html` for non-API GET requests. This avoids CORS entirely since everything is served from one origin (matching how the reference demo ran on a single `localhost:3000`).

## Submission checklist

Per the brief's submission instructions, make sure your final submission includes:

- [ ] GitHub repository link (with this code committed, `.env` excluded via `.gitignore`)
- [ ] Deployed application link (Heroku or equivalent)
- [ ] A short video walkthrough demonstrating the app
