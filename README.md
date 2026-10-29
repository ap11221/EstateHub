# EstateHub — Real Estate Portal (MERN)

A full-stack real estate listing platform built with **MongoDB, Express, React, Node.js**.

Features:
- Property listings (Flat, Bungalow, House, Villa, Apartment, Plot) — for **Sale** or **Rent**
- Search & filters (city, price range, BHK, property type, listing type)
- Property detail page with image gallery, housing details, rental details
- **Contact Owner** inquiry form
- **Favorites** (save/unsave properties)
- Owner dashboard — list properties, edit, delete, track views
- **Admin panel**:
  - Dashboard with stats
  - Approve / reject / mark rented / mark sold on listings
  - **Direct edit of rent/price, rental details (deposit, lease term, maintenance, furnishing) and housing details (BHK, bathrooms, area, floor)**
  - User management (block/unblock)
  - View all inquiries
- JWT authentication with 3 roles: `user`, `owner`, `admin`

---

## 1. Prerequisites

- [Node.js](https://nodejs.org/) v18+ and npm
- MongoDB — either:
  - **Local**: install MongoDB Community Server and run it (`mongod`), or
  - **Cloud (recommended, easiest)**: create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and copy its connection string

---

## 2. Project structure

```
realestate-portal/
├── backend/     # Node.js + Express + MongoDB API
└── frontend/    # React + Vite + Tailwind CSS app
```

---

## 3. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set your MongoDB connection string, a JWT secret, and Cloudinary credentials:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/realestate
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> If using Atlas, `MONGO_URI` will look like:
> `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/realestate`

> Property images are uploaded to **Cloudinary** (not saved to local disk), so they survive redeploys.
> Create a free account at [cloudinary.com](https://cloudinary.com) → Dashboard → copy your Cloud Name, API Key, and API Secret.

**(Optional but recommended) Seed the database** with demo users and sample properties:

```bash
npm run seed
```

This creates:
| Role  | Email                   | Password  |
|-------|-------------------------|-----------|
| Admin | admin@realestate.com    | admin123  |
| Owner | owner@realestate.com    | owner123  |
| User  | user@realestate.com     | user123   |

**Start the backend:**

```bash
npm run dev
```

The API will run at `http://localhost:5000`. Visit `http://localhost:5000/api/health` to confirm it's up.

---

## 4. Frontend setup

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

The app will run at `http://localhost:5173` and automatically proxies `/api` requests to the backend on port 5000 (see `vite.config.js`), so no extra config is needed.

---

## 5. Using the app

1. Go to **Live Website:** https://realestate-portal-ebon.vercel.app
2. Log in with a demo account (buttons on the Login page auto-fill credentials), or register your own account as a "user" or "owner"
3. **As an owner**: go to "My Properties" → "+ Add Property" to submit a listing (goes to `pending` until an admin approves it)
4. **As admin**: go to "Admin" in the nav →
   - **Properties** tab: approve/reject listings, or click **"Edit Rent/Details"** on any property to directly update price/rent, rental details (deposit, lease term, maintenance, furnishing) and housing details (BHK, bathrooms, area, floor)
   - **Users** tab: block/unblock users
   - **Inquiries** tab: view all contact-owner messages
5. **As a regular user**: browse `/listings`, use filters, save favorites (♥ icon), and use "Send Inquiry" on a property page to contact the owner

---



## 6. Tech notes

- Auth: JWT stored in `localStorage`, sent as `Authorization: Bearer <token>` on each request
- Image uploads: streamed directly to **Cloudinary** (no local disk storage), so listings keep their photos across redeploys/restarts
- New owner listings default to `status: "pending"` and require admin approval before appearing in public search results; admin-created listings go live immediately
- Editing an already-active listing (as an owner) resets it to `pending` for re-approval; admin edits via the admin panel do not require re-approval
- **Anti-spam protections** (registration is open to the public, so these guard the funnel):
  - Register/login are rate-limited per IP (20 attempts / 15 min)
  - New listing submissions are rate-limited per IP (15 / hour) **and** capped per owner account (10 / 24h) — admins are exempt from the account cap
  - Contact-owner inquiries are rate-limited per IP (20 / hour) to stop the form being used to spam owners

## 7. Common issues

- **"MongoDB connection error"** → check `MONGO_URI` in `backend/.env` and make sure MongoDB is running (local) or your Atlas IP allowlist includes your machine.
- **CORS errors** → make sure `CLIENT_URL` in `backend/.env` matches the URL the frontend runs on (default `http://localhost:5173`). You can list multiple origins separated by commas.
- **Images not uploading** → double check your `CLOUDINARY_*` values in `backend/.env`.

---

## 8. Deploying to production

This app is split into three independently-hosted pieces, all of which have generous free tiers:

| Piece | Where | Why |
|---|---|---|
| Database | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) | Already cloud-based — no changes needed |
| Backend (Express API) | [Render](https://render.com) (or Railway / Fly.io) | Free web service, easy env vars |
| Frontend (React) | [Vercel](https://vercel.com) (or Netlify) | Best-in-class static/SPA hosting |
| Images | [Cloudinary](https://cloudinary.com) | Already wired into the backend |

### Step 1 — MongoDB Atlas
1. Create a free cluster at Atlas, add a database user, and allow access from anywhere (`0.0.0.0/0`) under Network Access — or add Render's specific IPs later for tighter security.
2. Copy the connection string (`mongodb+srv://...`).

### Step 2 — Cloudinary
1. Sign up free at cloudinary.com.
2. From the dashboard, copy your **Cloud Name**, **API Key**, and **API Secret**.

### Step 3 — Deploy the backend (Render)
1. Push this project to a GitHub repo.
2. In Render, click **New + → Web Service**, connect your repo, and set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Add environment variables in the Render dashboard (Settings → Environment):
   - `MONGO_URI` — your Atlas connection string
   - `JWT_SECRET` — any long random string
   - `JWT_EXPIRES_IN` — `7d`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `CLIENT_URL` — leave as `http://localhost:5173` for now; you'll update it after deploying the frontend
4. Deploy. Note the resulting URL, e.g. `https://nestfind-backend.onrender.com`.
5. A `render.yaml` blueprint is included in `backend/` if you prefer Render's "Blueprint" flow.

> **Note on Render's free tier:** the service spins down after ~15 min of inactivity and takes ~30–50s to wake up on the next request. This is normal — not a bug. Paid tiers avoid this.

### Step 4 — Deploy the frontend (Vercel)
1. In Vercel, **Add New → Project**, import the same repo, and set:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (auto-detected)
2. Add an environment variable:
   - `VITE_API_URL` = `https://nestfind-backend.onrender.com/api` (your Render URL + `/api`)
3. Deploy. Note the resulting URL, e.g. `https://nestfind.vercel.app`.
4. A `vercel.json` (SPA rewrites) is already included in `frontend/`, so client-side routing works correctly. A `netlify.toml` is also included if you deploy to Netlify instead.

### Step 5 — Connect the two
1. Go back to Render → your backend service → Environment → update `CLIENT_URL` to your Vercel URL (e.g. `https://nestfind.vercel.app`). You can list several comma-separated origins if you also want to keep local dev working, e.g.:
   `CLIENT_URL=http://localhost:5173,https://nestfind.vercel.app`
2. Redeploy the backend so the new CORS setting takes effect.
3. (Optional) Run `npm run seed` — either locally pointed at your Atlas DB, or via Render's shell — to create demo accounts and sample listings.

### Will it work on all devices?
Yes — once deployed, the site is reachable from any phone, tablet, or desktop browser over the internet, and the responsive Tailwind layout adapts automatically to each screen size (see the earlier note on this). There's nothing device-specific in the code; the same deployed URLs work everywhere.

