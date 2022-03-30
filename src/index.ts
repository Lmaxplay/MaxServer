import express = require("express");
import fs = require("node:fs");
import path = require("node:path");
import crypto = require("node:crypto");
import https = require("https");
import { createTypeAssertion, visitFunctionBody } from "typescript";

const app = express();

const PORT: Number = 80;

const PORTHTTPS: Number = 8080;

app.use(function(req, res, next) {
    res.setHeader('X-Powered-By', 'Express');
    next();
});

//Prevent XSS
app.use(function(req, res, next) {
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

//Prevent clickjacking
app.use(function(req, res, next) {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    next();
});

//Prevent MIME sniffing
app.use(function(req, res, next) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

//Prevent IE from caching
app.use(function(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

//CORS
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

//Prevent access to files in the private folder
app.use(function(req, res, next) {
    if (req.url.startsWith("/private")) {
        res.status(403).send("Forbidden");
    } else {
        next();
    }
});

//Disallow old versions of IE
app.use(function(req, res, next) {
    if (req.headers["user-agent"] != null) {
        if (req.headers["user-agent"].includes("MSIE")) {
            res.status(403).send("Forbidden");
        } else {
            next();
        }
    } else {
        next();
    }
});

app.use(express.json());

//If the request is a POST request, check if the request body is valid JSON
app.use(function(req, res, next) {
    if (req.method == "POST") {
        if (req.headers["content-type"] != null) {
            if (req.headers["content-type"].includes("application/json")) {
                try {
                    JSON.parse(req.body);
                    next();
                } catch (e) {
                    res.status(400).send("Bad Request");
                }
            } else {
                res.status(400).send("Bad Request");
            }
        } else {
            res.status(400).send("Bad Request");
        }
    } else {
        next();
    }
});

//Unset the X-Powerd-By header
app.use(function(req, res, next) {
    res.removeHeader("X-Powered-By");
    next();
});

// Automatically set the Content-Type header
app.use(function(req, res, next) {
    
    if (req.url.endsWith(".html")) {
        res.setHeader("Content-Type", "text/html");
    } else if (req.url.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
    } else if (req.url.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
    } else if (req.url.endsWith(".png")) {
        res.setHeader("Content-Type", "image/png");
    } else if (req.url.endsWith(".jpg")) {
        res.setHeader("Content-Type", "image/jpeg");
    } else if (req.url.endsWith(".jpeg")) {
        res.setHeader("Content-Type", "image/jpeg");
    } else if (req.url.endsWith(".gif")) {
        res.setHeader("Content-Type", "image/gif");
    } else if (req.url.endsWith(".svg")) {
        res.setHeader("Content-Type", "image/svg+xml");
    } else if (req.url.endsWith(".woff")) {
        res.setHeader("Content-Type", "application/font-woff");
    } else if (req.url.endsWith(".woff2")) {
        res.setHeader("Content-Type", "application/font-woff2");
    } else if (req.url.endsWith(".ttf")) {
        res.setHeader("Content-Type", "application/font-ttf");
    } else if (req.url.endsWith(".eot")) {
        res.setHeader("Content-Type", "application/vnd.ms-fontobject");
    } else if (req.url.endsWith(".otf")) {
        res.setHeader("Content-Type", "application/font-otf");
    } else if (req.url.endsWith(".mp4")) {
        res.setHeader("Content-Type", "video/mp4");
    } else if (req.url.endsWith(".webm")) {
        res.setHeader("Content-Type", "video/webm");
    } else if (req.url.endsWith(".ogg")) {
        res.setHeader("Content-Type", "video/ogg");
    } else if (req.url.endsWith(".ogv")) {
        res.setHeader("Content-Type", "video/ogg");
    } else if (req.url.endsWith(".mp3")) {
        res.setHeader("Content-Type", "audio/mpeg");
    } else if (req.url.endsWith(".wav")) {
        res.setHeader("Content-Type", "audio/wav");
    } else if (req.url.endsWith(".webm")) {
        res.setHeader("Content-Type", "audio/webm");
    } else if (req.url.endsWith(".ogg")) {
        res.setHeader("Content-Type", "audio/ogg");
    } else if (req.url.endsWith(".oga")) {
        res.setHeader("Content-Type", "audio/ogg");
    } else if (req.url.endsWith(".mp3")) {
        res.setHeader("Content-Type", "audio/mpeg");
    } else if (req.url.endsWith(".m4a")) {
        res.setHeader("Content-Type", "audio/mp4");
    } else if (req.url.endsWith(".m4b")) {
        res.setHeader("Content-Type", "audio/mp4");
    } else if (req.url.endsWith(".m4p")) {
        res.setHeader("Content-Type", "audio/mp4");
    } else if (req.url.endsWith(".m4r")) {
        res.setHeader("Content-Type", "audio/mp4");
    } else if (req.url.endsWith(".m4v")) {
        res.setHeader("Content-Type", "audio/mp4");
    } else if (req.url.endsWith(".m4s")) {
        res.setHeader("Content-Type", "audio/mp4");
    } else if (req.url.endsWith(".swf")) {
        res.setHeader("Content-Type", "application/x-shockwave-flash");
    }
});

app.get("/", (req, res) => {
    if(fs.existsSync(path.join(path.join(__dirname, "../page/"), "index.html"))) {
        res.status(200).sendFile(path.join(path.join(__dirname, "../page/"), "index.html"));
        return;
    }
});

app.post("/hash/", (req, res) => {
    res.send({
        md5: crypto.createHash('md5').update(req.body['value']).digest('hex'),
        sha1: crypto.createHash('sha1').update(req.body['value']).digest('hex'),
        sha224: crypto.createHash('sha224').update(req.body['value']).digest('hex'),
        sha256: crypto.createHash('sha256').update(req.body['value']).digest('hex'),
        sha384: crypto.createHash('sha384').update(req.body['value']).digest('hex'),
        sha512: crypto.createHash('sha512').update(req.body['value']).digest('hex'),
        sha3_224: crypto.createHash('sha3-224').update(req.body['value']).digest('hex'),
        sha3_256: crypto.createHash('sha3-256').update(req.body['value']).digest('hex'),
        sha3_384: crypto.createHash('sha3-384').update(req.body['value']).digest('hex'),
        sha3_512: crypto.createHash('sha3-512').update(req.body['value']).digest('hex'),
        sha512_256: crypto.createHash('sha512-256').update(req.body['value']).digest('hex'),
        md5_sha1: crypto.createHash('md5-sha1').update(req.body['value']).digest('hex'),
        length: req.body['value'].length,
        //supported: crypto.getHashes()
    });
});

app.get("/ip", (req, res) => {
    res.status(200).send(req.ip);
});

app.get("*", (req, res) => {
    res.set("Sanitized-Value", path.join(__dirname, "../page/", req.path.replaceAll("..", '')));
    if(fs.existsSync(path.join(path.join(__dirname, "../page/"), req.path.replaceAll("..", "__")))) {
        res.status(200).sendFile(path.join(path.join(__dirname, "../page/"), req.path.replaceAll("..", "__")));
        return;
    }
    res.status(404).sendFile(path.join(__dirname, "../page/404.html"));
});

app.listen(PORT, () => {
    console.log(`available at http://localhost:${PORT}`);
})

https.createServer(
    {
        key: fs.readFileSync(path.join(__dirname, "./localhost.key")),
        cert: fs.readFileSync(path.join(__dirname, "./localhost.crt")),
    },
    app
).listen(PORTHTTPS, () => {
    console.log(`available at https://localhost:${PORTHTTPS}`);
    }
);
