# Mekong District lead proxy

Cloudflare Worker placed between the public landing page and Google Apps Script.

It restricts browser origins, validates lead fields, uses a honeypot, limits repeated submissions, and keeps the Google Apps Script URL in the encrypted `SHEETS_ENDPOINT` secret.

Deploy with Wrangler, set `SHEETS_ENDPOINT`, then update the landing page endpoint to the resulting `/lead` URL.

Cloudflare Builds deploys this Worker automatically from the `main` branch.
