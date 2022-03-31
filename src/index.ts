import express = require("express");
import fs = require("node:fs");
import path = require("node:path");
import crypto = require("node:crypto");
import https = require("https");
import { createTypeAssertion, visitFunctionBody } from "typescript";

const app = express();

const PORT: Number = 80;

const PORTHTTPS: Number = 8080;

process.on('uncaughtException', function(err) {
    console.log("Fatal error: " + err);
    console.log(err.stack);
});

process.on('exit', function(code) {
    console.log("Exiting with code " + code);
});

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