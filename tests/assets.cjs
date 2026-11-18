const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const inventory = JSON.parse(fs.readFileSync("documentation/image-inventory.json", "utf8"));
const errors = [];
const seen = new Map();
for (const [file] of inventory) {
    for (const suffix of ["", "-480"]) {
        const target = path.join("assets/images", file + suffix + ".webp");
        if (!fs.existsSync(target)) errors.push("Missing " + target);
    }
    const target = path.join("assets/images", file + ".webp");
    const hash = crypto.createHash("sha256").update(fs.readFileSync(target)).digest("hex");
    if (seen.has(hash)) errors.push("Duplicate photography " + file + " and " + seen.get(hash));
    seen.set(hash, file);
}
const placements = new Map();
for (const file of fs.readdirSync("pages").filter((file) => file.endsWith(".html"))) {
    const html = fs.readFileSync("pages/" + file, "utf8");
    for (const match of html.matchAll(/<img\b[^>]*\bsrc="([^\"]+\.webp)"[^>]*>/g)) {
        if (placements.has(match[1])) errors.push("Repeated placement " + match[1]);
        placements.set(match[1], file);
    }
}
const report = {
    uniqueOriginalPhotographs: inventory.length,
    uniqueHashes: seen.size,
    staticPlacements: placements.size,
    additionalArticleVariants: 3,
    errors,
};
fs.writeFileSync("tests/asset-report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
