const fs = require("fs");
const path = require("path");
const assert = require("assert/strict");
const { chromium } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;
const root = path.resolve(__dirname, "..");
const base = "http://127.0.0.1:4173";
const files = [
    "index.html",
    ...fs.readdirSync(path.join(root, "pages")).map((name) => "pages/" + name),
];
const widths = [320, 360, 375, 390, 420, 480, 640, 768, 820, 1024, 1100, 1101, 1280, 1440, 1920];
const states = [
    ["light", "ltr"],
    ["dark", "ltr"],
    ["light", "rtl"],
    ["dark", "rtl"],
];
const report = {
    date: new Date().toISOString(),
    pages: files.length,
    widths,
    states,
    layoutChecks: 0,
    errors: [],
    accessibility: [],
    interactions: [],
    browsers: [],
};
fs.mkdirSync(path.join(root, "tests/screenshots"), { recursive: true });
function check(value, message) {
    if (!value) report.errors.push(message);
}
(async () => {
    const browser = await chromium.launch({
        channel: process.env.BROWSER_CHANNEL || "chrome",
        headless: true,
    });
    report.browsers.push(await browser.version());
    const context = await browser.newContext();
    const page = await context.newPage();
    const jsErrors = [];
    page.on("pageerror", (error) => jsErrors.push(error.message));
    for (const file of files) {
        await page.goto(base + "/" + file);
        await page.evaluate(async () => {
            document.querySelectorAll("img").forEach((img) => (img.loading = "eager"));
            await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
            await document.fonts.ready;
        });
        const audit = await page.evaluate(() => ({
            h1: document.querySelectorAll("h1").length,
            sections: document.querySelectorAll("main > section").length,
            broken: [...document.images]
                .filter((img) => !img.complete || !img.naturalWidth)
                .map((img) => img.src),
            noAlt: [...document.images].filter((img) => !img.hasAttribute("alt")).length,
            refs: [...document.querySelectorAll("[href], [src]")]
                .map((el) => el.getAttribute("href") || el.getAttribute("src"))
                .filter(Boolean),
            duplicateIds: [...document.querySelectorAll("[id]")]
                .map((el) => el.id)
                .filter((id, i, ids) => ids.indexOf(id) !== i),
        }));
        check(audit.h1 === 1, `${file}: expected one h1`);
        const expected = /(^|\/)index.html$|home-2/.test(file)
            ? 10
            : /404|coming-soon/.test(file)
              ? 1
              : /blog/.test(file)
                ? 5
                : 6;
        check(
            audit.sections === expected,
            `${file}: ${audit.sections} sections, expected ${expected}`,
        );
        check(!audit.broken.length, `${file}: broken images ${audit.broken}`);
        check(!audit.noAlt, `${file}: missing image alt`);
        check(!audit.duplicateIds.length, `${file}: duplicate ids ${audit.duplicateIds}`);
        for (const ref of audit.refs) {
            if (/^(tel:|mailto:|https?:|#|data:)/.test(ref)) continue;
            const target = path.resolve(root, path.dirname(file), ref.split(/[?#]/)[0]);
            check(fs.existsSync(target), `${file}: missing target ${ref}`);
        }
        for (const [theme, dir] of states) {
            await page.evaluate(
                ({ theme, dir }) => {
                    document.documentElement.dataset.theme = theme;
                    document.documentElement.dir = dir;
                },
                { theme, dir },
            );
            for (const width of widths) {
                await page.setViewportSize({ width, height: 900 });
                const layout = await page.evaluate(() => {
                    const containers = [...document.querySelectorAll(".container")].map((el) =>
                        el.getBoundingClientRect(),
                    );
                    const clipped = [
                        ...document.querySelectorAll("h1,h2,h3,p,.button,input,select,textarea"),
                    ]
                        .filter(
                            (el) =>
                                el.getClientRects().length && el.scrollWidth > el.clientWidth + 2,
                        )
                        .map((el) => el.tagName + ":" + el.textContent.slice(0, 45));
                    return {
                        overflow: document.documentElement.scrollWidth > innerWidth + 1,
                        asymmetric: containers.some(
                            (r) => Math.abs(r.left - (innerWidth - r.right)) > 2,
                        ),
                        clipped,
                    };
                });
                check(!layout.overflow, `${file} ${theme}/${dir} ${width}: horizontal overflow`);
                check(!layout.asymmetric, `${file} ${theme}/${dir} ${width}: container asymmetry`);
                check(
                    !layout.clipped.length,
                    `${file} ${theme}/${dir} ${width}: clipped ${layout.clipped}`,
                );
                report.layoutChecks++;
            }
            await page.setViewportSize({ width: 1440, height: 1000 });
            const axe = await new AxeBuilder({ page })
                .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
                .analyze();
            report.accessibility.push({
                file,
                theme,
                dir,
                violations: axe.violations.map((v) => ({
                    id: v.id,
                    impact: v.impact,
                    nodes: v.nodes.map((n) => ({
                        target: n.target,
                        summary: n.failureSummary,
                    })),
                })),
            });
            check(
                axe.violations.length === 0,
                `${file} ${theme}/${dir}: axe ${axe.violations.map((v) => v.id).join(", ")}`,
            );
        }
        for (const [width, theme, dir] of [
            [1440, "light", "ltr"],
            [390, "dark", "rtl"],
        ]) {
            await page.setViewportSize({ width, height: 1000 });
            await page.evaluate(
                ({ theme, dir }) => {
                    document.documentElement.dataset.theme = theme;
                    document.documentElement.dir = dir;
                },
                { theme, dir },
            );
            await page.evaluate(async () => {
                for (let y = 0; y < document.body.scrollHeight; y += 700) {
                    scrollTo({ top: y, behavior: "instant" });
                    await new Promise((resolve) => setTimeout(resolve, 25));
                }
                scrollTo({ top: 0, behavior: "instant" });
                await new Promise((resolve) =>
                    requestAnimationFrame(() => requestAnimationFrame(resolve)),
                );
            });
            await page.screenshot({
                path: path.join(
                    root,
                    "tests/screenshots",
                    file.replaceAll("/", "-") + `-${width}-${theme}-${dir}.png`,
                ),
                fullPage: true,
            });
        }
    }
    check(jsErrors.length === 0, "JavaScript errors: " + jsErrors.join("; "));
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(base + "/");
    for (const label of ["Home", "Services", "Blog"]) {
        const trigger = page.getByRole("button", { name: label, exact: true });
        await trigger.click();
        check((await trigger.getAttribute("aria-expanded")) === "true", `${label} dropdown failed`);
        await page.keyboard.press("Escape");
        check((await trigger.getAttribute("aria-expanded")) === "false", `${label} Escape failed`);
    }
    await page.locator("[data-theme-toggle]").click();
    const savedTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    await page.reload();
    check(
        (await page.evaluate(() => document.documentElement.dataset.theme)) === savedTheme,
        "Theme persistence failed",
    );
    await page.locator("[data-rtl-toggle]").click();
    const savedDir = await page.evaluate(() => document.documentElement.dir);
    await page.reload();
    check(
        (await page.evaluate(() => document.documentElement.dir)) === savedDir,
        "RTL persistence failed",
    );
    for (const width of [320, 390, 820, 1024]) {
        await page.setViewportSize({ width, height: 900 });
        await page.locator(".menu-toggle").click();
        check(await page.locator(".main-nav").isVisible(), `${width} mobile menu failed`);
        await page.getByRole("button", { name: "Home", exact: true }).click();
        check(
            await page.getByRole("link", { name: "Home Page 2", exact: true }).isVisible(),
            `${width} nested menu failed`,
        );
        await page.keyboard.press("Escape");
        await page.locator(".menu-toggle").click();
    }
    report.interactions.push(
        "Desktop dropdowns, Escape, theme persistence, direction persistence, mobile nested menus",
    );
    await page.goto(base + "/pages/home-2.html");
    await page.getByRole("tab", { name: "Blocked drains" }).click();
    check(
        (await page.locator("#problem-panel h3").textContent()).includes("slowing"),
        "Problem selector failed",
    );
    await page.keyboard.press("ArrowDown");
    check(
        (await page.getByRole("tab", { name: "Faulty taps" }).getAttribute("aria-selected")) ===
            "true",
        "Problem keyboard navigation failed",
    );
    await page.goto(base + "/pages/blog.html");
    await page.getByRole("button", { name: "Drain care", exact: true }).click();
    check((await page.locator("[data-category]:visible").count()) === 1, "Blog category failed");
    await page.locator("#article-search").fill("zzzz");
    check((await page.locator("[data-category]:visible").count()) === 0, "Blog search failed");
    for (const file of ["contact", "pricing", "emergency", "home-2", "blog", "coming-soon"]) {
        await page.goto(`${base}/pages/${file}.html`);
        const form = page.locator("[data-form]");
        await form.locator("button[type=submit]").click();
        check(
            (await form.locator("[aria-invalid=true]").count()) > 0,
            `${file}: empty form validation failed`,
        );
        for (const control of await form.locator("input,textarea,select").all()) {
            const tag = await control.evaluate((el) => el.tagName);
            const type = await control.getAttribute("type");
            if (tag === "SELECT") await control.selectOption({ index: 1 });
            else
                await control.fill(
                    type === "email"
                        ? "demo@example.com"
                        : type === "tel"
                          ? "+1 202 555 0148"
                          : type === "date"
                            ? "2099-01-01"
                            : "Demo request",
                );
        }
        const phone = form.locator("input[type=tel]");
        if (await phone.count()) {
            await phone.fill("abc");
            await form.locator("button[type=submit]").click();
            check(
                (await phone.getAttribute("aria-invalid")) === "true",
                `${file}: phone validation failed`,
            );
            await phone.fill("+1 202 555 0148");
        }
        await form.locator("button[type=submit]").click();
        check(
            (await form.locator(".form-status").textContent()).includes("nothing has been sent"),
            `${file}: honest demo state failed`,
        );
    }
    await page.goto(base + "/pages/contact.html");
    await page.locator("summary").first().click();
    check((await page.locator("details").first().getAttribute("open")) !== null, "FAQ failed");
    report.interactions.push(
        "Problem selector and keyboard, journal category/search/no results, all form types empty/valid/invalid states, FAQ",
    );
    for (const key of ["drains", "taps", "seasonal"]) {
        await page.goto(base + "/pages/blog-details.html?article=" + key);
        await page.evaluate(async () => {
            document.querySelectorAll("img").forEach((img) => (img.loading = "eager"));
            await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
        });
        check(
            await page
                .locator(".article-cover img")
                .evaluate(
                    (img) =>
                        img.naturalWidth > 0 &&
                        img.src.includes(
                            "/" + new URLSearchParams(location.search).get("article") + ".webp",
                        ),
                ),
            key + " article image failed",
        );
        check((await page.locator("main > section").count()) === 5, key + " article section count");
        check(
            await page.evaluate(() =>
                document.title.includes(document.querySelector("h1").textContent),
            ),
            key + " article metadata mismatch",
        );
        const articleAxe = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze();
        check(articleAxe.violations.length === 0, key + " article accessibility");
        await page.screenshot({
            path: path.join(root, "tests/screenshots/article-" + key + ".png"),
            fullPage: true,
        });
    }
    report.interactions.push(
        "Three query-selected full journal articles, unique local photos, synchronized titles and five-section layouts",
    );
    await browser.close();
    fs.writeFileSync(path.join(root, "tests/audit-report.json"), JSON.stringify(report, null, 2));
    console.log(
        JSON.stringify(
            {
                layoutChecks: report.layoutChecks,
                axeAudits: report.accessibility.length,
                errors: report.errors,
            },
            null,
            2,
        ),
    );
    if (report.errors.length) process.exitCode = 1;
})().catch((error) => {
    console.error(error);
    fs.writeFileSync(path.join(root, "tests/audit-report.json"), JSON.stringify(report, null, 2));
    process.exitCode = 1;
});
