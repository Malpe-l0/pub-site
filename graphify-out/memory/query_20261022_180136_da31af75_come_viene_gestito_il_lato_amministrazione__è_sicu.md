---
type: "query"
date: "2026-10-22T18:01:36.059711+00:00"
question: "come viene gestito il lato amministrazione? è sicuro? ci sono miglioramentida fare o problemi di sicurezza? e il database. vorrrei usare questo dito come base, per poi poterlo modificare facilmente e rivenderlo ad altre attivita o pub"
contributor: "graphify"
outcome: "useful"
source_nodes: ["lib/auth.ts", "lib/db.ts", "lib/upload.ts", "lib/instagram.ts", "richiediAdmin()"]
---

# Q: come viene gestito il lato amministrazione? è sicuro? ci sono miglioramentida fare o problemi di sicurezza? e il database. vorrrei usare questo dito come base, per poi poterlo modificare facilmente e rivenderlo ad altre attivita o pub

## Answer

Expanded from original query via graph vocabulary: [auth, sessione, password, admin, upload, instagram, config, seed]. Graph query/path/explain located authentication, all admin action modules, SQLite schema, uploads and Instagram integration. Source verification: lib/auth.ts:29 uses a single plaintext ADMIN_PASSWORD environment secret and constant-time comparison; signed HMAC expiry cookie at :35 lasts 30 days, HttpOnly/SameSite Lax/Secure in production. Every inspected admin content page and content-mutating Server Action calls richiediAdmin; SQL writes use bound parameters. Isolated execution of actual transpiled auth module with fresh test credentials confirmed existing sessions survive ADMIN_PASSWORD rotation and captured tokens survive logout; SESSION_SECRET rotation invalidates them. Login :app/admin/login/azioni.ts:6 has only an 800ms failed-login delay, no application attempt counting or lockout. No separate user identities, roles or revocable sessions. lib/db.ts:7 stores SQLite pub.db and uploads in DATA_DIR, outside public, uses WAL and foreign_keys. Schema is single-business with singleton settings and no tenant scoping; use one isolated app instance/database/uploads/secrets per business for initial resale, keeping a shared maintained codebase and configurable branding/content. A shared SaaS requires a deliberate tenant and authorization model, potentially PostgreSQL and object storage. Backups must use a consistent SQLite snapshot/backup API plus coordinated media backup, offsite encrypted copies and restore drills; ad hoc copying a live WAL database is not a sufficient procedure. Migration at lib/db.ts:129 silently catches all ALTER errors, so introduce versioned migrations. lib/upload.ts:57 deletes the previous photo before validating/saving replacement; isolated in-memory mocked filesystem/image decoder test confirmed previous photo is lost on failed replacement. Service logo replacement repeats this ordering. SVG files are copied verbatim; uploads route has CSP default-src none (do not claim unrestricted script execution), add sanitization/rasterization and content/size quotas. Next local serverActions docs specify default 1MB total request body, conflicting with large phone uploads; configure bounded limits intentionally. instagram token is plaintext in database (lib/instagram.ts:58), excluded from returned public admin status; protect encryption keys and backups, set download byte/time limits, scheduler for token refresh. Beer selection and images remain hardcoded in components/sito/MuroBirre.tsx:2 and home; expose branding, hero, beers, sections, translations in configuration/admin for reuse. npm audit --omit=dev on 2026-10-22 reports 6 vulnerable package entries: 1 critical (next), 4 high, 1 moderate; next locked 16.2.9, react/react-dom 19.2.4, sharp 0.34.5. Audit suggests next 16.4.2 and sharp 0.35.5; do not auto-fix without compatibility checks. Official Next security bulletin https://nextjs.org/blog/nextjs-security-update-october-14-2026 confirms patches at 16.4.1 and high App Router Server Actions denial-of-service matching this app architecture; RCE advisory applicability depends on features and hosting, not all audit entries are exploitable here. Security headers and production TLS/filesystem isolation need hosting verification. Recommendation: patch dependencies, add rate limiting/hashed credentials/revocable sessions, fix media replacement, automate consistent backups/versioned migrations and per-client provisioning, then move configurable client content out of source. This was a source/dependency review and isolated logic tests, not an assessment of deployed TLS, permissions, actual secrets or live infrastructure. No application code changed.

## Outcome

- Signal: useful

## Source Nodes

- lib/auth.ts
- lib/db.ts
- lib/upload.ts
- lib/instagram.ts
- richiediAdmin()