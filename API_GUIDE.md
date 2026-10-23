# Frontend integration guide

Base URL (dev): `http://localhost:8000`
Interactive docs: `/api/docs/` (Swagger) · `/api/redoc/` · raw spec: `/api/schema/` or `openapi.yml`
(Generate TS types: `npx openapi-typescript openapi.yml -o api.d.ts`)

## Auth
1. `POST /api/auth/register/` `{username, email, password}` → `{token, user}`
   or `POST /api/auth/login/` `{username, password}` → `{token}`
2. Send on every authenticated request: `Authorization: Token <token>`
3. Reads (`GET /api/items/`, `/api/categories/`) work without a token.

## Posting an item (multipart so image upload works)
```js
const fd = new FormData();
fd.append('kind', 'found');            // 'lost' | 'found'
fd.append('title', 'Blue wallet');
fd.append('description', '...');
fd.append('category', 3);              // category id, optional
fd.append('location', 'Library');
fd.append('date_occurred', '2026-10-22');  // YYYY-MM-DD, not in the future
fd.append('image', file);              // optional, max 5 MB
fetch(`${API}/api/items/`, { method: 'POST', headers: { Authorization: `Token ${t}` }, body: fd });
```
Do NOT set Content-Type manually with FormData. JSON also works if there is no image.

## Lists
Paginated: `{count, next, previous, results}`, 20 per page, `?page=2`.
Query params on `/api/items/`: `kind`, `status` (open|claimed|resolved), `category`, `search`, `ordering` (`created_at`, `-date_occurred`...).
`image` is a full URL (or null). Each item has `is_owner` so the UI can show edit/delete/resolve.

## Claim flow
- `POST /api/items/{id}/claim/` `{message}` — any logged-in non-reporter, item must be open, one claim per user.
- Reporter: `GET /api/items/{id}/claims/` → `POST /api/claims/{id}/approve/` or `/reject/`.
- `GET /api/claims/` → claims I made + claims on my items. `contact_email` is `null` until a claim is approved, then each side sees the other's email.
- `GET /api/items/mine/` → my posts. `POST /api/items/{id}/resolve/` closes one.

## Errors
- 400 validation: `{field: ["msg"]}` or `["msg"]` for non-field errors
- 401 missing/invalid token · 403 not allowed (e.g. not the reporter) · 404 not found · 429 throttled
- Auth endpoints are limited to 10 req/min per IP.

## CORS
Backend allows `http://localhost:3000` and `http://localhost:5173` by default.
Other origins: `CORS_ALLOWED_ORIGINS=https://my-frontend.com,http://localhost:4200`
