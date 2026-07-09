# HKBA Frontend

Next.js 16 App Router frontend for the HKBA public site and admin CMS.

## Commands

```bash
npm install
npm run dev
npm run build
npm start
```

`npm run dev` starts the local frontend on `http://localhost:3000` with Webpack. `npm run dev:turbo` is available for explicit Turbopack testing.

## Environment

Create `.env.local` from `.env.example`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:37900
```

## Main Routes

Public:

- `/`
- `/about`
- `/news`
- `/news/[id]`
- `/events`
- `/members`
- `/team`
- `/contact`

Admin:

- `/admin/login`
- `/admin`
- `/admin/banners`
- `/admin/news`
- `/admin/events`
- `/admin/pages`
- `/admin/team`
- `/admin/members`
- `/admin/messages`
- `/admin/settings`

The admin CMS expects the Express backend to be running on `NEXT_PUBLIC_API_URL`.
