# HKBA Phase 1 Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the uploaded HKBA official-site brief into the current working Next.js/Express/SQLite project without a full stack rewrite.

**Architecture:** Keep the existing frontend and backend boundaries. Stabilize the SQLite bootstrap and backend safety settings first, then improve public route behavior and CMS coverage using the current REST API shape. Document Phase 2 migration work separately from the immediate runnable system.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS 4, Express 4, better-sqlite3, JWT, local uploads.

## Global Constraints

- Preserve the current working stack for Phase 1: no PostgreSQL/Prisma migration, no OSS migration, no shadcn/ui rewrite.
- Keep public routes: `/`, `/about`, `/news`, `/news/[id]`, `/team`, `/members`, `/contact`.
- Keep current API namespaces during Phase 1; do not mass-rename admin endpoints to `/api/admin/*`.
- Do not reset or revert existing frontend changes; `frontend/` is a git repository with uncommitted work.
- Root `/Users/mahao/hkba-club` is not a git repository, so root-level docs cannot be committed unless the user initializes git later.
- Verification requires `npm run build` in `frontend` and backend smoke checks.

---

## File Structure

- Modify `backend/db/init.js`: make default inserts idempotent for tables without unique constraints.
- Modify `backend/server.js`: environment-driven CORS allowlist.
- Modify `backend/routes/upload.js`: align upload size/type limits with Phase 1 safety.
- Create `backend/.env.example`: document backend environment.
- Modify `frontend/next.config.ts`: configure Turbopack root and image domains.
- Create `frontend/.env.example`: document frontend API URL.
- Create root `README.md`: explain current architecture, commands, local ports, seed/admin notes, and Phase 2 roadmap.
- Modify `frontend/src/lib/useLang.tsx`: persist language selection to `localStorage`.
- Modify `frontend/src/app/page.tsx`: align homepage modules with the brief, improve partner links and fallback states.
- Modify `frontend/src/app/news/page.tsx`: add category filtering and loading/error/empty states.
- Modify `frontend/src/app/news/[id]/page.tsx`: add latest-news section and stronger not-found/error handling.
- Modify `frontend/src/app/contact/page.tsx`: improve submit states and form UX.
- Modify `frontend/src/app/admin/layout.tsx`: add contact messages navigation.
- Modify `frontend/src/app/admin/page.tsx`: add recent news preview and contact-message count.
- Create `frontend/src/app/admin/messages/page.tsx`: list, mark read, and delete contact submissions.
- Modify `frontend/src/app/admin/pages/page.tsx`: add clearer labels for editable site pages.

---

### Task 1: Backend Stability And Safety

**Files:**
- Modify: `backend/db/init.js`
- Modify: `backend/server.js`
- Modify: `backend/routes/upload.js`

**Interfaces:**
- Produces: repeated `initDatabase()` calls do not add duplicate `stats` or `milestones`.
- Produces: `process.env.ALLOWED_ORIGINS` accepts comma-separated origins.
- Produces: upload route rejects unsupported extensions and files above 5MB.

- [ ] **Step 1: Add idempotent default insert helpers**

In `backend/db/init.js`, replace direct repeated default insertion for `statsDefaults` and `milestonesDefaults` with table-empty guards:

```js
const statCount = conn.prepare('SELECT COUNT(*) AS count FROM stats').get().count;
if (statCount === 0) {
  for (const s of statsDefaults) {
    insertStat.run(s.label_zh, s.label_en, s.value, s.icon, s.sort);
  }
}

const milestoneCount = conn.prepare('SELECT COUNT(*) AS count FROM milestones').get().count;
if (milestoneCount === 0) {
  for (const m of milestonesDefaults) {
    insertMilestone.run(m.year, m.title_zh, m.title_en, m.desc_zh, m.desc_en, m.sort);
  }
}
```

- [ ] **Step 2: Add environment-driven CORS allowlist**

In `backend/server.js`, derive `ALLOWED_ORIGINS` from `process.env.ALLOWED_ORIGINS` with the current localhost defaults:

```js
const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002',
];

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS.join(','))
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
```

- [ ] **Step 3: Tighten uploads**

In `backend/routes/upload.js`, change `fileSize` to `5 * 1024 * 1024` and restrict allowed extensions to `jpg`, `jpeg`, `png`, `gif`, `webp`, `svg`, `ico`, and `pdf`.

- [ ] **Step 4: Verify backend idempotency**

Run:

```bash
node - <<'NODE'
const { initDatabase, getDb, closeDatabase } = require('./db/init');
initDatabase();
const db = getDb();
const before = {
  stats: db.prepare('SELECT COUNT(*) AS count FROM stats').get().count,
  milestones: db.prepare('SELECT COUNT(*) AS count FROM milestones').get().count,
};
closeDatabase();
initDatabase();
const db2 = getDb();
const after = {
  stats: db2.prepare('SELECT COUNT(*) AS count FROM stats').get().count,
  milestones: db2.prepare('SELECT COUNT(*) AS count FROM milestones').get().count,
};
console.log({ before, after });
if (before.stats !== after.stats || before.milestones !== after.milestones) process.exit(1);
closeDatabase();
NODE
```

Expected: counts are equal before and after.

---

### Task 2: Project Configuration And Documentation

**Files:**
- Modify: `frontend/next.config.ts`
- Create: `frontend/.env.example`
- Create: `backend/.env.example`
- Create: `README.md`

**Interfaces:**
- Produces: frontend build no longer emits the workspace-root warning.
- Produces: docs describe current ports and commands.

- [ ] **Step 1: Configure frontend root**

In `frontend/next.config.ts`, import `path` and add:

```ts
const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // existing rewrites/images stay here
};
```

- [ ] **Step 2: Add environment examples**

Create `frontend/.env.example`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:37900
```

Create `backend/.env.example`:

```dotenv
PORT=37900
JWT_SECRET=replace-with-at-least-32-random-characters
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

- [ ] **Step 3: Add root README**

`README.md` must include:

- Current architecture.
- Backend install/run commands.
- Frontend install/run/build commands.
- Database init and seed notes.
- Default admin note: `admin / hkba2024` may be created by `initDatabase()` and must be changed before production.
- Current Phase 1 vs Phase 2 scope.

- [ ] **Step 4: Verify frontend build**

Run:

```bash
npm run build
```

Expected: build passes and the previous Next.js workspace root warning is gone.

---

### Task 3: Public Site Alignment

**Files:**
- Modify: `frontend/src/lib/useLang.tsx`
- Modify: `frontend/src/app/page.tsx`
- Modify: `frontend/src/app/contact/page.tsx`

**Interfaces:**
- Produces: language selection persists under `hkba_lang`.
- Produces: homepage better follows the brief's module order and links partner cards to `website_url`.
- Produces: contact form has clearer sending/sent/error states.

- [ ] **Step 1: Persist language**

In `frontend/src/lib/useLang.tsx`, initialize language from `localStorage` on mount and write changes back to `localStorage`.

- [ ] **Step 2: Improve homepage fallbacks**

In `frontend/src/app/page.tsx`:

- Render four default stat cards only when API stats are empty.
- Make partner logos clickable when `website_url` exists.
- Add a visible empty/fallback CTA in sections where API data may be empty.
- Keep current dark visual system and route links.

- [ ] **Step 3: Improve contact UX**

In `frontend/src/app/contact/page.tsx`:

- Prevent duplicate submissions while `status === 'sending'`.
- Reset success/error status when the user edits the form after a submit.
- Keep the current public API `/api/contact/message`.

- [ ] **Step 4: Verify public pages**

Run frontend dev server and check:

- `/`
- `/contact`

Expected: no runtime error, language toggle persists after refresh, contact form shows state changes.

---

### Task 4: News Listing And Detail

**Files:**
- Modify: `frontend/src/app/news/page.tsx`
- Modify: `frontend/src/app/news/[id]/page.tsx`

**Interfaces:**
- Produces: news page category filtering from loaded categories.
- Produces: news detail latest-news side/below section.

- [ ] **Step 1: Add category filtering**

In `frontend/src/app/news/page.tsx`:

- Load the current page of news as before.
- Derive unique categories from loaded items.
- Add an "All" filter plus category buttons.
- Filter visible cards client-side.
- Reset page to `1` when the user chooses a category if server-side category filtering is used.

- [ ] **Step 2: Add detail latest-news block**

In `frontend/src/app/news/[id]/page.tsx`:

- Fetch `/api/news?limit=5`.
- Exclude the current article id.
- Render latest news links below the article on narrow layouts and as a side block on wider layouts using CSS grid.

- [ ] **Step 3: Improve detail errors**

In `frontend/src/app/news/[id]/page.tsx`, track `loading` and `error` state separately from `article`.

- [ ] **Step 4: Verify news routes**

Check:

- `/news`
- `/news/1`

Expected: category buttons render, article detail loads, latest-news links render.

---

### Task 5: Admin Operations

**Files:**
- Modify: `frontend/src/app/admin/layout.tsx`
- Modify: `frontend/src/app/admin/page.tsx`
- Create: `frontend/src/app/admin/messages/page.tsx`
- Modify: `frontend/src/app/admin/pages/page.tsx`

**Interfaces:**
- Consumes: existing backend routes `/api/contact/messages`, `/api/contact/messages/:id/read`, and `/api/contact/messages/:id`.
- Produces: admin can view, mark read, and delete contact messages.

- [ ] **Step 1: Add admin menu item**

In `frontend/src/app/admin/layout.tsx`, add:

```ts
{ href: '/admin/messages', label: '留言', icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z' }
```

- [ ] **Step 2: Add message count and recent news**

In `frontend/src/app/admin/page.tsx`, include contact-message count from `/api/contact/messages` and render the latest five news titles from `/api/news/admin/all`.

- [ ] **Step 3: Create messages page**

Create `frontend/src/app/admin/messages/page.tsx` with:

- `adminGet<ContactMessage[]>('/api/contact/messages')`
- `adminPut('/api/contact/messages/:id/read', {})`
- `adminDelete('/api/contact/messages/:id')`
- unread badge based on `is_read`

- [ ] **Step 4: Clarify pages admin labels**

In `frontend/src/app/admin/pages/page.tsx`, add copy that explains `about` powers the About page and `membership` powers member-service copy.

- [ ] **Step 5: Verify admin routes**

Log in and check:

- `/admin`
- `/admin/messages`
- `/admin/pages`

Expected: dashboard counts render, messages page renders, actions call existing backend routes.

---

## Final Verification

- [ ] Run `npm run build` in `frontend`.
- [ ] Start backend and call `/api/health`.
- [ ] Confirm repeated `initDatabase()` does not duplicate stats/milestones.
- [ ] Browser-check `/`, `/news`, `/news/1`, `/contact`, `/admin`, `/admin/messages`.
- [ ] Summarize changed files and any skipped checks.
