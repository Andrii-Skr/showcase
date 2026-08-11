# Just Ours Love

The shared storefront for Love Mailbox, Paw Love, and Unseal.

## Development

```bash
pnpm install
pnpm dev
```

For the local Love Mailbox modal preview, run its repository on `127.0.0.1:3411`. The showcase remains on `127.0.0.1:3400`.

## Production

Copy `.env.example` to `.env`, replace every secret, and start the stack:

```bash
docker compose up -d --build
curl --fail http://127.0.0.1:3000/api/health
```

Route `justours.love` to the showcase port and `analytics.justours.love` to the Umami port in the existing TLS reverse proxy. Change the initial Umami admin password immediately, then add the generated website ID to `NEXT_PUBLIC_UMAMI_WEBSITE_ID` and rebuild the showcase.

Rollback by deploying the previous tagged showcase and Umami images; do not remove the `umami-db` volume.

## Future shared account

The planned identity provider lives at `accounts.justours.love`. Every app is a separate OIDC client using Authorization Code + PKCE, exact redirect/logout URIs, and `ui_locales`. Apps must not share access tokens or a wildcard-domain session cookie.
