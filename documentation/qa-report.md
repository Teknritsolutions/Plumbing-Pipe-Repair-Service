# QA report — November 12, 2026

## Verified results

- 12 distinct pages plus the functional root Home 1 entry (13 HTML routes).
- Both home pages have exactly 10 direct main sections. About, Services, Details, Pricing, Emergency and Contact have 6; Journal and Article have 5. Special pages have one composed section.
- Chrome 157.0.8103.39: 780 page/width/theme/direction combinations passed overflow, clipping and equal-container-margin checks.
- The width set was 320, 360, 375, 390, 420, 480, 640, 768, 820, 1024, 1100, 1101, 1280, 1440 and 1920 pixels. All pages were checked in light/LTR, dark/LTR, light/RTL and dark/RTL.
- 52 axe WCAG 2 A/AA and 2.1 AA automated audits passed with zero reported violations. Three additional query-selected journal articles passed their accessibility checks.
- Edge 157.0.4341.42: 156 combinations across every route, three representative widths, both themes and both directions passed overflow checks.
- Navigation dropdowns, Escape behavior, mobile nested menus, persistent theme and direction, problem tabs and keyboard selection, FAQ controls, journal search/category filtering/no-results, and all frontend form types passed.
- Empty fields, invalid phone/email, past dates and valid demo states passed. Loading/disabled, HTTP 500 error and HTTP 200 accepted-request states were checked with intercepted mock endpoints. No external booking or subscription was submitted.
- All referenced local assets and internal page targets resolve. Every route has one H1, alt attributes and no duplicate IDs. No JavaScript page errors were reported.
- 41 original photographs have 41 unique SHA-256 hashes. The static pages have 38 distinct photographic placements; three additional photographs support article variants. Responsive sizes and the intentional root/inner Home 1 alias are not separate editorial placements.
- Photographs were inspected in a contact sheet. Desktop and mobile dark/RTL screenshots were captured for all routes, with separate diagnostic and article screenshots.
- Visual QA prompted corrections to teal small-text contrast, emergency breadcrumb contrast, checklist character encoding, hero crop and mirrored Latin text/telephone handling. Pricing factors use a complete four-card desktop row.

Machine-readable results: tests/audit-report.json, tests/edge-report.json and tests/asset-report.json. Screenshots are in tests/screenshots/. Reproduce with the scripts in tests/ while the local server is running.

## Reference access

All five supplied reference URLs were attempted with the web tool before development. Each returned an access/internal error, so no claims about their pages, spacing or responsive behavior were made. Development followed the detailed supplied specification instead.

1. https://teknritsolutions-2.github.io/Local-Farm-or-Community-Supported-Agriculture-CSA-/pages/public/index.html
2. https://teknrit-maker.github.io/High-End-Event-Planning/pages/index.html
3. https://teknrit-maker.github.io/Local-Indie-Bookstore/pages/index.html
4. https://teknrit-maker.github.io/FoodTruck/Pages/menu.html
5. https://ravivarmaadepu123.github.io/boutique-yarn-and-craft-supply/pages/

## Verification limits and launch configuration

Firefox and Safari were unavailable and were not tested. Chrome and Edge are both Chromium-based, so this does not establish cross-engine compatibility. No Lighthouse run, field performance measurement, screen-reader certification or claim of complete WCAG conformance is made. Automated accessibility results complement, rather than replace, assistive-technology testing.

Forms have no production endpoints. Actual email delivery, spam controls, booking confirmation and newsletter storage are not configured. The map and social-profile configuration need actual company details. The example.com sitemap must be rebuilt with the deployment URL. Hosting must map the error page to an HTTP 404. No deployment was requested or performed; the complete local template is the deliverable.

The QA tools used existing locally installed development packages through NODE_PATH. A fresh checkout can install the versions in package.json with npm install. The Playwright bundled browser revision was not available; installed Chrome and Edge channels were used instead. The source project remains independent of the neighboring project's runtime or assets.

Final link refinement: seven non-pipe catalog links now open the booking form with the correct service preselected; Pipe Repair opens its detailed guide. Both related-article links open the corresponding full journal entries. Ten destinations passed targeted browser checks; see tests/link-interaction-report.json.
