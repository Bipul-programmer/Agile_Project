# Campus Lost & Found — Full Stack Project

A campus-focused Lost & Found application featuring a Django REST Framework backend and a React + Tailwind CSS frontend designed after the modern "FindIt - Campus Lost & Found" mobile experience.

## Frontend (React + Vite + Tailwind CSS)

The frontend is located in the [`frontend/`](file:///Users/bipulkumar/Desktop/Agile_Project/frontend) directory.

### Quick Start
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Features
- **3-Screen Dribbble Showcase**: View the exact side-by-side 3-screen presentation (Feed & Discovery, Report item !, Possible match & verification) as designed.
- **Interactive Mobile & Responsive Web**: Seamlessly toggle between side-by-side showcase, interactive single-device simulation, and responsive wide view.
- **Full Backend API Integration**: Preconfigured to connect to `http://localhost:8000` via Vite proxy with Token authentication.
- **Offline / Demo Resilience**: Includes fallback mock data and local persistence so the app can be fully explored and tested even when the Django backend is offline.

---

## Backend (Django REST Framework)

### Run
```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_categories
python manage.py createsuperuser
python manage.py runserver
```
Interactive docs: `/api/docs/` (Swagger) · `/api/redoc/`.

Env vars: `DATABASE_URL` (default SQLite), `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, `ALLOWED_EMAIL_DOMAIN`, `CORS_ALLOWED_ORIGINS`.

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

