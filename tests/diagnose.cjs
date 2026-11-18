const { chromium } = require("playwright");
(async () => {
    const browser = await chromium.launch({
        channel: "chrome",
        headless: true,
    });
    const context = await browser.newContext({
        viewport: { width: 1440, height: 1000 },
    });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4173/pages/about.html");
    await page.evaluate(async () => {
        for (const img of document.images) {
            img.loading = "eager";
            await img.decode().catch(() => {});
        }
    });
    for (const image of await page.locator(".team-card img").all()) {
        await image.scrollIntoViewIfNeeded();
        console.log(
            await image.evaluate((img) => ({
                src: img.src,
                current: img.currentSrc,
                natural: img.naturalWidth,
                complete: img.complete,
                rect: img.getBoundingClientRect().toJSON(),
                style: {
                    visibility: getComputedStyle(img).visibility,
                    opacity: getComputedStyle(img).opacity,
                    display: getComputedStyle(img).display,
                },
            })),
        );
    }
    await page
        .locator(".team-grid")
        .screenshot({ path: "tests/screenshots/team-diagnostic.png" });
    await browser.close();
})();
// Check the final service-request links and related-article destinations.
(async () => {
    const { chromium } = require("playwright");
    const browser = await chromium.launch({
        channel: "chrome",
        headless: true,
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4173/pages/services.html");
    const links = await page
        .locator(".service-card a")
        .evaluateAll((anchors) => anchors.map((anchor) => anchor.href));
    let count = 0;
    for (const href of links) {
        await page.goto(href);
        const requested = new URL(href).searchParams.get("service");
        if (
            requested &&
            (await page.locator("#service-type").inputValue()) !== requested
        )
            throw new Error("Service was not preselected: " + requested);
        count++;
    }
    await page.goto("http://127.0.0.1:4173/pages/blog-details.html");
    const related = await page
        .locator(".related-editorial a")
        .evaluateAll((anchors) => anchors.map((anchor) => anchor.href));
    for (const href of related) {
        await page.goto(href);
        if (!new URL(href).searchParams.get("article"))
            throw new Error("Related article query missing");
        count++;
    }
    require("fs").writeFileSync(
        "tests/link-interaction-report.json",
        JSON.stringify({ checkedDestinations: count, errors: [] }, null, 2),
    );
    console.log(
        "Final catalog and related-article link checks passed: " + count,
    );
    await browser.close();
})();
