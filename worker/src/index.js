/* ParkKo PayMongo proxy — Cloudflare Worker.
 *
 * The PayMongo SECRET key must never touch the client or the repo. It lives
 * as an encrypted Worker secret (PAYMONGO_SECRET_KEY), set via:
 *   npx wrangler secret put PAYMONGO_SECRET_KEY
 * The browser only ever talks to this Worker; the Worker talks to PayMongo.
 *
 * Endpoints:
 *   POST /create-source   -> create a GCash/GrabPay source, return checkout URL
 *   GET  /source-status    -> poll a source's status (chargeable / paid / failed)
 *   POST /pay-source       -> create a payment from a chargeable source
 *
 * Test mode only: use an sk_test_... key. No real money moves.
 */

const PAYMONGO_API = 'https://api.paymongo.com/v1';

// Only these origins may call the Worker (prevents other sites using your key).
const ALLOWED_ORIGINS = [
  'https://aiinterruptor.github.io',
  'http://localhost:8000',
  'http://127.0.0.1:5500',
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(origin) });
}

// Basic auth header PayMongo expects: base64(secretKey + ':')
function authHeader(secret) {
  return 'Basic ' + btoa(secret + ':');
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (!env.PAYMONGO_SECRET_KEY) {
      return json({ error: 'Worker not configured: PAYMONGO_SECRET_KEY missing.' }, 500, origin);
    }
    const auth = authHeader(env.PAYMONGO_SECRET_KEY);

    try {
      // --- Create a GCash / GrabPay source ---
      if (url.pathname === '/create-source' && request.method === 'POST') {
        const { amount, type, redirectSuccess, redirectFailed, description } = await request.json();
        // PayMongo amounts are in centavos; guard the minimum (₱20).
        const centavos = Math.round(Number(amount) * 100);
        if (!centavos || centavos < 2000) {
          return json({ error: 'Amount must be at least ₱20.' }, 400, origin);
        }
        if (!['gcash', 'grab_pay'].includes(type)) {
          return json({ error: 'Unsupported source type.' }, 400, origin);
        }
        const res = await fetch(`${PAYMONGO_API}/sources`, {
          method: 'POST',
          headers: { Authorization: auth, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: {
              attributes: {
                amount: centavos,
                currency: 'PHP',
                type,
                redirect: { success: redirectSuccess, failed: redirectFailed },
                description: description || 'ParkKo parking booking',
              },
            },
          }),
        });
        const data = await res.json();
        if (!res.ok) return json({ error: data.errors?.[0]?.detail || 'PayMongo error.' }, res.status, origin);
        return json({
          id: data.data.id,
          checkoutUrl: data.data.attributes.redirect.checkout_url,
          status: data.data.attributes.status,
        }, 200, origin);
      }

      // --- Poll a source's status ---
      if (url.pathname === '/source-status' && request.method === 'GET') {
        const id = url.searchParams.get('id');
        if (!id) return json({ error: 'Missing source id.' }, 400, origin);
        const res = await fetch(`${PAYMONGO_API}/sources/${id}`, {
          headers: { Authorization: auth },
        });
        const data = await res.json();
        if (!res.ok) return json({ error: data.errors?.[0]?.detail || 'PayMongo error.' }, res.status, origin);
        return json({ id, status: data.data.attributes.status }, 200, origin);
      }

      // --- Turn a chargeable source into an actual payment ---
      if (url.pathname === '/pay-source' && request.method === 'POST') {
        const { sourceId, amount, description } = await request.json();
        const centavos = Math.round(Number(amount) * 100);
        const res = await fetch(`${PAYMONGO_API}/payments`, {
          method: 'POST',
          headers: { Authorization: auth, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: {
              attributes: {
                amount: centavos,
                currency: 'PHP',
                source: { id: sourceId, type: 'source' },
                description: description || 'ParkKo parking booking',
              },
            },
          }),
        });
        const data = await res.json();
        if (!res.ok) return json({ error: data.errors?.[0]?.detail || 'PayMongo error.' }, res.status, origin);
        return json({
          id: data.data.id,
          status: data.data.attributes.status,
          paid: data.data.attributes.status === 'paid',
        }, 200, origin);
      }

      return json({ error: 'Not found.' }, 404, origin);
    } catch (err) {
      return json({ error: 'Worker error: ' + err.message }, 500, origin);
    }
  },
};
