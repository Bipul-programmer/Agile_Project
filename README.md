# Campus Lost & Found — Django REST API

## Run (Fedora)
    python3 -m venv .venv && source .venv/bin/activate
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py seed_categories
    python manage.py createsuperuser
    python manage.py runserver

Frontend devs: see `API_GUIDE.md` and `/api/docs/`.

Env vars: `DATABASE_URL` (e.g. `postgres://user:pass@localhost/lostfound`, default SQLite), `DJANGO_SECRET_KEY`, `DJANGO_DEBUG` (0 in prod), `DJANGO_ALLOWED_HOSTS`,
`ALLOWED_EMAIL_DOMAIN` (e.g. `college.edu`), `CORS_ALLOWED_ORIGINS`.

## Endpoints (auth header: `Authorization: Token <key>`)
| Method | Path | Notes |
|---|---|---|
| POST | /api/auth/register/ | returns token |
| POST | /api/auth/login/ | returns token |
| GET/PATCH | /api/auth/me/ | |
| GET | /api/items/ | public. `?kind=lost&status=open&category=1&search=wallet&ordering=-date_occurred` |
| POST | /api/items/ | multipart (image ok) |
| GET | /api/items/mine/ | my posts |
| GET/PATCH/DELETE | /api/items/{id}/ | write = reporter only |
| POST | /api/items/{id}/resolve/ | reporter |
| POST | /api/items/{id}/claim/ | body `{"message": "proof"}` |
| GET | /api/items/{id}/claims/ | reporter only |
| GET | /api/claims/ | claims I made + claims on my items |
| POST | /api/claims/{id}/approve/ , /reject/ | reporter only; approve → emails revealed to both sides |
| GET | /api/categories/ | |
