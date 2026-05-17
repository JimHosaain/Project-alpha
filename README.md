# Project-alpha

Smart PC Builder demo for the `main` branch.

## What You Run

The app has two parts for local development:

- Frontend: Vite + React
- Backend: Express + SQLite

The backend seeds a realistic demo catalog automatically, so you do not need to import SQL manually for the main flow.

## Branch Guide

- `main`: Full source code and the editable demo app.
- `gh-pages`: Static production build only.

## Quick Start

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Start the Backend

```bash
npm start
```

Backend runs on `http://localhost:4000`.

### 4. Start the Frontend

Open a second terminal at the repo root and run:

```bash
npm run dev
```

The Vite dev server uses a proxy for `/api` and `/smart`, so the frontend can talk to the backend automatically.

## Demo Flow

Use the app like this:

1. Open the site.
2. Go to the builder.
3. Enter a budget and use case.
4. View 3 recommended builds.
5. Compare builds.
6. Check compatibility warnings.
7. Save a build.

## Included Demo Data

The backend seeds the following data on startup:

- 5 CPUs
- 5 GPUs
- 5 Motherboards
- 5 RAM kits
- 3 PSUs
- 3 Cases
- 3 Storage devices
- 3 Stores

## Useful Commands

```bash
npm run build
npm run preview
```

## Files To Know

- Frontend entry: [src/main.jsx](src/main.jsx)
- App shell: [src/App.jsx](src/App.jsx)
- Smart builder API: [server/smartBuilder.js](server/smartBuilder.js)
- SQLite bootstrap: [server/db.js](server/db.js)
- Schema: [db/schema.sql](db/schema.sql)

## Notes

- `VITE_API_BASE` is optional for local development. If you set it, point it to `http://localhost:4000`.
- Saved builds are stored in SQLite at `db/app.db`.

