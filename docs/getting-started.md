# Getting Started

## Prerequisites

- Node.js 20+ recommended.
- npm (this project uses npm).

## Install dependencies

```bash
npm install
```

## Run the app in development

```bash
npm run dev
```

Open:

- [http://localhost:3000/en](http://localhost:3000/en) — English (LTR)
- [http://localhost:3000/ar](http://localhost:3000/ar) — Arabic (RTL)

Root `/` redirects to the default locale (`en`). Copy `.env.example` to `.env.local` if you will call the backend (`NEXT_PUBLIC_API_BASE_URL` or `API_URL`).

## Build and run production

```bash
npm run build
npm run start
```

## Linting

```bash
npm run lint
```

## First places to explore

- Dashboard home: `/en` or `/ar`
- Login page: `/en/login` or `/ar/login`
- Forms module: `/en/forms`
- Filters module: `/en/filters`
- Charts module: `/en/charts`
- Table module: `/en/table`
- Settings module: `/en/settings`

Dashboard pages are currently browsable without a session. The protected-route redirect in `src/proxy.ts` is commented until the auth system / backend is ready.
