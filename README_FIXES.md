# BuildTrack — Security Fixes (Oct 22, 2026)

3 security issues fixed. Copy these files over your project (keep the folder structure).

## What changed

### 1. `server/controllers/authController.js` — Register role locked down (CRITICAL)
- **Before:** anyone could register with `role: "builder"` and get full admin access, bypassing all role checks.
- **After:** public registration always creates a `"labour"` account. Builder/supervisor accounts come from seed data (`npm run seed`) or must be created by an existing admin.
- Also added: required-field validation (name/email/password) with a clear 400 error, and `generateToken` now throws if `JWT_SECRET` is missing instead of using a default.

### 2. `server/middleware/auth.js` + `server/server.js` — JWT secret fallback removed (CRITICAL)
- **Before:** code fell back to a hardcoded JWT secret (`"[REDACTED - old leaked secret, rotated]"`) when `JWT_SECRET` was unset — and that secret was committed in `.env`, so anyone with the code could forge login tokens.
- **After:** no fallback anywhere. `server.js` fails fast at startup with a clear error if `JWT_SECRET` is missing.

### 3. `.gitignore` (new, project root)
- Keeps `node_modules/`, `.env`, `dist/`, `uploads/`, `server/data/`, Python venvs, `*.pth` model files, and logs out of git.

### 4. `server/.env.example` (new)
- Template showing required variables. Copy to `.env` and fill in.

## What YOU must do

1. **Change your JWT_SECRET right now** — the old one was in the committed `.env`, so treat it as compromised. Run:
   ```
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   and put the output as `JWT_SECRET` in `server/.env`.
2. **If you already pushed to GitHub with the old `.env`:** run `git rm --cached server/.env` (and consider scrubbing history or rotating anything else that was exposed).
3. **Delete `MONGO_URI` from your `.env`** — it's dead config (the app uses the embedded JSON store, not MongoDB).
4. **Optional cleanup:** delete `client/dist/` and `client/gen_*.cjs` from the repo (they're build output / scaffolding, now covered by `.gitignore`).
5. **Test:** `cd server && npm run seed && npm start`, then register a new user and confirm the created account has role `"labour"` (not builder).

## Not changed (your call)
- CORS (`origin: "*"` + `credentials: true`) — works in dev via Vite proxy, will break on real deploy. Say the word and I'll fix it.
- README's "MongoDB/Mongoose" claim — the DB is actually a JSON file store. Fix the README or migrate to real MongoDB.
- JWT 30-day expiry — fine for a demo; use refresh tokens for production.
