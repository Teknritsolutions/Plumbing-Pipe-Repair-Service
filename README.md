# Stackly Plumbing & Pipe Repair

A complete, buildless HTML5 template with two home pages and ten supporting pages. The root index.html renders Home Page 1 directly. No dashboard or account pages are included.

## Open the website

Open index.html directly, or run `npm start` and visit http://127.0.0.1:4173. Node.js 20+ is needed only for development tools, not for static hosting.

## Contents

- Two distinct home pages, with exactly ten main sections each.
- About, Services, Pipe Repair Details, Pricing, Emergency and Contact: six sections each.
- Journal and Article: five sections each.
- Illustrated 404 and Coming Soon pages.
- 41 unique, locally saved AI-generated photographs with optimized WebP variants.
- Bootstrap 5.3, local Inter/Manrope fonts, original SVG branding and favicons.
- Persistent light/dark and LTR/RTL settings, accessible dropdowns and accordions, journal search and filters, problem selector and validated forms.

## Edit and rebuild

The delivered HTML is ready to edit and deploy. `scripts/build.cjs` is the optional source generator. If you edit generated HTML directly, rebuilding overwrites those edits. Change the generator for repeatable builds. Run `npm run build`, then format with Prettier.

Set your actual deployment URL in site.config.json and rebuild to generate canonical metadata, sitemap and robots URLs. The default sitemap uses example.com and must be configured before launch.

## Form behavior

Forms validate locally. Without configured endpoints, no information is submitted or persisted. Set the appropriate `window.STACKLY_FORM_ENDPOINTS` entries in assets/js/forms.js to enable a configured HTTPS service. Successful submission does not imply a confirmed appointment. See documentation/customization.md.

## Demo content

Business information, prices, packages, team identities, testimonials, locations and coverage are explicitly illustrative. Replace them and verify credentials, availability and terms before commercial launch. The map is an integration placeholder, not a real location. No real social accounts were supplied; the footer links to the contact setup note instead of inventing profiles.

## Documentation and QA

Read documentation/installation.md, customization.md, page-structure.md, image-credits.md and qa-report.md. Automated results are in tests/audit-report.json; screenshots are in tests/screenshots/.

For a fresh test environment, run `npm install`, `npx playwright install chromium`, start the preview server, then `npm test`. Tests use installed Chrome by default; set BROWSER_CHANNEL=msedge to select Edge. See QA notes for browsers actually tested and limitations. Performance targets are not claims of measured Lighthouse scores.
