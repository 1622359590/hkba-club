# HKBA Progressive Integration Design

Date: 2026-07-08
Project: `/Users/mahao/hkba-club`
Source brief: `/Users/mahao/Downloads/HKBA_Codex_Prompt.md`

## Context

The uploaded brief describes a full HKBA official website rebuild with a public website, CMS, PostgreSQL/Prisma, Aliyun OSS, JWT auth, shadcn/ui, and production deployment on Aliyun ECS.

The current project is already a working split app:

- Frontend: Next.js 16 App Router, React 19, Tailwind CSS, inline component styles, public pages and admin pages under `frontend/`.
- Backend: Express, SQLite via `better-sqlite3`, JWT admin auth, local file uploads, REST routes under `backend/`.
- Content model: banners, announcements, partners, team members, news, events, pages, contact info, messages, stats, and milestones.

The integration should preserve the working system and fold in the brief's product structure incrementally instead of replacing the stack in one pass.

## Recommended Approach

Use a progressive integration:

1. Stabilize the existing app.
2. Align the public website with the brief's HKBA official-site information architecture.
3. Improve CMS operations where the current backend already has matching data.
4. Document deployment and future PostgreSQL/Prisma/OSS migration as a second phase.

This keeps the project usable while moving it closer to the formal association website described in the brief.

## Non-Goals For This Pass

- Do not migrate SQLite to PostgreSQL/Prisma in the first pass.
- Do not replace local uploads with Aliyun OSS in the first pass.
- Do not introduce shadcn/ui or a full design-system rewrite in the first pass.
- Do not replace every inline style while functional improvements are still pending.
- Do not change the public route map unless it directly improves consistency with the current app.

These items are captured as Phase 2 work.

## Phase 1 Scope

### Stability And Project Hygiene

- Fix duplicate default seed behavior in `backend/db/init.js`.
  - Current issue: `INSERT OR IGNORE` is used on tables without unique keys, so `stats` and `milestones` grow on every database initialization.
  - Desired behavior: insert defaults only when each table is empty or when an explicit unique key exists.
- Add root-level documentation that reflects the actual two-app setup.
  - Include frontend and backend install, run, seed, build, and production notes.
  - Include default local ports: frontend `3000`, backend `37900`.
  - Include current admin bootstrap behavior and note production password rotation.
- Add `.env.example` files for frontend and backend.
- Silence the Next.js workspace root warning by configuring the frontend root in `frontend/next.config.ts`.
- Keep existing user or generated code changes intact; do not reset the frontend git repository.

### Public Website Alignment

Use the brief's content order while keeping current routes:

- `/`
  - Hero/Banner: dynamic banners with image-aware visual treatment, manual indicators, and CTA.
  - About: association summary, mission-oriented copy, stats, and video embed only if an existing or newly added config value supplies a video ID.
  - News: latest 6 published news items, clear category/date/title hierarchy, link to `/news`.
  - Leadership: top members by sort order, link to `/team`.
  - Partners: logo rail with hover/click behavior using `website_url`.
  - Contact CTA: clear route to `/contact` and membership/contact intent.
- `/about`
  - Mission and vision content from pages/config where available.
  - Milestone timeline.
  - Partner and leadership summaries as supporting proof.
- `/news`
  - Add category filtering derived from loaded news categories.
  - Keep pagination.
  - Improve empty and loading states.
- `/news/[id]`
  - Keep article detail.
  - Add latest-news sidebar or below-article section depending on viewport.
  - Add return link to `/news`.
- `/team`
  - Treat as the leadership committee page.
  - Group by roles from current `group_name` values.
- `/members`
  - Keep as partners and member organizations in Phase 1.
  - Do not move the leadership committee into this route during Phase 1; `/team` remains the leadership route.
  - Preserve current partner/member logo directory.
- `/contact`
  - Keep contact form.
  - Improve success/error states and make contact info/social links more discoverable.

### CMS Alignment

Improve the existing CMS without changing the API namespace yet:

- Dashboard:
  - Show counts for banners, news, events, team, partners.
  - Add recent news preview if available.
  - Keep quick links to create/edit content.
- Pages:
  - Keep editable static pages.
  - Make the about/membership pages easier to understand through labels and concise helper text.
- Contact messages:
  - Add admin access to contact form submissions if not currently surfaced.
- Settings:
  - Keep password change.
  - Add or plan contact/site-config editing using the existing `contact_info` and `pages` tables.
- Media/upload:
  - Keep local uploads.
  - Tighten file size/type validation to match the brief where practical.

### API And Data Flow

Current public API paths stay in place:

- Public reads: `/api/banners`, `/api/news`, `/api/team`, `/api/partners`, `/api/events`, `/api/pages/:slug`, `/api/contact/info`, `/api/stats`, `/api/milestones`.
- Admin reads/writes: current authenticated paths such as `/api/banners/all`, `/api/news/admin/all`, `/api/team/all`, and matching POST/PUT/DELETE routes.

Phase 1 may add small endpoints only when the UI needs data that already exists, such as contact messages in the admin surface.

Do not rename all admin endpoints to `/api/admin/*` in Phase 1. That would be a broad client/server churn with little immediate value.

### Error Handling

- Public pages should show graceful empty states when API calls fail or return no content.
- Admin pages should avoid silent failures where practical and surface concise errors.
- Backend validation should return `400` for missing required fields where current routes can otherwise fail at request time in SQLite.
- Auth failures should keep redirecting to `/admin/login`.

### Security

Phase 1 security hardening:

- Keep JWT required for all write/admin routes.
- Keep `JWT_SECRET` required in production-like startup.
- Restrict CORS through an environment-driven allowlist.
- Reduce upload maximum from 10MB to 5MB unless video uploads are actively required.
- Limit upload extensions to image formats plus PDFs only if the UI actually uses PDFs.
- Document that the default admin password must be changed before deployment.

Phase 2 security:

- Add `helmet`.
- Add request rate limiting for public form/API endpoints.
- Move uploads to Aliyun OSS and remove local disk dependency.

## Phase 2 Roadmap

Phase 2 can implement the full brief stack once Phase 1 is stable:

- PostgreSQL with Prisma models and migrations.
- Aliyun OSS upload pipeline with optional `cdn.hkba.club`.
- `/api/admin/*` route normalization.
- Rich text editor for news content.
- Drag-and-drop sorting with persisted reorder endpoints.
- `next-intl` or an equivalent persistent language setup.
- shadcn/ui component system if a broader UI rewrite is approved.
- PM2/Nginx deployment package for Aliyun ECS and Baota.

## Testing And Verification

For Phase 1 completion:

- Run `npm run build` in `frontend`.
- Run backend smoke checks:
  - health endpoint returns ok.
  - public content endpoints return JSON.
  - database init does not duplicate stats or milestones after repeated startup.
- Manually verify key public pages in browser:
  - `/`
  - `/about`
  - `/news`
  - `/news/[id]`
  - `/team`
  - `/members`
  - `/contact`
- Verify admin login and at least one content list page.

## Documentation Deliverables

- Root `README.md` with current architecture, commands, ports, environment variables, seed/init behavior, admin login notes, and deployment notes.
- `frontend/.env.example`.
- `backend/.env.example`.
- Optional `docs/phase-2-roadmap.md` if Phase 2 details become too long for README.

## Approval State

The user approved the progressive integration direction with "可以的". This document is the concrete implementation design for that direction.
