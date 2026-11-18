# Installation and deployment

1. Copy the project to a local directory.
2. Open index.html, or install Node.js 20+ and run `npm start` for an HTTP preview at port 4173.
3. No production npm dependencies, build step, CDN connection or API key are required.
4. Upload index.html, pages/, assets/, robots.txt and sitemap.xml to your static host, preserving paths and filename case.
5. For a repository subpath, set siteUrl to the complete subpath URL in site.config.json and rebuild.
6. Configure a custom 404 route with your host to serve pages/404.html. Linking to that page alone does not configure an HTTP 404 response.
7. Replace all sample company data and connect forms before launch. Check endpoint origin/CORS, spam protection, privacy requirements and email delivery with your chosen provider.

The source root is the requested project folder; no redundant stackly-plumbing wrapper directory was added. index.html and pages/index.html represent the same Home Page 1 entry. This intentional alias is the only duplicate photo placement; separate editorial pages never share photography.

## Optional development tools

Run `npm install` to install declared QA dependencies. Run `npm run build` to regenerate HTML and SEO assets from scripts/build.cjs and scripts/finalize.cjs. `npm start` serves only on 127.0.0.1. The test suite expects that server to be running. It launches Chrome by default and stores QA artifacts under tests/.

Source files are formatted with Prettier 3.6.2. Bootstrap is vendored in assets/css/bootstrap.min.css and intentionally remains the upstream minified distribution.

## Third-party licenses

Bootstrap 5.3.3: MIT, https://github.com/twbs/bootstrap/blob/v5.3.3/LICENSE .
Inter and Manrope: SIL Open Font License, included in assets/fonts/.
Playwright: Apache-2.0; axe-core: MPL-2.0; Prettier: MIT. These are development-only tools. Original template source has no third-party template code.

Lucide 0.468.0 icons are included as inline SVG in the guarantee strip. Official source SVGs and ISC/Feather license notices are in assets/images/icons/. Bootstrap's full MIT license is in assets/css/bootstrap-LICENSE.txt.

Article variants: blog-details.html?article=drains, ?article=taps and ?article=seasonal select distinct full editorial entries and unique feature photos. The main article is present as static HTML; these demo variants require JavaScript.
