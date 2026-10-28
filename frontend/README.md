# JobPortal frontend

The React app uses the Django API on the same origin. When running Vite locally,
the `/api` and `/register` paths are proxied to `http://127.0.0.1:8000`.

## Development

Start Django from `backend`, then start Vite from `frontend`:

```text
python manage.py runserver 127.0.0.1:8000
npm run dev
```

## Production assets

From `frontend`, run `npm run build`. Vite writes the assets to
`backend/static/frontend`, which is referenced by Django's application template.
Then run `python manage.py collectstatic --noinput` from `backend` before
starting or restarting Django so its static-file manifest includes the build.
