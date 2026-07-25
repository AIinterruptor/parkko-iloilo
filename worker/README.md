# ParkKo PayMongo Worker

A tiny Cloudflare Worker that proxies PayMongo test-mode payments so the
**secret key never lives in the public app**. The browser calls this Worker;
the Worker holds the secret and calls PayMongo.

## Deploy (one time)

```bash
cd worker
npm install -g wrangler          # if not installed
npx wrangler login               # opens browser, log into Cloudflare
npx wrangler secret put PAYMONGO_SECRET_KEY
#   -> paste your sk_test_... key at the prompt (test mode, no real money)
npx wrangler deploy
```

`wrangler deploy` prints the Worker URL, e.g.
`https://parkko-paymongo.<your-subdomain>.workers.dev`.
Put that URL into `PAYMONGO_WORKER_URL` in `src/app.jsx`, then rebuild the app.

## Getting your test secret key

PayMongo Dashboard → Developers → API Keys → **Test mode** → copy the
**Secret key** (`sk_test_...`). Never paste it into chat, code, or the repo —
only into the `wrangler secret put` prompt above.

## Endpoints

- `POST /create-source` — start a GCash/GrabPay checkout, returns `checkoutUrl`
- `GET  /source-status?id=...` — poll until `chargeable`
- `POST /pay-source` — charge a chargeable source

Test mode moves no real money. PayMongo shows a simulated authorize page.
