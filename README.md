This application has React frontend and Django backend.
Nginx used in docker compose as a proxy to serve both frontend and backend under the
same name `localhost:8080`. REST API has the following endpoints:
- `api/downtime/resources` GET, POST
- `api/downtime/resources/<resource_id>` GET, DELETE
- `api/downtime/resources/<resource_id>/timeline` GET
- `api/login`
- `api/logout`
- `api/whoami/`
- `api/csrf/`
- `admin/`

Architecture:
![Architecture](diagram.png)

Run:
```bash
docker compose up
```

After that connect to the `backend` application:
```bash
docker compose exec backend bash
```

Inside the `backend` container apply DB migrations and create Django's super user:
```bash
./manage.py migrate
./manage.py create superuser
```

You can access application at http://localhost:8080.
Admin page accessible at http://localhost:8080/admin/ there you can create a new test user.

You can connect to the database container with:
```bash
docker compose exec db bash
psql -U postgres
```

To shut down application and remove all the data:
```bash
docker compose down --volumes
```
