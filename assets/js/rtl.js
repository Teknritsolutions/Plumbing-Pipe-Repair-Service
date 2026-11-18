(() => {
    try {
        document.documentElement.dir = localStorage.getItem("stackly-direction") || "ltr";
    } catch {
        document.documentElement.dir = "ltr";
    }
    document.addEventListener("DOMContentLoaded", () => {
        const button = document.querySelector("[data-rtl-toggle]");
        const update = () => {
            const rtl = document.documentElement.dir === "rtl";
            button.setAttribute("aria-pressed", String(rtl));
            button.querySelector(".direction-label").textContent = rtl ? "LTR" : "RTL";
            button.setAttribute(
                "aria-label",
                `Switch to ${rtl ? "left-to-right" : "right-to-left"} layout`,
            );
        };
        button.addEventListener("click", () => {
            const direction = document.documentElement.dir === "rtl" ? "ltr" : "rtl";
            document.documentElement.dir = direction;
            try {
                localStorage.setItem("stackly-direction", direction);
            } catch {
                /* Keep the in-session direction. */
            }
            update();
        });
        update();
    });
})();
