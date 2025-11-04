## Copilot / AI contributor guidance

This file gives focused, actionable notes so an AI coding agent can be productive in this repository quickly.

High-level snapshot
- Project: SvelteKit app (TypeScript) implementing email/password + WebAuthn (passkeys), TOTP 2FA and example list/todo features.
- Runtime: dev via `pnpm dev`. Uses SQLite by default; optional MySQL X DevAPI accessor is present.

Quick start (how developers run & test)
- Install: `pnpm i`
- Initialize DB (SQLite default):
  - `sqlite3 sqlite.db` then run the SQL in `setup.sql` (project README documents this).
- Set environment: create `.env` and set `ENCRYPTION_KEY` (base64 16-byte string). Example shown in README.
- Run dev server: `pnpm dev` (runs svelte-check first; see package.json scripts).

Key architecture & where to look
- Frontend + backend: SvelteKit app. Server-side helpers and business logic live under `src/lib/server`.
  - Authentication related code: `src/lib/server/auth/*` (see `encryption.ts`, `oauth.ts`).
  - Database access: `src/lib/server/database/*` (see `db.ts`, `MySQLXAccessor.ts`).
  - Shared constants: `src/lib/constants.ts` (defines `projectlib`, `projecthome`, and `origin` used across server loaders).

Database patterns and examples
- Default: SQLite (README + `setup.sql`). The app also contains a MySQL X DevAPI accessor (`MySQLXAccessor.ts`) and a `db.ts` wrapper that:
  - loads environment variables using `loadEnvFile` and `projectlib` (see `src/lib/constants.ts`);
  - exposes `dbConnect()`, `getListsByUser()`, `addList()`, `updateList()`, `delList()` which call into the accessor.
- Example usage pattern (follow `db.ts`): call `dbConnect()` if `adb.db?.isConnected()` is false, then call accessor methods (e.g. `adb.db.find(schema, collection, "owner = :uid", { bind: { uid: user } })`).

Project-specific conventions
- Scripts: `package.json` uses a small wrapper pattern via `config.exec` (`npx tsx npm/run`) and other `npm_package_config_*` variables. When modifying scripts, prefer reusing these config entries.
- TypeScript: `tsconfig.json` extends `.svelte-kit/tsconfig.json` and sets `allowJs` and `checkJs` to true. Keep alias usage via `$lib` and SvelteKit conventions.
- Env loading: server code often calls `loadEnvFile` with `.${projectlib}/server/.env` — inspect `src/lib/constants.ts` (the `projectlib` value is important when resolving file locations).

Integration & external deps to note
- Uses `better-sqlite3` for SQLite and `@mysql/xdevapi` for MySQL (X DevAPI). Be careful when changing DB queries — README warns some queries may need transactions for other DBs.
- Uses `@oslojs/*` and `@pilcrowjs/*` libs for crypto, encoding and validation. Check `package.json` before upgrading.

Notable runtime behavior & gotchas
- Emails are logged to console (no real mailer configured). See README.
- Rate limiting implemented with an in-memory `Map` — not suitable for multi-instance deployments.
- Passkeys (WebAuthn) demo only works on `localhost:5173` unless host/origin updated (see README TODO).
- Code intentionally duplicates some 2FA logic to remain simple; some error handling and logging are TODOs.

When making changes
- Preserve the `src/lib/server` structure and follow the existing `db.ts` accessor pattern when adding new DB callers.
- For server-side env values, prefer `loadEnvFile` usage consistent with current files so envs are loaded in the same way.
- Use `svelte-check` (`npx sv check` or `pnpm run check`) before pushing — the project's scripts invoke checks automatically.

Files to inspect for examples
- `README.md` — project setup and notes.
- `src/lib/constants.ts` — path & origin constants used widely.
- `src/lib/server/database/MySQLXAccessor.ts` and `src/lib/server/database/db.ts` — DB accessor patterns and usage.
- `src/lib/server/auth/*` — auth-related helpers (encryption, oauth, webauthn flows).

If anything above is unclear or you want more examples (e.g., exact env variables, DB schema notes from `setup.sql`, or a short walkthrough for adding a new endpoint), tell me which area to expand and I will iterate.
