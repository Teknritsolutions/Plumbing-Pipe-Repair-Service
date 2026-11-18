const fs = require("fs");
const path = require("path");
const config = JSON.parse(fs.readFileSync("site.config.json", "utf8").replace(/^\uFEFF/, ""));
const origin = (process.env.SITE_URL || config.siteUrl || "").replace(/\/$/, "");
const files = [
    "index.html",
    ...fs
        .readdirSync("pages")
        .filter((file) => file.endsWith(".html"))
        .map((file) => `pages/${file}`),
];
for (const file of files) {
    let html = fs.readFileSync(file, "utf8");
    html = html.replace(
        /<head>/,
        '<head><link rel="stylesheet" href="' +
            (file.startsWith("pages/") ? "../" : "") +
            'assets/fonts/fonts.css">',
    );
    const url = origin
        ? `${origin}/${file === "index.html" || file === "pages/index.html" ? "" : file}`
        : "";
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: html.match(/<title>(.*?)<\/title>/)[1],
        description: html.match(/name="description" content="([^"]*)"/)[1],
        inLanguage: config.language,
    };
    if (url) schema.url = url;
    const canonical = url
        ? `<link rel="canonical" href="${url}"><meta property="og:url" content="${url}">`
        : "<!-- Configure site.config.json siteUrl, then rebuild to add canonical deployment URLs. -->";
    const primaryPhoto = html.match(/<img src="([^"]+\.webp)"/);
    const photoPath = primaryPhoto
        ? path.posix.normalize(path.posix.join(path.posix.dirname(file), primaryPhoto[1]))
        : "assets/images/branding/apple-touch-icon.png";
    if (origin)
        html = html.replace(
            "</head>",
            `<meta property="og:image" content="${origin}/${photoPath}"></head>`,
        );
    html = html.replace(
        "</head>",
        `${canonical}<script type="application/ld+json">${JSON.stringify(schema)}</script></head>`,
    );
    html = html.replace(
        /<h1>Good plumbing\.<br><em>Better peace<br>of mind\.<\/em><\/h1>/,
        "<h1>Good plumbing.<br><em>Better peace of mind.</em></h1>",
    );
    html = html.replace(
        /<img src="([^"]+\.webp)"/g,
        (whole, src) =>
            `<img src="${src}" srcset="${src.replace(".webp", "-480.webp")} 480w, ${src} 1000w" sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1100px) 50vw, 600px"`,
    );
    let iconIndex = 0;
    html = html.replace(/<span class="line-icon" aria-hidden="true">.*?<\/span>/g, () => {
        const iconName = ["shield-check", "receipt-text", "users-round", "clock"][iconIndex++];
        const svg = fs
            .readFileSync(`assets/images/icons/${iconName}.svg`, "utf8")
            .replace("<svg", '<svg aria-hidden="true" focusable="false"');
        return `<span class="line-icon" aria-hidden="true">${svg}</span>`;
    });
    if (file === "pages/blog.html") {
        let count = 0;
        html = html.replace(
            /href="blog-details.html">Read article/g,
            () =>
                `href="blog-details.html?article=${["drains", "taps", "seasonal"][count++]}">Read article`,
        );
    }
    fs.writeFileSync(file, html);
}
const sitemapOrigin = origin || "https://example.com";
fs.writeFileSync(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${files
        .filter((file) => !/404|coming-soon|pages\/index/.test(file))
        .map(
            (file) =>
                `  <url><loc>${sitemapOrigin}/${file === "index.html" ? "" : file}</loc></url>`,
        )
        .join("\n")}\n</urlset>\n`,
);
fs.writeFileSync(
    "robots.txt",
    `User-agent: *\nAllow: /\n\n# Configure siteUrl before deployment.\nSitemap: ${sitemapOrigin}/sitemap.xml\n`,
);
console.log("Applied responsive sources, structured metadata and deployment configuration.");
