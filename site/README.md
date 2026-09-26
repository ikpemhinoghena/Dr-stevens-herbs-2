# Dr Stevens Herbs

Complete responsive static website with 42 authored routes, a shopping bag, full delivery-details checkout, searchable/filterable collections and WhatsApp order enquiries. No framework dependencies or payment service are required.

Run `npm run build` to regenerate all HTML from `build.mjs`, `experience.mjs`, `components.mjs` and `data.mjs`. Run `npm start` for http://127.0.0.1:3000. Run `npm test` for route and asset verification. `node commerce-check.mjs` checks the full flow using the installed Edge browser and bundled Playwright library. Shared styles and browser behavior live in `dist/assets/` and are tracked source assets; do not delete this directory before building.

## Catalogue and launch

Update `data.mjs` with verified product names, botanical identities, ingredients, warnings, pack sizes and pricing before enabling purchases. Current listings introduce herb categories; exact products, details and prices are discussed with Dr Stevens. The bag prepares an enquiry and does not charge or automatically place orders. Illness selection opens consultation guidance, never an invented treatment mapping. Consultation is free, as instructed by the business owner, with a stated aim to reply within an hour. The site includes no unverified practitioner credentials or cure claims.

Supply official social links, clinician biography and credentials, business address/hours, delivery/payment/return terms, and finalized privacy details before public commercial launch. The current deployment is private for review. SEO includes server-delivered HTML, page titles/descriptions, canonical URLs, Organization data, robots and sitemap. Change the origin in `build.mjs` when adopting a custom domain. No card payment processor, inventory system or appointment booking backend is connected.

Navigation compacts into a floating sticky bar after 140px of scrolling, except on checkout. The fixed-height shell prevents layout shifts. The homepage scroll cue links to the collections and supports reduced motion. `navigation-check.mjs` checks this behavior, mobile overflow, focus and current consultation/copy requirements. Footer social icons are non-link placeholders until official URLs are provided; no invented accounts or broken links are used.

## Images and medical references

Hero: Danielle Suijkerbuijk / Unsplash, https://unsplash.com/photos/a-mortar-filled-with-green-leaves-on-top-of-a-table-Eza6E_v2ZYo (Unsplash License). The collection and story photograph is original conceptual artwork generated with built-in imagegen; it does not show actual products. See `ASSETS.md` for the prompt and asset provenance.

General safety wording references NCCIH: https://www.nccih.nih.gov/health/safety and https://www.nccih.nih.gov/health/cancer-and-complementary-health-approaches-what-you-need-to-know. No individualized treatment recommendations are supplied.

Browser-local storage retains collection IDs and quantities only. Checkout collects name, phone, optional email, country, region, city and street address, plus optional postal code and delivery notes. It keeps these details only in the page, validates required fields, previews the order, and lets the visitor edit before opening WhatsApp. The final message contains every cart item and quantity together with contact/delivery details. The visitor must press Send in WhatsApp; no success or order confirmation is fabricated. Copy-message fallback is available. Cross-tab cart changes invalidate a stale review while preserving the form details. Consultation messages follow the same explicit-send approach. WebMCP tools are feature-detected and use the same catalogue and bag actions; native WebMCP validation was unavailable in the test browser.
