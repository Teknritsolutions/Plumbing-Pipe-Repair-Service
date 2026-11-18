# Customization

## Design tokens

Edit :root in assets/css/style.css for colors, typography, spacing, container width and border radii. Primary is #12304A; secondary is #087E8B. Dark-mode surface and text tokens are in dark-mode.css. The brighter dark-mode teal is used for readable text; filled buttons retain the deeper teal for white-label contrast. Body uses locally bundled Inter; headings use Manrope. Font licenses are included.

## Images and branding

Every photographic placement has its own path. See image-inventory.json for subject and intended page. Landscape source images are approximately 3:2; components use object-fit:cover with responsive aspect ratios. Replace a main .webp and its -480.webp variant together, preserving the subject-safe crop. Keep explicit dimensions and descriptive alt text. Use eager loading only for the primary hero. Current generated subjects should not be represented as actual staff, customers, property inspections or documented repair results.

SVG logos, light/dark versions, compact mark, SVG/PNG favicons and Apple touch icon are in assets/images/branding/. Update the header and footer together when changing the wordmark.

## Forms

In assets/js/forms.js, replace the empty endpoint values for booking, quote, emergency and newsletter with HTTPS URLs configured for those form types. The script sends FormData with Accept: application/json. Formspree accepts this workflow once a form ID and allowed domain are configured. For a custom endpoint, return a 2xx HTTP status only after the request is accepted. Do not place server secrets in client JavaScript. Use a separate configuration script loaded before forms.js if preferred.

For Netlify, add the provider's required static form name/data-netlify and hidden form-name field, then adapt the submission encoder according to the provider's setup. The delivered script does not pretend this provider is configured.

Keep required labels and error spans. Phone validation accepts 7–15 digits with ordinary international formatting; preferred dates must be today or later. Empty, malformed, loading, network error, demo-valid and successful connected states are implemented. Requests and newsletter entries are never stored in browser storage. Only theme and direction preferences are stored.

Before launch, update the visible demo form notices to explain your real data flow and link your privacy information. Configure server-side validation, abuse protection and delivery monitoring at your chosen backend. Test a real delivery before accepting requests.

## Dark mode and RTL

Theme initialization runs in the head. It uses system preference until the user chooses a mode, then persists stackly-theme. Clear that storage entry to restore system behavior. Direction persists as stackly-direction. Set html dir="rtl" for an RTL-first deployment and adjust the initial fallback in rtl.js. Layouts use logical margins, padding, borders and grid flow. Typography remains English; this is directional layout support, not a language translation. Custom layouts do not depend on Bootstrap physical left/right utility classes.

## Metadata and deployment URL

Set site.config.json siteUrl to your real origin and optional repository subpath, without a trailing slash, then rebuild. SITE_URL environment variable overrides the file. No fabricated business structured data is included: WebPage schema describes each page. Configure the example.com sitemap before deployment.

## Contact, map and social profiles

Replace the reserved example email, sample telephone, business hours and sample service district in scripts/build.cjs. Replace the map placeholder with a verified provider embed, give it a title, and consider loading it only after visitor consent where required. Replace the social setup link with your actual public profile URLs. Do not add invented company locations, reviews or certification claims.
