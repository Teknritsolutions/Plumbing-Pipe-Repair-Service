const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const base = "http://127.0.0.1:4173";
const report = { browser: "Edge", errors: [], layoutChecks: 0, submissionStates: [] };
const check = (pass, message) => {
    if (!pass) report.errors.push(message);
};
(async () => {
    const browser = await chromium.launch({ channel: "msedge", headless: true });
    report.version = browser.version();
    const context = await browser.newContext();
    const page = await context.newPage();
    page.on("pageerror", (error) => report.errors.push(error.message));
    for (const name of [
        "index.html",
        ...fs
            .readdirSync("pages")
            .filter((file) => file.endsWith(".html"))
            .map((file) => "pages/" + file),
    ]) {
        await page.goto(`${base}/${name}`);
        for (const width of [320, 768, 1440]) {
            await page.setViewportSize({ width, height: 900 });
            for (const theme of ["light", "dark"]) {
                for (const dir of ["ltr", "rtl"]) {
                    await page.evaluate(
                        ({ theme, dir }) => {
                            document.documentElement.dataset.theme = theme;
                            document.documentElement.dir = dir;
                        },
                        { theme, dir },
                    );
                    check(
                        await page.evaluate(
                            () => document.documentElement.scrollWidth <= innerWidth + 1,
                        ),
                        `${name} ${width} ${theme} ${dir} overflow`,
                    );
                    report.layoutChecks++;
                }
            }
        }
    }
    await page.goto(`${base}/pages/contact.html`);
    const form = page.locator("[data-form]");
    for (const control of await form.locator("input,textarea,select").all()) {
        const type = await control.getAttribute("type");
        if ((await control.evaluate((el) => el.tagName)) === "SELECT")
            await control.selectOption({ index: 1 });
        else
            await control.fill(
                type === "email"
                    ? "demo@example.com"
                    : type === "tel"
                      ? "+1 202 555 0148"
                      : type === "date"
                        ? "2099-01-01"
                        : "Demo input",
            );
    }
    await form.locator("input[type=email]").fill("bad-email");
    await form.locator("input[type=date]").fill("2020-01-01");
    await form.locator("button[type=submit]").click();
    check(
        (await form.locator("input[type=email]").getAttribute("aria-invalid")) === "true",
        "Invalid email not rejected",
    );
    check(
        (await form.locator("input[type=date]").getAttribute("aria-invalid")) === "true",
        "Past date not rejected",
    );
    await form.locator("input[type=email]").fill("demo@example.com");
    await form.locator("input[type=date]").fill("2099-01-01");
    await page.evaluate(
        () => (window.STACKLY_FORM_ENDPOINTS.booking = "https://forms.example/submit"),
    );
    let resolveRoute;
    const held = new Promise((resolve) => {
        resolveRoute = resolve;
    });
    await page.route("https://forms.example/submit", async (route) => {
        await held;
        await route.fulfill({ status: 500, contentType: "application/json", body: "{}" });
    });
    await form.locator("button[type=submit]").click();
    await page.waitForFunction(() => document.querySelector("button[type=submit]").disabled);
    check(await form.locator("button[type=submit]").isDisabled(), "Loading button not disabled");
    resolveRoute();
    await page.waitForFunction(() =>
        document.querySelector(".form-status").textContent.includes("could not"),
    );
    check(
        (await form.locator(".form-status").textContent()).includes("could not"),
        "Submission error state missing",
    );
    await page.unroute("https://forms.example/submit");
    await page.route("https://forms.example/submit", (route) =>
        route.fulfill({ status: 200, contentType: "application/json", body: "{}" }),
    );
    await form.locator("button[type=submit]").click();
    await page.waitForFunction(() =>
        document.querySelector(".form-status").textContent.includes("only confirmed"),
    );
    report.submissionStates = [
        "invalid email",
        "past date",
        "loading and disabled control",
        "mocked HTTP 500 error",
        "mocked HTTP 200 accepted request; no booking confirmation",
    ];
    await page.screenshot({
        path: "tests/screenshots/edge-contact-submission.png",
        fullPage: true,
    });
    await browser.close();
    fs.writeFileSync("tests/edge-report.json", JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    if (report.errors.length) process.exitCode = 1;
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
