import express = require("express");
import fs = require("node:fs");
import path = require("node:path");
import crypto = require("node:crypto");
import https = require("https");
import { createTypeAssertion, visitFunctionBody } from "typescript";

const app = express();

const PORT: Number = 80;

const PORTHTTPS: Number = 8080;


app.use(express.json());

app.get("/", (req, res) => {
    if(fs.existsSync(path.join(path.join(__dirname, "../page/"), "index.html"))) {
        res.status(200).sendFile(path.join(path.join(__dirname, "../page/"), "index.html"));
        return;
    }
});

//app.use('/scripts', express.static(path.join(__dirname, "../page/scripts/")))

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
)
