# Dr Stevens business dashboard

The app now uses a Node.js backend with Supabase Postgres, Supabase Auth and Supabase Storage. Product management, order enquiries, order updates, customer history, inventory and analytics all use real data. No payment provider or automatic message delivery is connected.

## Open locally

- Website: http://127.0.0.1:4173/
- Dashboard: http://127.0.0.1:4173/admin/
- Private admin credentials: `storage/admin-login.txt` (ignored by Git).

Run `./start-local.ps1` in PowerShell to start the hidden background preview. Use `./start-local.ps1 -Restart` after backend changes. Logs are in `storage/preview.log` and `storage/preview-error.log`. Alternatively run `npm start` in an open terminal. Requires Node.js 24. No npm dependencies are needed.

## Configuration

Copy `.env.example` to `.env` for a fresh installation. The current project is configured in the private `.env` file. `DATA_BACKEND=supabase` selects the real hosted database. The server key stays on the server and is never embedded in client scripts, HTML or URLs. Never commit `.env`, `storage/` or credentials.

Schema: `supabase/schema.sql`. Anonymous and authenticated client roles have no direct access to orders, customer details, administrator membership or products. The backend uses the server key after checking the administrator's session. The photo bucket contains public product images only. Do not upload customer documents or private medical records.

Admin sign-in uses Supabase Auth. A user must also be in `public.product_admins`; creating an Auth user alone does not grant dashboard access. The dashboard shows approved administrators under Settings & access. Change/reset the password using Supabase Auth. There is no public registration or customer account login. Customer records are derived from order enquiries and grouped by phone number.

## Daily work

- **Overview:** real counts, recent enquiries, order pipeline and seven-day activity.
- **Products:** search, status filters, edit existing products, new products, up to eight photos, select a cover image, preview, drafts, publish, archive and restore by changing status. The product URL stays fixed after the first save. Product copy is plain text and escaped in HTML. Category and format come from controlled selections shared with server validation. New drafts need only a name; publishing requires name, category, format, description, pack size, ingredients, allergens, usage, suitability, warnings, storage instructions, a photo and its description. A visible checklist links to missing fields. Botanical names and shelf-life information can also be supplied. Optional SKU values must be unique. Existing imported live products retain their visibility; inventory-only adjustments do not unpublish them, while new publication or content changes must meet the full checklist.
- **Orders:** checkout enquiries and manually entered enquiries, search/filter, full details and item snapshots, status history, agreed totals/currency, payment records, carrier/tracking and internal notes. Concurrent edits are rejected rather than silently overwriting another saved edit.
- **Customers:** directory, contact links and a customer's order history. Contact information is restricted to the authenticated dashboard.
- **Inventory:** SKU, optional stock counts, low-stock filters, out-of-stock checks and internal reference prices. Blank stock means untracked. Stock is managed manually; enquiries do not reserve or automatically deduct it. Checkout rejects quantities exceeding recorded stock. Reference prices do not create an online payment or change the enquiry-only sales process.
- **Analytics:** 7/30/90-day enquiry trends, requested units, delivery counts, delivery rate, most-requested products and manually recorded paid totals separated by currency. These are order metrics, not visitor analytics or payment verification.
- **Activity:** chronological order milestones, workspace search (Ctrl/Cmd K) and attention indicators for new enquiries and low stock.
- **Settings:** business name and reply email used when preparing customer messages; administrator access and database connection details. These communication preferences are stored locally in the server's SQLite settings database; persist `storage/` across server deployments to retain them.

Changing an order status saves it and records history. WhatsApp/email buttons prepare a message using the saved status and shipping details. Review and send in the chosen app. Nothing is automatically sent. There is no external delivery receipt or open/click tracking. Recording payment is a manual note, not proof that money was received.

Checkout saves an enquiry only when the customer explicitly submits the reviewed details with consent. It returns an order reference before opening contact choices. Retries use the same request key to avoid duplicate orders. It does not confirm a purchase or collect payment. The public privacy wording describes the storage of customer/order information.

## Deploy publicly

Supabase hosts the database, Auth and photos; it does not host this Node application. GitHub Pages and a static Sites upload cannot run the new server API. Deploy `site/server.mjs` on a Node-capable host. Set `HOST=0.0.0.0`, the host's `PORT`, `DATA_BACKEND=supabase`, the two Supabase variables, `NODE_ENV=production`, and `PUBLIC_ORIGIN=https://your-actual-domain`. Put HTTPS in front of the app. The production origin controls CSRF checks and secure cookies. Persist `storage/` for local settings, rate limits and sessions. Public product pages are rebuilt from Supabase when the process starts and after changes, with periodic reads for changes made in another instance.

A Dockerfile at the repository root packages the Node app for a container host. Its build excludes local secrets, credentials and database files. Supply secrets through the host’s environment settings, and mount a persistent volume at `/app/storage`.

Do not publish the local preview URL as a public URL. No public deployment has been made by this implementation.

## Verification

`node manual-order-check.mjs` verifies manual order entry, customer profiles and sign-out in an isolated local database; it never touches Supabase.

`npm test` verifies the generated static routes/assets. `node --env-file=.env snapshot-admin.mjs` checks sign-in and renders a screenshot without creating product/order records. `node --env-file=.env admin-check.mjs` runs the end-to-end Supabase workflow; **run only in an explicitly authorized test project/workflow**. It creates labelled QA product/photo/order records, does not send messages, and removes only those exact records afterward. Screenshots go to ignored `test-results/`.

For a fresh database run the schema, then `node --env-file=.env bootstrap-cloud.mjs` once. It preserves existing products and existing Auth users. A newly created initial admin's credentials are written to ignored local storage. `import-supabase.mjs` imports catalogue products without replacing rows already present.

Back up your Supabase database separately and arrange a retention/deletion policy for real customer records before public launch. The free plan does not include automatic database backups.
