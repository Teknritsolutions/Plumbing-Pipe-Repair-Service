const fs = require("fs");
const path = require("path");
const errors = [];
for (const file of [
    "index.html",
    ...fs
        .readdirSync("pages")
        .filter((file) => file.endsWith(".html"))
        .map((file) => "pages/" + file),
]) {
    const html = fs.readFileSync(file, "utf8");
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
        const ref = match[1];
        if (/^(https?:|tel:|mailto:|#|data:)/.test(ref)) continue;
        if (
            !fs.existsSync(
                path.resolve(path.dirname(file), ref.split(/[?#]/)[0]),
            )
        )
            errors.push(file + ": " + ref);
    }
}
console.log(JSON.stringify({ localReferenceErrors: errors }));
if (errors.length) process.exitCode = 1;
