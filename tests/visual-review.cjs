const { chromium } = require("playwright");
const fs = require("fs");
(async () => {
    const browser = await chromium.launch({ channel: "chrome", headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    const files = [
        "index.html",
        ...fs
            .readdirSync("pages")
            .filter((file) => file.endsWith(".html"))
            .map((file) => "pages/" + file),
    ];
    for (const file of files) {
        for (const [width, theme, dir] of [
            [1440, "light", "ltr"],
            [390, "dark", "rtl"],
        ]) {
            await page.setViewportSize({ width, height: 1000 });
            await page.goto("http://127.0.0.1:4173/" + file);
            await page.evaluate(
                async ({ theme, dir }) => {
                    document.documentElement.dataset.theme = theme;
                    document.documentElement.dir = dir;
                    document.documentElement.style.scrollBehavior = "auto";
                    for (const img of document.images) img.loading = "eager";
                    await Promise.all(
                        [...document.images].map((img) => img.decode().catch(() => {})),
                    );
                    await document.fonts.ready;
                    for (let y = 0; y < document.body.scrollHeight; y += 650) {
                        scrollTo({ top: y, behavior: "instant" });
                        await new Promise((resolve) => setTimeout(resolve, 70));
                    }
                    scrollTo({ top: 0, behavior: "instant" });
                    await new Promise((resolve) => setTimeout(resolve, 150));
                },
                { theme, dir },
            );
            await page.screenshot({
                path:
                    "tests/screenshots/" +
                    file.replaceAll("/", "-") +
                    `-${width}-${theme}-${dir}.png`,
                fullPage: true,
            });
        }
    }
    await browser.close();
    console.log("Refreshed all 26 desktop and mobile screenshots with instant scrolling.");
})();
