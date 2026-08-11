# Just Ours Love

The shared storefront for Love Mailbox, Paw Love, and Unseal.

## Development

```bash
pnpm install
pnpm dev
```

For the local Love Mailbox modal preview, run its repository on `127.0.0.1:3411`. The showcase remains on `127.0.0.1:3400`.

## Production

The production stack contains the standalone Next.js application, Umami, and a
private PostgreSQL database. Published ports bind to `127.0.0.1`; TLS and public
hostnames stay in the host reverse proxy.

### First server setup

Requirements: Docker Engine with Compose v2, GNU Make, Git, and curl. Clone the
repository on the production host, then create the environment file:

```bash
make init
$EDITOR .env
```

Replace every placeholder. `UMAMI_DB_PASSWORD` is the raw PostgreSQL password.
Put the same password in `UMAMI_DATABASE_URL`, URL-encoding reserved characters
such as `/`, `#`, `%`, `$`, `@`, and `:`. Single-quote the raw value in `.env` if
it contains `$` or `#` so Compose treats it literally. Keep `.env` mode `0600`.

Validate the host configuration without starting containers:

```bash
make config
```

### Deploy

Run deployments from the checked-out repository on the production Docker host:

```bash
git pull --ff-only
make deploy
```

`make deploy` creates an immutable local showcase image tag from the UTC timestamp
and Git revision, pulls the pinned third-party images, starts the stack, waits for
all container health checks, and probes the published application endpoint. The
successful and previous release tags are kept under `.deploy/`.

CI may provide an explicit tag:

```bash
make deploy RELEASE=2026.08.11-1a2b3c4d
```

If the new release fails its health check, the script automatically restores the
previous locally available showcase image. Manual rollback uses the same state:

```bash
make rollback
```

Rollback changes the application image only. It never removes `umami-db` or the
Next.js cache volume. Back up PostgreSQL before upgrading the pinned Umami version
because database migrations may not be backward compatible.

### Operations

```bash
make ps                 # container state and health
make health             # application health response
make logs               # all logs
make logs SERVICE=showcase
make restart             # recreate services and wait for health
make down                # stop containers, preserve volumes
```

Before deploying changed application code, run the local release checks:

```bash
make verify
```

Route `justours.love` to `127.0.0.1:${SHOWCASE_PORT}` and
`analytics.justours.love` to `127.0.0.1:${UMAMI_PORT}` in the TLS reverse proxy.
Forward the original `Host`, `X-Forwarded-For`, and `X-Forwarded-Proto` headers.
Do not expose PostgreSQL.

After the first start, change the initial Umami admin password immediately. Add
the generated website ID to `NEXT_PUBLIC_UMAMI_WEBSITE_ID` and deploy again; this
value is embedded into the showcase during its Docker build.

An optional Caddy edge stack is provided under `deploy/caddy`. Run it after the
application network exists, setting `APP_NETWORK` when the application Compose
project is not named `justours-app`:

```bash
docker compose -f deploy/caddy/compose.yml config --quiet
docker compose -f deploy/caddy/compose.yml up -d
```

Application commands explicitly select `docker-compose.yml`, so a colocated edge
stack such as `compose.yml` cannot be selected accidentally by Compose discovery.

The low-level equivalent of `make deploy` is:

```bash
ENV_FILE=.env WAIT_TIMEOUT=180 ./scripts/deploy.sh deploy
```

## Future shared account

The planned identity provider lives at `accounts.justours.love`. Every app is a separate OIDC client using Authorization Code + PKCE, exact redirect/logout URIs, and `ui_locales`. Apps must not share access tokens or a wildcard-domain session cookie.
