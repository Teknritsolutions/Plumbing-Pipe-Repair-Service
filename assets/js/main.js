/* Shared navigation, problem selector and journal filters. */
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const dropdowns = [...document.querySelectorAll(".nav-dropdown")];
function closeDropdowns(except) {
    dropdowns.forEach((dropdown) => {
        if (dropdown === except) return;
        dropdown.querySelector("button").setAttribute("aria-expanded", "false");
        dropdown.querySelector(".dropdown-menu-custom").hidden = true;
    });
}
dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector("button");
    const menu = dropdown.querySelector(".dropdown-menu-custom");
    dropdown.addEventListener("pointerenter", (event) => {
        if (event.pointerType !== "mouse" || !matchMedia("(min-width: 1200px)").matches) return;
        closeDropdowns(dropdown);
        menu.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
    });
    dropdown.addEventListener("pointerleave", () => {
        if (dropdown.contains(document.activeElement)) return;
        menu.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
    });
    trigger.addEventListener("click", () => {
        const open = trigger.getAttribute("aria-expanded") === "true";
        closeDropdowns(dropdown);
        trigger.setAttribute("aria-expanded", String(!open));
        menu.hidden = open;
    });
    trigger.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            closeDropdowns(dropdown);
            menu.hidden = false;
            trigger.setAttribute("aria-expanded", "true");
            menu.querySelector("a").focus();
        }
    });
    dropdown.addEventListener("focusout", (event) => {
        if (!dropdown.contains(event.relatedTarget)) {
            menu.hidden = true;
            trigger.setAttribute("aria-expanded", "false");
        }
    });
});
menuButton.addEventListener("click", () => {
    const open = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    if (!open) closeDropdowns();
});
document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-dropdown")) closeDropdowns();
});
document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const activeDropdown = document.activeElement.closest(".nav-dropdown");
    closeDropdowns();
    if (activeDropdown) activeDropdown.querySelector("button").focus();
    else if (navigation.classList.contains("open")) {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        menuButton.focus();
    }
});
matchMedia("(min-width: 1200px)").addEventListener("change", () => {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    closeDropdowns();
});
const currentFile = location.pathname.split("/").pop() || "index.html";
navigation.querySelectorAll("a").forEach((anchor) => {
    if (anchor.getAttribute("href").split("/").pop() === currentFile)
        {
            if (anchor.classList.contains("nav-book")) return;
            anchor.setAttribute("aria-current", "page");
            anchor.closest(".nav-dropdown")?.querySelector(".nav-trigger").classList.add("is-active");
        }
});
const guidance = [
    [
        "Small drips deserve attention.",
        "Note where you see moisture. If safe, isolate the known water supply and request an assessment. Keep away from wet electrical equipment.",
        "service-details.html",
        "Explore pipe repair",
    ],
    [
        "Find out what is slowing the flow.",
        "Recurring slow drainage may need an inspection. Avoid mixing drain chemicals or trying unfamiliar repairs. Describe the symptoms to a professional.",
        "services.html",
        "Explore drain care",
    ],
    [
        "Make the everyday work better.",
        "A persistent drip or worn fixture may need a repair or replacement. Ask about compatible fittings and the scope of installation.",
        "services.html",
        "Explore fixture care",
    ],
    [
        "Keep tank care in safe hands.",
        "Arrange a professional assessment for changes in water quality, visible leaks or maintenance needs. Do not enter a tank or attempt internal cleaning.",
        "services.html",
        "Explore tank care",
    ],
];
const problemButtons = [...document.querySelectorAll("[data-problem]")];
function chooseProblem(index) {
    problemButtons.forEach((button, i) => {
        button.setAttribute("aria-selected", String(i === index));
        button.tabIndex = i === index ? 0 : -1;
    });
    const panel = document.querySelector("#problem-panel");
    const [title, text, href, label] = guidance[index];
    panel.setAttribute("aria-labelledby", `problem-${index}`);
    panel.querySelector("h3").textContent = title;
    panel.querySelector("h3 + p").textContent = text;
    panel.querySelector("a").href = href;
    panel.querySelector("a").innerHTML = `${label}<svg class="action-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>`;
}
problemButtons.forEach((button, index) => {
    button.addEventListener("click", () => chooseProblem(index));
    button.addEventListener("keydown", (event) => {
        const rtl = document.documentElement.dir === "rtl";
        let next = index;
        if (event.key === "ArrowDown" || event.key === (rtl ? "ArrowLeft" : "ArrowRight"))
            next = (index + 1) % problemButtons.length;
        else if (event.key === "ArrowUp" || event.key === (rtl ? "ArrowRight" : "ArrowLeft"))
            next = (index + problemButtons.length - 1) % problemButtons.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = problemButtons.length - 1;
        else return;
        event.preventDefault();
        chooseProblem(next);
        problemButtons[next].focus();
    });
});
const search = document.querySelector("#article-search");
if (search) {
    let category = "All";
    const filters = [...document.querySelectorAll("[data-filter]")];
    const articles = [...document.querySelectorAll("[data-category]")];
    const results = document.querySelector(".article-grid");
    const resultHeading = results?.closest("section")?.querySelector(".section-heading h2");
    const defaultHeading = resultHeading?.textContent;
    if (results) {
        results.id = "journal-results";
        filters.forEach((button) => button.setAttribute("aria-controls", results.id));
    }
    const filter = () => {
        let count = 0;
        articles.forEach((article) => {
            const matches =
                (category === "All" || article.dataset.category === category) &&
                article.dataset.search.includes(search.value.trim().toLowerCase());
            article.hidden = !matches;
            if (matches) count++;
        });
        document.querySelector("#filter-status").textContent = count
            ? `${count} article${count === 1 ? "" : "s"}`
            : "No articles match. Try another topic or category.";
        document.querySelector("#filter-status").classList.toggle("visually-hidden", count > 0);
        if (resultHeading) resultHeading.textContent = category === "All" ? defaultHeading : `${category}: practical guides.`;
    };
    search.addEventListener("input", filter);
    filters.forEach((button) =>
        button.addEventListener("click", () => {
            category = button.dataset.filter;
            filters.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
            filter();
            const target = resultHeading?.closest(".section-heading") || results;
            if (target) {
                const header = document.querySelector(".site-header");
                const offset = (header?.getBoundingClientRect().height || 0) + 24;
                window.scrollTo({
                    top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset),
                    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
                });
            }
        }),
    );
}
/* Three demo journal entries share the article template through explicit query keys. */
if (document.body.dataset.page === "blog-details") {
    const articleKey = new URLSearchParams(location.search).get("article");
    const journalEntries = {
        drains: {
            title: "Why your sink keeps draining slowly",
            category: "Drain care",
            imageAlt: "Plumbing professional investigating slow sink drainage",
            sections: [
                [
                    "Notice the pattern.",
                    "An occasional slow drain and a recurring drainage problem can have different causes. Note which fixture is affected and whether the change is isolated or appears elsewhere in your home.",
                    "Avoid assuming that a visible symptom identifies the source. A qualified professional may need to inspect the drain to understand what is happening.",
                ],
                [
                    "Describe the symptoms clearly.",
                    "Tell your plumber when the issue began, whether it changes after use, and whether you notice odors, sounds or backup. These observations help frame an assessment.",
                    "Keep a short record of affected fixtures and any recent changes. Do not open concealed pipework or move heavy equipment to investigate.",
                ],
                [
                    "Avoid unfamiliar fixes.",
                    "Do not mix drain chemicals. Keep people away from overflowing or contaminated water and avoid using an affected fixture if it is backing up.",
                    "If there is immediate danger, contact the appropriate local emergency service. A website form is not an emergency response channel.",
                ],
                [
                    "Ask about the next step.",
                    "Discuss the proposed inspection method, access requirements and any assessment fee. Ask what the provider will check and how further work will be approved.",
                    "After service, request practical care guidance suited to your drainage system. If the problem returns, share the previous service record rather than repeating an unconfirmed fix.",
                ],
            ],
        },
        taps: {
            title: "When is it time to replace a tap?",
            category: "Fixture care",
            imageAlt: "Modern tap and replacement cartridge on a clean work cloth",
            sections: [
                [
                    "Look at function as well as appearance.",
                    "A persistent drip, a loose handle or a fixture that no longer works smoothly can be a reason to ask about repair or replacement. Appearance alone does not establish the condition of the internal components.",
                    "Note the make or model if it is visible without dismantling the tap. This can help a professional discuss compatible parts.",
                ],
                [
                    "Prepare a useful description.",
                    "Explain what changes when you use the fixture, where you see water and how long the issue has been present. If a replacement is planned, describe the sink and the type of fitting you have.",
                    "Think about everyday use, access and maintenance when considering a new fixture. Ask your provider to confirm compatibility before purchasing parts.",
                ],
                [
                    "Keep the work safe.",
                    "Do not dismantle unfamiliar fittings or force a stiff valve. If a significant leak occurs, use a known water shutoff only if it is safe to do so.",
                    "Keep clear of wet electrical equipment. Arrange professional assistance when you are unsure about the system or the condition of nearby connections.",
                ],
                [
                    "Compare the full scope.",
                    "Ask what a repair or replacement estimate includes: labor, fixture supply, connections, disposal and any work needed around access.",
                    "After installation, discuss the checks performed and the recommended care routine. Retain the fixture information and service record for future maintenance.",
                ],
            ],
        },
        seasonal: {
            title: "A simple seasonal plumbing check",
            category: "Maintenance",
            imageAlt: "Homeowner and technician inspecting an accessible outdoor water connection",
            sections: [
                [
                    "Start with a visual routine.",
                    "A short visual check can help you recognize changes in familiar areas. Look for visible moisture around accessible fixtures and note any change in drainage or flow.",
                    "Seasonal needs vary by climate and property. Ask a qualified local professional what matters for your particular plumbing system.",
                ],
                [
                    "Keep a simple maintenance record.",
                    "Write down the date, what you noticed and any service carried out. Include fixture information and the location of known, accessible shutoff valves.",
                    "A record makes it easier to describe a new issue and plan follow-up work. It does not replace a professional inspection when something appears wrong.",
                ],
                [
                    "Know your limits.",
                    "Do not enter tanks, crawl into unsafe areas or touch hot components to perform a routine check. Keep clear of electrical equipment near water.",
                    "For unfamiliar winterization or equipment servicing, consult a qualified professional and the manufacturer’s instructions. Avoid a generic repair routine for an unknown system.",
                ],
                [
                    "Plan ahead for the next season.",
                    "Discuss any recurring symptoms, exterior plumbing exposure and maintenance requirements with your provider. Agree the scope and timing of any work.",
                    "After a visit, keep the advice with your property records. A practical routine should reflect the actual system, local conditions and safe access.",
                ],
            ],
        },
    };
    const entry = journalEntries[articleKey];
    if (entry) {
        document.title = `${entry.title} | Flowline Plumbing`;
        document.querySelector("h1").textContent = entry.title;
        document.querySelector(".breadcrumb span:last-child").textContent = entry.title;
        document.querySelector(".banner .lead").textContent =
            `${entry.category} · June 12, 2026 · By Flowline editorial · 5 min read`;
        document.querySelector('meta[name="description"]').content = entry.sections[0][1];
        document.querySelector('meta[property="og:title"]').content = document.title;
        document.querySelector('meta[property="og:description"]').content = entry.sections[0][1];
        const feature = document.querySelector(".article-cover img");
        feature.src = `../assets/images/blog-details/${articleKey}-story-v2.webp`;
        feature.srcset = `../assets/images/blog-details/${articleKey}-story-v2-480.webp 480w, ../assets/images/blog-details/${articleKey}-story-v2.webp 1200w`;
        feature.sizes = "(max-width: 767px) calc(100vw - 40px), 1200px";
        feature.alt = {
            taps: "Plumber installing a new mixer tap on a bathroom basin",
            drains: "Plumber using a drain inspection camera beneath a kitchen sink",
            seasonal: "Homeowner and plumber checking outdoor pipework before winter",
        }[articleKey];
        const heroPhoto = document.querySelector(".pi-art > img");
        if (heroPhoto) {
            heroPhoto.src = `../assets/images/blog-details/${articleKey}.webp`;
            heroPhoto.srcset = `../assets/images/blog-details/${articleKey}-480.webp 480w, ../assets/images/blog-details/${articleKey}.webp 1000w`;
            heroPhoto.alt = entry.imageAlt;
        }
        const content = document.querySelector(".article-content");
        const ids = ["notice", "record", "respond", "prepare"];
        content.innerHTML =
            entry.sections
                .map(
                    ([heading, first, second], index) =>
                        `<div id="${ids[index]}" ${index === 2 ? 'class="bordered-note"' : ""}><h2>${heading}</h2><p>${first}</p><p>${second}</p></div>`,
                )
                .join("") +
            '<p class="fine-print">General editorial demo content, not a substitute for a qualified on-site assessment.</p>';
        document
            .querySelectorAll(".article-layout aside a")
            .forEach((anchor, index) => (anchor.textContent = entry.sections[index][0]));
        const schema = document.querySelector('script[type="application/ld+json"]');
        if (schema) {
            const data = JSON.parse(schema.textContent);
            data.name = entry.title;
            data.description = entry.sections[0][1];
            schema.textContent = JSON.stringify(data);
        }
    }
}
/* Service catalog links can preselect a requested service without storing user data. */
const requestedService = new URLSearchParams(location.search).get("service");
if (requestedService) {
    document.querySelectorAll('select[name="service-type"]').forEach((select) => {
        if ([...select.options].some((option) => option.value === requestedService)) {
            select.value = requestedService;
        }
    });
}
