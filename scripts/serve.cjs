const http = require("http");
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const types = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".png": "image/png",
    ".woff2": "font/woff2",
    ".xml": "application/xml",
    ".txt": "text/plain",
};
http.createServer((request, response) => {
    let pathname;
    try {
        pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    } catch {
        response.writeHead(400).end();
        return;
    }
    if (pathname.endsWith("/")) pathname += "index.html";
    const file = path.resolve(root, "." + pathname);
    if (!file.startsWith(root + path.sep)) {
        response.writeHead(403).end();
        return;
    }
    fs.readFile(file, (error, content) => {
        if (error) {
            response
                .writeHead(404, { "Content-Type": "text/plain" })
                .end("Page not found. Visit /pages/404.html");
            return;
        }
        response.writeHead(200, {
            "Content-Type": types[path.extname(file)] || "application/octet-stream",
        });
        response.end(content);
    });
}).listen(4173, "127.0.0.1", () => console.log("Stackly preview: http://127.0.0.1:4173"));
