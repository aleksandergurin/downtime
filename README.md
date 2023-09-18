Run:
```bash
docker compose up
```

You can access application by pointing your browser to http://localhost:8080.

Connect to Django app container:
```bash
docker compose exec backend bash
./manage.py migrate
```

Connect to database container:
```bash
docker compose exec db bash
psql -U postgres
```

Remove docker volumes (to clear database):
```bash
docker compose down --volumes
```
