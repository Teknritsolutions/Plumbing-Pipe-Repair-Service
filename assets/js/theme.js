/* Early theme initialization prevents a flash before the stylesheet loads. */
(() => {
    const saved = (() => {
        try {
            return localStorage.getItem("stackly-theme");
        } catch {
            return null;
        }
    })();
    const system = matchMedia("(prefers-color-scheme: dark)");
    document.documentElement.dataset.theme = saved || (system.matches ? "dark" : "light");
    system.addEventListener("change", (event) => {
        let selected;
        try {
            selected = localStorage.getItem("stackly-theme");
        } catch {
            selected = null;
        }
        if (!selected) document.documentElement.dataset.theme = event.matches ? "dark" : "light";
    });
    document.addEventListener("DOMContentLoaded", () => {
        const button = document.querySelector("[data-theme-toggle]");
        const update = () => {
            const dark = document.documentElement.dataset.theme === "dark";
            button.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} mode`);
            button.setAttribute("aria-pressed", String(dark));
        };
        button.addEventListener("click", () => {
            const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
            document.documentElement.dataset.theme = theme;
            try {
                localStorage.setItem("stackly-theme", theme);
            } catch {
                /* Private storage can be unavailable. */
            }
            update();
        });
        update();
    });
})();
