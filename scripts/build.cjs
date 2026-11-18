const fs = require("fs");
const path = require("path");
const write = (name, text) => {
    fs.mkdirSync(path.dirname(name), { recursive: true });
    fs.writeFileSync(name, text);
};
const services = [
    "Pipe Repair",
    "Drain Unblocking",
    "Tap Replacement",
    "Tank Cleaning",
    "Leak Detection",
    "Bathroom Plumbing",
    "Kitchen Plumbing",
    "Preventive Maintenance",
];
const serviceCopy = [
    "Restore damaged connections and keep water where it belongs.",
    "Find the cause of slow drainage and restore a clear flow.",
    "Replace worn fixtures with dependable, water-conscious fittings.",
    "Arrange an assessment and a hygienic tank-cleaning plan.",
    "Locate hidden moisture before choosing a suitable repair.",
    "Thoughtful installation and repairs for everyday comfort.",
    "Practical solutions for sinks, traps and supply connections.",
    "Small checks that help you plan ahead for bigger repairs.",
];
const serviceFiles = ["pipe", "drain", "tap", "tank", "leak", "bathroom", "kitchen", "maintenance"];
const link = (file, label, cls = "button") =>
    `<a class="${cls}" href="${file}.html">${label}<span aria-hidden="true">↗</span></a>`;
const img = (file, alt, eager = false) =>
    `<img src="../assets/images/${file}.webp" alt="${alt}" width="1000" height="667" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
const intro = (tag, title, desc) =>
    `<div class="section-heading"><div><p class="eyebrow">${tag}</p><h2>${title}</h2></div>${desc ? `<p>${desc}</p>` : ""}</div>`;
const section = (content, cls = "") =>
    `<section class="section ${cls}"><div class="container">${content}</div></section>`;
const banner = (title, desc, tag = "Consider it taken care of.") =>
    section(
        `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><span>${title}</span></nav><div class="banner-content"><p class="eyebrow">${tag}</p><h1>${title}</h1><p class="lead">${desc}</p></div>`,
        "banner",
    );
const steps = (items, vertical = false) =>
    `<ol class="steps ${vertical ? "vertical" : ""}">${items.map(([title, text], i) => `<li><span class="step-number">0${i + 1}</span><div><h3>${title}</h3><p>${text}</p></div></li>`).join("")}</ol>`;
const process = [
    ["Request a service", "Tell us what is happening and where you need help."],
    ["Discuss the problem", "We clarify the symptoms, access and the next practical step."],
    ["Meet your technician", "An on-site assessment helps establish the work required."],
    ["Check the finished repair", "Review the result, care advice and agreed service details."],
];
const faqs = (
    items = [
        [
            "Can I request an estimate first?",
            "Yes. Describe the issue and share access details. A final estimate may require an inspection; approve the scope before work begins.",
        ],
        [
            "What should I do about a leaking pipe?",
            "If safe, use the known water shutoff to limit water flow. Keep clear of wet electrical equipment and arrange professional help.",
        ],
        [
            "Do you work with homes and businesses?",
            "This demonstration template supports both. A live provider should confirm its actual service area and capabilities.",
        ],
        [
            "Is this an actual booking service?",
            "This is a website template. Forms validate locally, but do not send information until the site owner connects an endpoint.",
        ],
    ],
) =>
    `<div class="faq-list">${items.map(([q, a]) => `<details><summary>${q}<span aria-hidden="true">+</span></summary><p>${a}</p></details>`).join("")}</div>`;
const panelList = (items) =>
    `<div class="panel-grid">${items.map(([title, text], i) => `<article class="info-panel"><span class="small-index">${String(i + 1).padStart(2, "0")}</span><h3>${title}</h3><p>${text}</p></article>`).join("")}</div>`;
const cta = (title, desc, label = "Book a plumber", dest = "contact") =>
    section(
        `<div class="cta"><div><p class="eyebrow">A clear next step</p><h2>${title}</h2><p>${desc}</p></div>${link(dest, label)}</div>`,
        "cta-section",
    );
function cards(folder, count = 4) {
    return `<div class="service-grid ${count > 4 ? "catalog" : ""}">${services
        .slice(0, count)
        .map(
            (name, i) =>
                `<article class="service-card">${img(`${folder}/${serviceFiles[i]}`, `${name}: ${serviceCopy[i]}`)}<div class="card-body"><span class="small-index">0${i + 1} / PLUMBING</span><h3>${name}</h3><p>${serviceCopy[i]}</p>${i === 0 ? link("service-details", "Explore service", "text-link") : `<a class="text-link" href="contact.html?service=${encodeURIComponent(name)}">Request service<span aria-hidden="true">↗</span></a>`}</div></article>`,
        )
        .join("")}</div>`;
}
function field(label, type = "text", extra = "") {
    const id = label.toLowerCase().replace(/[^a-z]+/g, "-");
    const control =
        type === "textarea"
            ? `<textarea id="${id}" name="${id}" rows="4" required ${extra}></textarea>`
            : type === "service"
              ? `<select id="${id}" name="${id}" required ${extra}><option value="">Select an option</option>${services
                    .concat(["Emergency assessment", "Not sure yet"])
                    .map((s) => `<option>${s}</option>`)
                    .join("")}</select>`
              : `<input id="${id}" name="${id}" type="${type}" required ${extra}>`;
    return `<div class="field ${type === "textarea" ? "wide" : ""}"><label for="${id}">${label}</label>${control}<span class="field-error" id="${id}-error"></span></div>`;
}
function form(kind = "booking") {
    let fields =
        field("Full name", "text", 'autocomplete="name"') +
        field("Phone", "tel", 'autocomplete="tel"');
    if (kind !== "emergency") fields += field("Email", "email", 'autocomplete="email"');
    fields += field(kind === "emergency" ? "Emergency type" : "Service type", "service");
    if (kind === "booking")
        fields +=
            field("Preferred date", "date") +
            `<div class="field"><label for="preferred-time">Preferred time</label><select id="preferred-time" name="preferred-time" required><option value="">Select a time</option><option>Morning</option><option>Afternoon</option><option>Please call to arrange</option></select><span class="field-error"></span></div>`;
    fields += field("Service address", "text", 'autocomplete="street-address"');
    if (kind === "emergency")
        fields += `<div class="field"><label for="contact-method">Preferred contact method</label><select id="contact-method" name="contact-method"><option>Phone call</option><option>Text message</option></select></div>`;
    fields += field("Problem description", "textarea");
    return `<form data-form="${kind}" novalidate><div class="form-grid">${fields}</div><p class="form-note">Demo form. Nothing is sent or stored until a submission endpoint is connected. Do not enter sensitive information.</p><button class="button" type="submit">${kind === "quote" ? "Request an estimate" : kind === "emergency" ? "Request urgent assistance" : "Request a visit"}<span aria-hidden="true">↗</span></button><p class="form-status" role="status" aria-live="polite"></p></form>`;
}
const newsletter = () =>
    `<form data-form="newsletter" class="newsletter" novalidate>${field("Email address", "email", 'autocomplete="email"')}<button class="button" type="submit">Notify me <span aria-hidden="true">↗</span></button><p class="form-note">Demo only. Your email is not sent or stored without a connected endpoint.</p><p class="form-status" role="status" aria-live="polite"></p></form>`;
const split = (file, alt, title, content, reverse = false) =>
    `<div class="split ${reverse ? "reverse" : ""}"><div class="photo-frame">${img(file, alt)}</div><div class="split-copy"><p class="eyebrow">The Stackly approach</p><h2>${title}</h2>${content}</div></div>`;
const header = `<a class="skip-link" href="#main">Skip to content</a><div class="topbar"><div class="container"><span>Thoughtful plumbing. Dependable care.</span><span>Residential &amp; commercial <span aria-hidden="true">·</span> Demo template</span></div></div><header class="site-header"><div class="container header-inner"><a class="brand" href="index.html" aria-label="Stackly Plumbing home"><img src="../assets/images/branding/mark.svg" width="40" height="40" alt=""><span>stackly<span class="brand-sub">PLUMBING &amp; PIPE REPAIR</span></span></a><nav class="main-nav" id="main-navigation" aria-label="Main navigation">${[
    [
        "Home",
        [
            ["index", "Home Page 1"],
            ["home-2", "Home Page 2"],
        ],
    ],
    ["About Us", "about"],
    [
        "Services",
        [
            ["services", "All Services"],
            ["service-details", "Service Details"],
        ],
    ],
    ["Pricing Guide", "pricing"],
    ["Emergency", "emergency"],
    [
        "Blog",
        [
            ["blog", "Blog"],
            ["blog-details", "Blog Details"],
        ],
    ],
    ["Contact Us", "contact"],
]
    .map(([name, dest]) =>
        Array.isArray(dest)
            ? `<div class="nav-dropdown"><button type="button" class="nav-trigger" aria-expanded="false">${name}<span aria-hidden="true">⌄</span></button><div class="dropdown-menu-custom" hidden>${dest.map(([file, text]) => `<a href="${file}.html">${text}</a>`).join("")}</div></div>`
            : `<a href="${dest}.html">${name}</a>`,
    )
    .join(
        "",
    )}<a class="button nav-book" href="contact.html">Book a plumber ↗</a></nav><div class="header-tools"><button class="icon-button" data-theme-toggle aria-label="Switch to dark mode" title="Toggle color theme">◐</button><button class="icon-button rtl-toggle" data-rtl-toggle aria-label="Switch to right-to-left layout" title="Toggle reading direction">⇄</button><button class="icon-button menu-toggle" aria-label="Open navigation" aria-controls="main-navigation" aria-expanded="false">☰</button></div></div></header>`;
const footer = `<footer class="site-footer"><div class="container"><div class="footer-grid"><div><a class="brand footer-brand" href="index.html"><img src="../assets/images/branding/mark.svg" width="40" height="40" alt=""><span>stackly<span class="brand-sub">PLUMBING &amp; PIPE REPAIR</span></span></a><p>Practical solutions.<br>Care for every connection.</p><p class="fine-print">A premium website demonstration. All business details are illustrative.</p></div><div><h2>Explore</h2><a href="about.html">Our approach</a><a href="pricing.html">Pricing guide</a><a href="blog.html">Plumbing journal</a><a href="contact.html">Get in touch</a></div><div><h2>How we help</h2><a href="service-details.html">Pipe repairs</a><a href="services.html">Drain &amp; fixture care</a><a href="services.html">Preventive maintenance</a><a href="emergency.html">Emergency support</a></div><div><h2>Start a conversation</h2><a href="tel:+12025550148">+1 (202) 555-0148</a><a href="mailto:hello@stackly.example">hello@stackly.example</a><p>Sample hours: Mon–Sat, 8am–6pm<br>Example Service District, USA</p><a href="contact.html#social">Social profiles: setup guide ↗</a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Stackly. Template demonstration.</span><div><a href="coming-soon.html">Coming soon</a><a href="404.html">404 preview</a><a href="contact.html">Contact</a></div></div></div></footer>`;
const pages = {};
pages.index = [
    "Plumbing done properly. Peace of mind, restored.",
    "Reliable plumbing solutions for homes and commercial spaces. Explore repairs, maintenance, transparent estimates and professional care.",
    [
        section(
            `<div class="hero-grid"><div class="hero-copy"><p class="eyebrow"><span class="status-dot"></span> YOUR SPACE. OUR CARE.</p><h1>Good plumbing.<br><em>Better peace<br>of mind.</em></h1><p class="lead">From a persistent drip to a pipe that needs attention, bring comfort back to your space with thoughtful, professional plumbing care.</p><div class="button-row">${link("contact", "Book a plumber")}${link("services", "Explore services", "button secondary")}</div><div class="hero-trust"><span>✓ Clear estimates</span><span>✓ Respect for your home</span></div></div><div class="hero-photo">${img("home-1/hero", "Plumber carefully working beneath a modern kitchen sink", true)}<div class="photo-caption"><span class="caption-symbol">↗</span><div><strong>Every detail matters.</strong><span>Professional care, from start to finish.</span></div></div></div></div>`,
            "home-hero",
        ),
        section(
            `<div class="guarantees">${[
                ["◇", "Reliable workmanship"],
                ["≡", "Transparent estimates"],
                ["⊕", "Experienced technicians"],
                ["↗", "Responsive service"],
            ]
                .map(
                    ([icon, name]) =>
                        `<div><span class="line-icon" aria-hidden="true">${icon}</span><h2>${name}</h2></div>`,
                )
                .join("")}</div>`,
            "guarantee-section",
        ),
        section(
            intro(
                "01 / What we do",
                "A solution for every connection.",
                "Everyday repairs or planned improvements. Find the right care for your plumbing.",
            ) + cards("home-1"),
        ),
        section(
            split(
                "home-1/technician",
                "Plumbing technician beside an organized tool case",
                "Good service goes beyond the repair.",
                `<p>We believe a well-cared-for space starts with clear communication and careful work. This demo brand is built around a simple service promise.</p>${steps(
                    [
                        ["Listen first", "Understand the problem before choosing a solution."],
                        ["Keep you informed", "Explain the scope and estimate before work starts."],
                        ["Leave things right", "Check the work and share practical care advice."],
                    ],
                    true,
                )}${link("about", "Meet the Stackly approach", "text-link")}`,
            ),
            "tinted",
        ),
        section(
            intro(
                "02 / A straightforward process",
                "From first call to final check.",
                "Know what happens next, at every step.",
            ) + steps(process),
        ),
        section(
            `<div class="emergency-split"><div><p class="eyebrow">WHEN IT CANNOT WAIT</p><h2>A small leak can become a big disruption.</h2><p>For burst pipes, overflowing fixtures or significant leaks, get professional guidance on your next step. Availability and arrival estimates must be confirmed.</p>${link("emergency", "Emergency help", "button light-button")}</div>${img("home-1/emergency", "Technician inspecting a pipe leak with a flashlight")}</div>`,
            "navy-section",
        ),
        section(
            intro("03 / Spaces we care for", "At home. At work. In good hands.") +
                `<div class="property-grid"><article><span class="property-icon" aria-hidden="true">⌂</span><h3>For the places you call home.</h3><p>Practical repairs and planned improvements for houses and apartments.</p><ul><li>Kitchen and bathroom plumbing</li><li>Leaks, drains and fixtures</li><li>Preventive household checks</li></ul></article><article><span class="property-icon" aria-hidden="true">▥</span><h3>For spaces that keep you moving.</h3><p>Plumbing support planned around offices and commercial properties.</p><ul><li>Fixture and supply assessments</li><li>Maintenance planning</li><li>Work coordinated around access</li></ul></article></div>`,
        ),
        section(
            `<div class="testimonial"><div><p class="eyebrow">THE EXPERIENCE WE AIM FOR</p><h2>Care you can feel in the details.</h2><p class="fine-print">Illustrative testimonial. This is sample copy, not a verified customer review.</p></div><figure><span class="quote-mark" aria-hidden="true">“</span><blockquote>Everything was explained clearly, the work area was treated with care, and we knew what to expect at each step.</blockquote><figcaption>Sam R. <span>— Demo residential customer</span></figcaption></figure></div>`,
            "tinted",
        ),
        section(
            `<div class="faq-layout"><div><p class="eyebrow">A LITTLE CLARITY</p><h2>Questions? Let’s clear things up.</h2><p>Helpful answers before you arrange a visit.</p>${link("contact", "Ask us a question", "text-link")}</div>${faqs()}</div>`,
        ),
        cta(
            "Let’s get things flowing again.",
            "Tell us what your space needs. We’ll help you find the right next step.",
        ),
    ],
];
pages["home-2"] = [
    "A better flow starts here.",
    "Modern plumbing care for everyday living, from early warning signs to thoughtful maintenance.",
    [
        section(
            `<div class="editorial-hero"><div><p class="eyebrow">CONSIDERED CARE. EVERY CONNECTION.</p><h1>A better flow<br>starts <em>here.</em></h1></div><div><p class="lead">Make room for a more comfortable everyday. Practical plumbing solutions, with the details taken care of.</p>${link("contact", "Plan your plumbing visit")}</div>${img("home-2/hero", "Female plumbing professional inspecting brass pipework", true)}</div>`,
            "editorial-hero-section",
        ),
        section(
            intro("01 / Find your next step", "What’s happening with your plumbing?") +
                `<div class="problem-selector"><div class="problem-tabs" role="tablist" aria-label="Plumbing problems">${["Leaking pipes", "Blocked drains", "Faulty taps", "Water tank issues"].map((s, i) => `<button id="problem-${i}" role="tab" aria-controls="problem-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? "0" : "-1"}" data-problem="${i}">${s}<span aria-hidden="true">↗</span></button>`).join("")}</div><div id="problem-panel" class="problem-panel" role="tabpanel" aria-labelledby="problem-0" tabindex="0"><p class="eyebrow">START WITH THE SIGNS</p><h3>Small drips deserve attention.</h3><p>Note where you see moisture. If safe, isolate the known water supply and request an assessment. Keep away from wet electrical equipment.</p>${link("service-details", "Explore pipe repair", "text-link")}</div></div>`,
            "tinted",
        ),
        section(
            `<div class="expertise-editorial">${img("home-2/expertise", "Plumbing technicians reviewing a system plan")}<div>${intro("02 / Applied expertise", "Thoughtful work. Lasting comfort.")}<p>A good assessment connects the symptoms to the source. We explain options in plain language, with respect for your property and your plans.</p><div class="capability-tags"><span>Diagnosis</span><span>Repair planning</span><span>Fixture care</span><span>Maintenance</span></div></div></div>`,
        ),
        section(
            `<div class="coverage"><div><p class="eyebrow">03 / LOCAL SERVICE, CLEARLY DEFINED</p><h2>Close to the places that matter.</h2><p>Example coverage areas for template demonstration. A live business should replace these labels and confirm service eligibility before accepting requests.</p></div><dl><div><dt>Central district</dt><dd>Homes &amp; apartments</dd></div><div><dt>Riverside district</dt><dd>Residential appointments</dd></div><div><dt>Business quarter</dt><dd>Commercial assessments</dd></div></dl></div>`,
            "navy-section",
        ),
        section(
            intro("04 / Featured solutions", "Different problems. Considered solutions.") +
                `<div class="showcase">${split("home-2/drain", "Drain inspection camera and technician", "Understand what is blocking the flow.", "<p>Drain assessment helps distinguish an everyday blockage from a deeper issue. Choose the next step with better information.</p>" + link("services", "Drain care", "text-link"))}${split("home-2/repair", "Newly installed domestic copper manifold", "Better connections, planned properly.", "<p>From replacing a fitting to improving a pipe run, start with the scope, access requirements and material choices.</p>" + link("service-details", "Pipe repair", "text-link"), true)}</div>`,
        ),
        section(
            `<div class="maintenance-panel"><div><p class="eyebrow">05 / A LITTLE PREVENTION</p><h2>Look after your plumbing, season after season.</h2><ul class="checklist"><li>Look for visible drips and moisture.</li><li>Keep an eye on changes in drainage.</li><li>Know where your water shutoff is.</li><li>Arrange professional checks when something changes.</li></ul></div>${img("home-2/maintenance", "Technician checking a water heater connection")}</div>`,
            "tinted",
        ),
        section(
            intro("06 / No guesswork", "Clarity before commitment.") +
                `<div class="pricing-explainer"><div><span>01 / Assessment</span><h3>Understand the issue.</h3><p>Access and diagnosis shape the work required.</p></div><div><span>02 / Estimate</span><h3>Review the options.</h3><p>Materials, labor and any extra charges are explained.</p></div><div><span>03 / Approval</span><h3>You choose the next step.</h3><p>Agree the scope before repairs begin.</p>${link("pricing", "Read the pricing guide", "text-link")}</div></div>`,
        ),
        section(
            intro(
                "07 / A closer look",
                "From worn to well considered.",
                "Generated illustrations of two different pipe connections. These do not document an actual before-and-after repair.",
            ) +
                `<div class="comparison"><figure>${img("home-2/before", "Illustrative worn copper fitting")}<figcaption>Before concept / A worn connection</figcaption></figure><figure>${img("home-2/after", "Illustrative new copper fitting")}<figcaption>After concept / A replacement connection</figcaption></figure></div>`,
            "tinted",
        ),
        section(
            `<div class="advice-feature">${img("home-2/advice", "Homeowner learning where the water shutoff is")}<div><p class="eyebrow">08 / THE PLUMBING JOURNAL</p><h2>A little knowledge goes a long way.</h2><p>Know the warning signs, prepare for a service visit and develop a simple maintenance routine.</p>${link("blog", "Read our practical guides", "text-link")}</div></div>`,
        ),
        section(
            "<div class=\"home-care-heading\"><div><p class=\"eyebrow\">09 / THE HOME CARE EDIT</p><h2>Small checks today.<br>More peace of mind tomorrow.</h2></div><p>A simple rhythm for looking after the plumbing you rely on. Keep track of changes and know what to discuss at your next service visit.</p></div><div class=\"home-care-grid\"><article class=\"home-care-feature care-photo-feature\"><img class=\"care-main-photo\" src=\"../assets/images/services/maintenance.webp\" alt=\"Plumbing technician checking the pressure gauge on a home water system\" width=\"1000\" height=\"667\" loading=\"lazy\" decoding=\"async\"><span class=\"care-photo-label\"><span class=\"care-status-dot\" aria-hidden=\"true\"></span>PREVENTIVE CARE / LASTING COMFORT</span><div class=\"care-photo-caption\"><span class=\"care-kicker\">YOUR HOME, LOOKED AFTER</span><h3>A little care.<br>A home that flows.</h3><a class=\"text-link\" href=\"services.html\">Explore maintenance <svg class=\"action-arrow\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 12h16m-6-6 6 6-6 6\"/></svg></a></div></article><div class=\"home-care-checks\"><article><span class=\"care-index\">01</span><div><span class=\"care-kicker\">EVERY MONTH</span><h3>Look for small changes</h3><p>Check accessible areas beneath sinks for drips, moisture or new marks. Note changes in familiar water flow or drainage.</p></div></article><article><span class=\"care-index\">02</span><div><span class=\"care-kicker\">WITH THE SEASONS</span><h3>Review exposed areas</h3><p>Look at visible outdoor taps and pipe insulation. Ask a professional about weather protection suited to your property.</p></div></article><article><span class=\"care-index\">03</span><div><span class=\"care-kicker\">AT YOUR NEXT SERVICE</span><h3>Keep a useful service record</h3><p>Save repair notes and product details together. Ask which checks and maintenance intervals your fixtures need.</p></div></article></div></div>",
            "home-care-section",
        ),
    ],
];
pages.about = [
    "People who care about the details.",
    "Meet the principles, people and practical expertise behind the Stackly Plumbing demonstration brand.",
    [
        banner(
            "People who care about the details.",
            "Good plumbing is practical. Good service is personal.",
            "ABOUT STACKLY",
        ),
        section(
            split(
                "about/story",
                "Plumbing team preparing equipment in a workshop",
                "Built around a simple idea: do the work with care.",
                "<p>Stackly is an illustrative plumbing brand created for this template. Its sample story centers on a small team that values practical advice, tidy work and clear communication.</p><p>Replace this background with the real history, credentials and service commitments of your business before launch.</p>",
            ),
        ),
        section(
            intro("WHAT GUIDES US", "Practical principles. Everyday actions.") +
                panelList([
                    [
                        "Our mission",
                        "Make plumbing care understandable and straightforward, from the first question to the final check.",
                    ],
                    [
                        "Our vision",
                        "Comfortable spaces supported by thoughtful maintenance and responsible repairs.",
                    ],
                    [
                        "Our values",
                        "Listen carefully. Explain clearly. Respect the space. Follow through.",
                    ],
                ]),
            "tinted",
        ),
        section(
            `<div class="technical-layout"><div><p class="eyebrow">CAPABILITIES WITH PURPOSE</p><h2>Know the system. Understand the solution.</h2><dl class="technical-list"><div><dt>Assessment</dt><dd>Visible symptoms, access conditions and system context.</dd></div><div><dt>Repair planning</dt><dd>Suitable materials and clearly agreed scope.</dd></div><div><dt>Ongoing care</dt><dd>Care advice and a practical maintenance plan.</dd></div></dl></div>${img("about/expertise", "Technician measuring copper pipework at a bench")}</div>`,
        ),
        section(
            intro(
                "MEET THE DEMO TEAM",
                "Different skills. A shared standard.",
                "Generated portraits and fictional identities for layout demonstration. Replace with your actual team and verified credentials.",
            ) +
                `<div class="team-grid">${[
                    [
                        "alex",
                        "Alex Morgan",
                        "Lead plumbing technician",
                        "Coordinates repair assessments and explains the proposed scope.",
                    ],
                    [
                        "jordan",
                        "Jordan Lee",
                        "Maintenance specialist",
                        "Helps plan inspections and practical preventive care.",
                    ],
                ]
                    .map(
                        ([file, name, role, text]) =>
                            `<article class="team-card">${img("about/" + file, `Generated demo portrait of ${name}`)}<div><p class="eyebrow">DEMO PROFILE</p><h3>${name}</h3><strong>${role}</strong><p>${text}</p></div></article>`,
                    )
                    .join("")}</div>`,
            "tinted",
        ),
        cta(
            "The details make the difference.",
            "Start with a clear conversation about your property and the work it needs.",
            "Talk to the team",
        ),
    ],
];
pages.services = [
    "Everyday plumbing. Expert attention.",
    "Explore a complete plumbing service catalog for residential and commercial spaces.",
    [
        banner(
            "Everyday plumbing. Expert attention.",
            "From the first signs of a leak to a planned upgrade, find a practical way forward.",
            "OUR SERVICES",
        ),
        section(
            intro(
                "THE SERVICE CATALOG",
                "Care for the whole system.",
                "Browse demonstration services. Actual availability should be confirmed with your provider.",
            ) + cards("services", 8),
        ),
        section(
            `<div class="residential-feature">${img("services/residential", "Technician discussing a kitchen plumbing problem with a homeowner")}<div><p class="eyebrow">RESIDENTIAL PLUMBING</p><h2>Comfort starts with the essentials.</h2><p>Kitchen taps, bathroom fixtures, supply pipes and drains all shape daily life. Arrange repairs around your space and schedule.</p><ul class="checklist"><li>Houses and apartments</li><li>Fixture replacements and repairs</li><li>Clear care advice after the visit</li></ul></div></div>`,
            "tinted",
        ),
        section(
            `<div class="commercial-feature"><div><p class="eyebrow">COMMERCIAL PLUMBING</p><h2>Keep your space working.</h2><p>Coordinate assessments and maintenance with site access, operating hours and the needs of your people.</p><dl class="technical-list"><div><dt>Plan access</dt><dd>Agree safe access and the likely impact on operations.</dd></div><div><dt>Define scope</dt><dd>Record the issue and approve the recommended work.</dd></div></dl></div>${img("services/commercial", "Plumbing technician inspecting commercial plant room pipes")}</div>`,
        ),
        section(
            intro("NOT SURE WHERE TO START?", "Describe the symptoms. We’ll help with the rest.") +
                `<div class="guidance-rows">${[
                    ["Visible moisture or dripping", "Start with a leak or pipe assessment."],
                    ["Slow drainage or recurring blockage", "Request a drainage inspection."],
                    [
                        "A worn tap or changing fixture",
                        "Ask about fixture replacement and compatibility.",
                    ],
                    ["Nothing urgent, just planning ahead", "Discuss preventive maintenance."],
                ]
                    .map(
                        ([a, b]) =>
                            `<div><h3>${a}</h3><p>${b}</p><a href="contact.html" aria-label="Ask about ${a.toLowerCase()}">↗</a></div>`,
                    )
                    .join("")}</div>`,
            "tinted",
        ),
        cta(
            "Tell us what needs attention.",
            "A useful service request begins with the symptoms, location and access details.",
            "Request a service",
        ),
    ],
];
pages["service-details"] = [
    "Pipe repair, with the source in mind.",
    "Learn how pipe repair assessments, material choices and careful checks support a dependable repair.",
    [
        banner(
            "Pipe repair, with the source in mind.",
            "A thoughtful repair starts by understanding the connection, not just the drip.",
            "SERVICE / PIPE REPAIR",
        ),
        section(
            split(
                "service-details/overview",
                "Professional plumber inspecting a copper pipe joint",
                "Understand the problem before choosing the fix.",
                '<p>Visible leaks can come from joints, worn seals, corrosion or damaged pipework. Assessment helps identify the affected area and the work needed to restore it.</p><div class="bordered-note"><strong>What an assessment considers</strong><p>Material compatibility, access, isolation, the condition of nearby fittings and any signs of a wider issue.</p></div>',
            ),
        ),
        section(
            intro("COMMON PIPE PROBLEMS", "Read the signs. Plan the repair.") +
                `<div class="issue-table"><div><h3>Dripping joint</h3><p>A seal or fitting may need attention.</p><span>Inspect the connection and surrounding area.</span></div><div><h3>Corrosion</h3><p>Discoloration or pitting can indicate deterioration.</p><span>Assess material condition and replacement scope.</span></div><div><h3>Recurring moisture</h3><p>A hidden source may need further investigation.</p><span>Locate the cause before opening or repairing.</span></div></div>`,
            "tinted",
        ),
        section(
            `<div class="process-layout"><div><p class="eyebrow">THE REPAIR JOURNEY</p><h2>Careful steps. A clear outcome.</h2><p>Access, materials and the extent of the issue influence the repair plan.</p></div>${steps(
                [
                    [
                        "Inspect and explain",
                        "Review visible symptoms and explain the likely source.",
                    ],
                    ["Agree the scope", "Discuss materials, access and estimate details."],
                    [
                        "Complete the repair",
                        "A qualified professional carries out the agreed work.",
                    ],
                    ["Test and hand over", "Check operation and explain any follow-up care."],
                ],
                true,
            )}</div>`,
        ),
        section(
            `<div class="faq-layout"><div><p class="eyebrow">ESTIMATES &amp; ANSWERS</p><h2>The right repair starts with clarity.</h2><div class="bordered-note"><strong>Pricing depends on the assessment.</strong><p>Pipe material, location, access and the extent of damage affect cost. Demo prices are explained in our guide.</p>${link("pricing", "View pricing guide", "text-link")}</div></div>${faqs(
                [
                    [
                        "Will the whole pipe need replacing?",
                        "That depends on the condition of the affected section and the surrounding system. An inspection helps establish the appropriate scope.",
                    ],
                    [
                        "Will my water need to be turned off?",
                        "Some repairs require isolation. Your technician should explain any interruption before work begins.",
                    ],
                    [
                        "Can you quote from a description?",
                        "An initial discussion can help frame the issue. A reliable final scope may require an on-site inspection.",
                    ],
                ],
            )}</div>`,
            "tinted",
        ),
        cta(
            "Give that drip the attention it needs.",
            "Describe the location, symptoms and when you first noticed the issue.",
            "Request pipe repair",
        ),
    ],
];
const priceTable = `<div class="table-wrap"><table><caption>Illustrative USD demo ranges — not quotations or market estimates.</caption><thead><tr><th scope="col">Service</th><th scope="col">Demo range</th><th scope="col">Scope note</th></tr></thead><tbody>${[
    ["Pipe repair", "$120–$350", "Accessible minor repair"],
    ["Drain unblocking", "$90–$240", "Routine assessment and clearing"],
    ["Tap replacement", "$100–$220", "Labor example; fixtures extra"],
    ["Tank cleaning", "$180–$420", "Subject to size and safe access"],
]
    .map(
        (row) =>
            `<tr>${row.map((s, i) => (i === 0 ? `<th scope="row">${s}</th>` : `<td>${s}</td>`)).join("")}</tr>`,
    )
    .join("")}</tbody></table></div>`;
pages.pricing = [
    "Clear scope. Clearer decisions.",
    "Understand illustrative plumbing prices, service packages and the factors that affect a tailored estimate.",
    [
        banner(
            "Clear scope. Clearer decisions.",
            "A pricing guide to help you ask the right questions before approving work.",
            "PRICING GUIDE",
        ),
        section(
            intro(
                "ILLUSTRATIVE PRICES",
                "A starting point for the conversation.",
                "Sample figures only. Materials, taxes, travel and urgency may add to an agreed estimate.",
            ) + priceTable,
        ),
        section(
            intro(
                "DEMO SERVICE PACKAGES",
                "Choose the level of care you need.",
                "Illustrative package concepts. These are not purchasable service offers.",
            ) +
                `<div class="package-grid">${[
                    [
                        "Essential",
                        "$89",
                        "A focused assessment",
                        ["One reported issue", "Visible system check", "Written next-step advice"],
                    ],
                    [
                        "Home Care",
                        "$159",
                        "A broader picture",
                        [
                            "Multiple fixture checks",
                            "Maintenance recommendations",
                            "Priority planning discussion",
                        ],
                    ],
                    [
                        "Property Care",
                        "$249",
                        "Plan for a larger space",
                        [
                            "Multi-area walkthrough",
                            "Site access review",
                            "Tailored maintenance scope",
                        ],
                    ],
                ]
                    .map(
                        ([name, price, sub, list], i) =>
                            `<article class="package ${i === 1 ? "popular" : ""}"><p class="eyebrow">${i === 1 ? "POPULAR / DEMO" : "DEMO PACKAGE"}</p><h3>${name}</h3><div class="price">${price}<small> / illustrative</small></div><p>${sub}</p><ul class="checklist">${list.map((s) => `<li>${s}</li>`).join("")}</ul>${link("contact", "Discuss this package", "button " + (i === 1 ? "" : "secondary"))}</article>`,
                    )
                    .join("")}</div>`,
            "tinted",
        ),
        section(
            intro("WHAT SHAPES AN ESTIMATE?", "The details behind the number.") +
                panelList([
                    [
                        "Complexity",
                        "The source and extent of the issue determine the work involved.",
                    ],
                    ["Materials", "Compatible fittings and replacement components vary by system."],
                    ["Accessibility", "Location and safe access can affect time and preparation."],
                    [
                        "Urgency",
                        "Out-of-hours work or special arrangements may carry extra charges.",
                    ],
                ]),
        ),
        section(
            `<div class="faq-layout"><div><p class="eyebrow">BEFORE YOU APPROVE</p><h2>Good questions lead to clear expectations.</h2></div>${faqs(
                [
                    [
                        "Are these actual prices?",
                        "No. All displayed prices are illustrative demo content and are not market quotes.",
                    ],
                    [
                        "What should an estimate include?",
                        "Ask for the scope, labor, materials, taxes, call-out fees, possible additional charges and any conditions.",
                    ],
                    [
                        "What happens if the scope changes?",
                        "The provider should explain the change and obtain your approval before proceeding with additional work.",
                    ],
                ],
            )}</div>`,
            "tinted",
        ),
        section(
            "<div class=\"estimate-editorial\"><figure class=\"estimate-photo\"><img src=\"../assets/images/pricing/estimate-conversation-v2.webp\" alt=\"Plumber and homeowner reviewing an estimate together at a kitchen island\" width=\"1200\" height=\"800\" loading=\"lazy\" decoding=\"async\"><figcaption><span class=\"estimate-photo-mark\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\"><path d=\"m5 12 4 4L19 6\"/></svg></span><div><strong>Clarity before commitment.</strong><span>Understand the work before it begins.</span></div></figcaption></figure><div class=\"estimate-copy\"><p class=\"eyebrow\">KNOW WHAT YOU ARE AGREEING TO</p><h2>A clear estimate.<br>A confident next step.</h2><p>Good decisions start with a clear conversation. Ask for an explanation of the proposed work and keep a written record of what is included.</p><div class=\"estimate-inclusions\"><div><span>01</span><div><h3>A defined scope</h3><p>The issue being addressed, the work proposed and any exclusions.</p></div></div><div><span>02</span><div><h3>Costs explained</h3><p>Labour, materials and any assessment, travel or additional charges.</p></div></div><div><span>03</span><div><h3>A plan for changes</h3><p>How unexpected findings, extra work and timing will be discussed.</p></div></div></div><a class=\"button\" href=\"contact.html\">Discuss your project <svg class=\"action-arrow\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 12h16m-6-6 6 6-6 6\"/></svg></a></div></div>",
        ),
    ],
];
pages.emergency = [
    "When the unexpected needs attention.",
    "Practical first steps and an emergency plumbing request form for significant leaks and urgent plumbing problems.",
    [
        section(
            `<div class="emergency-hero"><div><nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><span>Emergency</span></nav><p class="eyebrow">EMERGENCY PLUMBING</p><h1>When the unexpected needs attention.</h1><p class="lead">Significant leak? Overflowing fixture? Keep people safe and seek professional help. Confirm availability and response arrangements directly.</p><a class="button light-button" href="tel:+12025550148">Call +1 (202) 555-0148 ↗</a></div>${img("emergency/hero", "Plumber locating a leak in accessible basement pipes", true)}</div>`,
            "navy-section",
        ),
        section(
            intro("URGENT ISSUES", "Recognize when to ask for help.") +
                panelList([
                    ["Burst pipes", "Uncontrolled water from a damaged pipe."],
                    ["Major leaks", "Persistent water flow or rapidly spreading moisture."],
                    ["Blocked drains", "Significant backup or loss of drainage."],
                    ["Overflowing fixtures", "Water escaping a toilet, sink or other fixture."],
                    [
                        "Water supply problems",
                        "An unexpected loss of supply or sudden system changes.",
                    ],
                    ["Water heater leaks", "Water pooling around the tank or leaking from connected pipework."],
                ]),
        ),
        section(`<div class="em-safety"><figure class="em-safety-photo"><img src="../assets/images/emergency/safety-guide-v3.webp" alt="Plumber showing a homeowner an accessible water shutoff valve" width="1200" height="800" loading="lazy"><figcaption>Know your shutoff. Keep your distance from hazards.</figcaption></figure><div class="em-safety-copy"><p class="eyebrow">BEFORE HELP ARRIVES</p><h2>A few calm steps. A safer space.</h2><p>Protect people first, then share what you can see with your plumber.</p><ul class="em-safety-list"><li><span>01</span><div><h3>Keep clear of hazards</h3><p>Avoid wet electrical equipment, contaminated water and unstable surfaces.</p></div></li><li><span>02</span><div><h3>Limit water only if safe</h3><p>Use a known, accessible shutoff. Leave unfamiliar valves and repairs to a professional.</p></div></li><li><span>03</span><div><h3>Make room for help</h3><p>Keep people away from the affected area and clear a safe route for the technician.</p></div></li></ul><p class="em-safety-note">Immediate danger? Contact the appropriate local emergency service. This form is not monitored for emergencies.</p></div></div>`, "tinted em-safety-section"),
        section(`<div class="em-response"><div class="em-response-heading"><div><p class="eyebrow">WHAT TO EXPECT</p><h2>From your first call to a clear repair plan.</h2></div><p>Agree the next steps before work begins. Availability, location and the situation affect response times; no arrival time is guaranteed.</p></div><figure class="em-response-photo"><img src="../assets/images/emergency/response-visit-v3.webp" alt="Plumber inspecting bathroom pipework with a homeowner" width="1200" height="800" loading="lazy"><figcaption><span>LISTEN. ASSESS. EXPLAIN.</span><strong>A clear conversation at every step.</strong></figcaption></figure><ol class="em-response-timeline"><li><span>01 / THE CALL</span><h3>Tell us what you see</h3><p>Describe the leak, affected fixtures and any hazards so the situation can be understood.</p></li><li><span>02 / THE ARRANGEMENTS</span><h3>Confirm the visit</h3><p>Discuss availability, access and call-out terms, including possible charges.</p></li><li><span>03 / THE ASSESSMENT</span><h3>Understand the repair</h3><p>The technician checks the issue and explains the proposed scope before you agree to work.</p></li></ol></div>`, "em-response-section"),
        section(
            `<div class="emergency-info"><p class="eyebrow">SAMPLE SERVICE INFORMATION</p><h2>Confirm the essentials before a visit.</h2><dl><div><dt>Availability</dt><dd>Demo business hours: Monday–Saturday, 8am–6pm. Out-of-hours support is not promised.</dd></div><div><dt>Coverage</dt><dd>Example Service District. Replace with your actual coverage area.</dd></div><div><dt>Possible charges</dt><dd>Ask about call-out fees, urgent attendance, labor and materials before agreeing work.</dd></div></dl></div>`,
            "tinted",
        ),
        section(
            `<div class="form-layout"><div class="em-request-intro"><p class="eyebrow">REQUEST ASSISTANCE</p><h2>Tell us what is happening.</h2><p>Demo request form only. For a live urgent issue, contact a real local service provider directly.</p><figure class="em-request-photo"><img src="../assets/images/emergency/response-visit-v3.webp" alt="Plumber assessing pipework during a home visit" width="1200" height="800" loading="lazy"><figcaption>Share the location, the issue and a safe way to reach you.</figcaption></figure></div><div class="form-panel">${form("emergency")}</div></div>`,
        ),
    ],
];
const articles = [
    [
        "drains",
        "Drain care",
        "Why your sink keeps draining slowly",
        "Understand recurring symptoms and when to request an inspection.",
    ],
    [
        "taps",
        "Fixture care",
        "When is it time to replace a tap?",
        "Learn which changes are worth discussing with your plumber.",
    ],
    [
        "seasonal",
        "Maintenance",
        "A simple seasonal plumbing check",
        "A short visual checklist for keeping track of your home.",
    ],
];
pages.blog = [
    "The plumbing journal.",
    "Practical plumbing guides covering leaks, drain care, fixture replacement and household maintenance.",
    [
        banner(
            "The plumbing journal.",
            "A little knowledge for a more comfortable everyday.",
            "ADVICE / MAINTENANCE / CARE",
        ),
        section(
            `<article class="featured-article">${img("blog/featured", "Water droplet forming on a copper pipe joint")}<div><p class="eyebrow">FEATURED / LEAK AWARENESS</p><h2>The small signs your pipes need attention.</h2><p>A drip, a stain or a change in pressure can be a reason to look closer. Here is how to prepare for a useful conversation with a professional.</p><p class="fine-print">June 12, 2026 · 5 min read · Stackly editorial demo</p>${link("blog-details", "Read the guide", "text-link")}</div></article>`,
        ),
        section(
            `<div class="blog-tools"><div><label for="article-search">Search the journal</label><input type="search" id="article-search" placeholder="Search by topic…"></div><div class="filter-buttons" aria-label="Article categories">${["All", "Drain care", "Fixture care", "Maintenance"].map((s, i) => `<button data-filter="${s}" aria-pressed="${i === 0}">${s}</button>`).join("")}</div></div>`,
            "filter-section tinted",
        ),
        section(
            intro("LATEST NOTES", "Practical reads, with a purpose.") +
                `<div class="article-grid">${articles.map(([file, cat, title, desc]) => `<article class="article-card" data-category="${cat}" data-search="${title.toLowerCase()} ${desc.toLowerCase()}">${img("blog/" + file, title)}<div class="card-body"><p class="eyebrow">${cat}</p><h3>${title}</h3><p>${desc}</p>${link("blog-details", "Read article", "text-link")}</div></article>`).join("")}</div><p id="filter-status" class="visually-hidden" role="status" aria-live="polite">3 articles</p>`,
        ),
        section(
            `<div class="newsletter-layout"><div><p class="eyebrow">GOOD ADVICE, OCCASIONALLY</p><h2>A little care in your inbox.</h2><p>Connect a mailing service to share maintenance notes with your readers.</p></div>${newsletter()}</div>`,
            "tinted",
        ),
    ],
];
pages["blog-details"] = [
    "The small signs your pipes need attention.",
    "Learn to recognize visible plumbing warning signs and prepare useful information for a professional assessment.",
    [
        banner(
            "The small signs your pipes need attention.",
            "Leak awareness · June 12, 2026 · By Stackly editorial demo · 5 min read",
            "THE PLUMBING JOURNAL",
        ),
        section(
            `<figure class="article-cover">${img("blog-details/feature", "Plumbing professional examining a leaking fitting")}</figure>`,
            "article-image-section",
        ),
        section(
            `<div class="article-layout"><aside><p class="eyebrow">IN THIS GUIDE</p><nav aria-label="Article contents"><a href="#notice">Notice the changes</a><a href="#record">Make a useful note</a><a href="#respond">Respond safely</a><a href="#prepare">Prepare for a visit</a></nav></aside><article class="article-content"><div id="notice"><h2>Notice the changes, however small.</h2><p>Plumbing problems do not always begin with a dramatic leak. A damp patch beneath a sink, a recurring drip or a stain near a fitting may be a reason to ask for an assessment. These signs do not establish a diagnosis by themselves.</p><p>Pay attention to changes in familiar areas. Check visible connections without moving equipment or opening concealed spaces. Avoid touching hot pipes or anything close to electrical equipment.</p></div><div id="record"><h2>Make a useful note.</h2><p>Record where you noticed the issue, when it began and whether it changes when a fixture is used. A clear description can make an initial discussion more productive.</p><ul><li>Where is the visible moisture?</li><li>Is it continuous or occasional?</li><li>Have you noticed a change in flow or drainage?</li><li>Can the area be accessed safely?</li></ul></div><div class="bordered-note" id="respond"><h2>Respond safely.</h2><p>If safe, use a known water shutoff to limit a significant leak. Keep away from wet electrical equipment and contaminated water. Do not attempt an unfamiliar repair or enter an unsafe area.</p><p>For immediate danger, contact the appropriate local emergency service. A website inquiry is not an emergency response channel.</p></div><div id="prepare"><h2>Prepare for a professional visit.</h2><p>Share your observations and discuss access, availability and assessment fees. Ask what the proposed work includes and how changes to the scope will be handled.</p><p>After a repair, request a clear explanation of the checks performed and any recommended follow-up. Keep the service record with your property maintenance notes.</p></div><p class="fine-print">General editorial demo content, not a substitute for a qualified on-site assessment.</p></article></div>`,
        ),
        section(
            intro("KEEP READING", "A few more useful connections.") +
                `<div class="related-editorial">${[
                    ["related-drain", "Making sense of recurring drain problems"],
                    ["related-water", "A seasonal routine for your plumbing"],
                ]
                    .map(
                        ([file, title]) =>
                            `<article>${img("blog-details/" + file, title)}<div><p class="eyebrow">MAINTENANCE NOTES</p><h3>${title}</h3><p>Explore related services and discuss the symptoms with a qualified professional.</p><a class="text-link" href="blog-details.html?article=${file === "related-drain" ? "drains" : "seasonal"}">Read related article<span aria-hidden="true">↗</span></a></div></article>`,
                    )
                    .join("")}</div>`,
            "tinted",
        ),
        cta(
            "Noticed something that needs a closer look?",
            "Share what you have observed and arrange a professional assessment.",
            "Ask about an assessment",
        ),
    ],
];
pages.contact = [
    "Let’s get things flowing.",
    "Contact the Stackly Plumbing demonstration brand and explore the integration-ready booking form.",
    [
        banner(
            "Let’s get things flowing.",
            "A question, a planned improvement or a problem to solve. Start here.",
            "CONTACT & BOOKING",
        ),
        section(
            `<div class="contact-grid">${[
                ["Phone", "+1 (202) 555-0148", "tel:+12025550148"],
                ["Email", "hello@stackly.example", "mailto:hello@stackly.example"],
                ["Business hours", "Mon–Sat, 8am–6pm", ""],
                ["Service address", "Example Service District, USA", ""],
            ]
                .map(
                    ([title, value, href]) =>
                        `<div><p class="eyebrow">${title}</p>${href ? `<a href="${href}">${value}</a>` : `<strong>${value}</strong>`}</div>`,
                )
                .join("")}</div>`,
        ),
        section(
            `<div class="form-layout"><div><p class="eyebrow">BOOK A PLUMBING VISIT</p><h2>A few details. A useful conversation.</h2><p>Tell us about the issue and the time that suits you. A live service provider must confirm the appointment.</p><div class="bordered-note"><strong>Need urgent help?</strong><p>This demo form is not monitored. Contact a real local service provider for urgent assistance.</p>${link("emergency", "Read emergency guidance", "text-link")}</div></div><div class="form-panel">${form()}</div></div>`,
            "tinted",
        ),
        section(
            intro(
                "SERVICE LOCATION",
                "Find the location on the map.",
                "Explore an example location in central Indianapolis.",
            ) +
                `<div class="contact-map"><iframe title="Google Map: example location at Monument Circle, Indianapolis" src="https://maps.google.com/maps?q=1%20Monument%20Circle%2C%20Indianapolis%2C%20IN%2046204&amp;z=15&amp;output=embed" width="1200" height="420" style="border:0" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div><p class="contact-map-address">Example location: 1 Monument Circle, Indianapolis, IN 46204. <a href="https://www.google.com/maps/search/?api=1&amp;query=1+Monument+Circle+Indianapolis+IN+46204" target="_blank" rel="noopener">Open in Google Maps</a></p>`,
        ),
        section(
            `<div class="faq-layout"><div><p class="eyebrow">BEFORE YOU GET IN TOUCH</p><h2>A little information helps.</h2></div>${faqs(
                [
                    [
                        "What information should I provide?",
                        "Share the symptoms, location, access details and when you first noticed the issue.",
                    ],
                    [
                        "Is my preferred date confirmed?",
                        "No. A requested date is a preference until a live service provider confirms availability.",
                    ],
                    [
                        "Can I send an urgent request here?",
                        "This template is not a monitored emergency channel. Contact a real local provider directly for urgent assistance.",
                    ],
                ],
            )}</div>`,
            "tinted",
        ),
        section(
            `<div class="contact-close" id="social"><div><p class="eyebrow">KEEP THE CONVERSATION SIMPLE</p><h2>Prefer to talk it through?</h2><p>Replace the sample details with your business phone and social profiles before launch.</p></div><a class="button" href="tel:+12025550148">Call the sample number ↗</a></div>`,
        ),
    ],
];
pages["404"] = [
    "A little off the pipeline.",
    "This page could not be found. Return to Stackly Plumbing home or get in touch.",
    [
        section(
            `<div class="error-page"><div class="pipe-illustration" aria-hidden="true"><svg viewBox="0 0 440 240"><path d="M35 50v90h110V50m70 0v140m0-140h90v140h-90m160-140v90h40"/><path class="water-line" d="M170 195q20-35 40 0t40 0t40 0"/></svg><span>404</span></div><p class="eyebrow">A CONNECTION IS MISSING</p><h1>A little off the pipeline.</h1><p>The page you’re looking for may have moved. Let’s get you back on track.</p><div class="button-row">${link("index", "Back to home")}${link("contact", "Contact us", "button secondary")}</div></div>`,
            "special-section",
        ),
    ],
];
pages["coming-soon"] = [
    "Something good is in the pipeline.",
    "Stay in the loop as the Stackly Plumbing demonstration website prepares for launch.",
    [
        section(
            `<div class="coming-soon"><div class="coming-mark"><img src="../assets/images/branding/mark.svg" width="88" height="88" alt="Stackly pipe and water mark"></div><p class="eyebrow">A FRESH CONNECTION IS ON ITS WAY</p><h1>Something good is in the pipeline.</h1><p class="lead">We’re preparing a more thoughtful way to care for your plumbing. Leave your email once a notification service is connected.</p>${newsletter()}<a class="text-link" href="mailto:hello@stackly.example">hello@stackly.example ↗</a><p class="fine-print">Sample contact address. Launch date to be announced.</p></div>`,
            "special-section",
        ),
    ],
];
function document(file, data, root = false) {
    let [title, description, sections] = data;
    let html = `<!doctype html><html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} | Stackly Plumbing</title><meta name="description" content="${description}"><meta property="og:title" content="${title} | Stackly Plumbing"><meta property="og:description" content="${description}"><meta property="og:type" content="website"><meta name="theme-color" content="#12304A"><link rel="icon" href="../assets/images/branding/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="../assets/images/branding/apple-touch-icon.png"><script src="../assets/js/theme.js"></script><script src="../assets/js/rtl.js"></script><link rel="stylesheet" href="../assets/css/bootstrap.min.css"><link rel="stylesheet" href="../assets/css/style.css"><link rel="stylesheet" href="../assets/css/responsive.css"><link rel="stylesheet" href="../assets/css/dark-mode.css"><link rel="stylesheet" href="../assets/css/rtl.css"></head><body data-page="${file}">${header}<main id="main">${sections.join("\n")}</main>${footer}<script src="../assets/js/main.js" defer></script><script src="../assets/js/forms.js" defer></script></body></html>`;
    if (root)
        html = html
            .replaceAll("../assets/", "assets/")
            .replace(/href="([a-z0-9-]+)\.html/g, 'href="pages/$1.html');
    return html;
}
for (const [file, data] of Object.entries(pages)) write(`pages/${file}.html`, document(file, data));
write("index.html", document("index", pages.index, true));
const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#087E8B"/><path d="M18 17v19c0 8 5 13 13 13h15V37H32c-2 0-3-1-3-3V17z" fill="white"/><path d="M44 13s-8 10-8 15a8 8 0 0 0 16 0c0-5-8-15-8-15" fill="#a8e0df"/></svg>`;
write("assets/images/branding/mark.svg", mark);
write("assets/images/branding/favicon.svg", mark);
for (const [name, color] of [
    ["logo", "#12304A"],
    ["logo-light", "#12304A"],
    ["logo-dark", "#ffffff"],
])
    write(
        `assets/images/branding/${name}.svg`,
        `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="70" viewBox="0 0 300 70"><svg width="64" height="64">${mark.replace(/<svg[^>]*>|<\/svg>/g, "")}</svg><text x="78" y="39" fill="${color}" font-family="Arial,sans-serif" font-weight="700" font-size="36">stackly</text><text x="80" y="58" fill="${color}" font-family="Arial,sans-serif" font-size="10" letter-spacing="2">PLUMBING &amp; PIPE REPAIR</text></svg>`,
    );
console.log(`Built ${Object.keys(pages).length} pages and a functional root homepage.`);
