import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// === Server Configuration ===
const PORT = 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Define File Paths ===
const pages = {
    home: path.join(__dirname, "pages/index.html"),
    about: path.join(__dirname, "pages/about.html"),
    contact: path.join(__dirname, "pages/contact.html"),
    notFound: path.join(__dirname, "pages/errorPage.html")
};

// === Logging Setup ===
const logDirectory = path.join(__dirname, "logs");
const logFilePath = path.join(logDirectory, "server.log");

try {
    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory);
    }
} catch (err) {
    console.error("Failed to create logs folder:", err);
}

function recordRequest(request) {
    try {
        const logLine = `${new Date().toISOString()} ${request.method} ${request.url}\n`;
        fs.appendFile(logFilePath, logLine, (err) => {
            if (err) console.error("Unable to save log entry:", err);
        });
    } catch (error) {
        console.error("Log writing issue:", error);
    }
}

// === Server Logic ===
const server = http.createServer((req, res) => {
    recordRequest(req);

    const sendHtml = (filePath) => {
        fs.readFile(filePath, "utf-8", (err, content) => {
            if (err) {
                console.error("File read error:", err);
                res.writeHead(500, { "content-type": "text/plain" });
                res.end("Internal Server Error: " + (err.message || String(err)));
                return;
            }
            res.writeHead(200, { "content-type": "text/html" });
            res.end(content);
        });
    };

    if (req.url === "/") {
        sendHtml(pages.home);
    } else if (req.url === "/about") {
        sendHtml(pages.about);
    } else if (req.url === "/contact") {
        sendHtml(pages.contact);
    } else if (req.url === "/data") {
        const data = {
            message: "Greetings from the simple HTTP server!",
            time: new Date().toISOString(),
            path: req.url
        };
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(data));
    } else {
        sendHtml(pages.notFound);
    }
});

server.listen(PORT, () => {
    console.log(`Server is up and running at http://localhost:${PORT}`);
});
