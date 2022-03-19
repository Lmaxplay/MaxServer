"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const app = express();
const PORT = 8080;
app.use(express.json());
app.get("/", (req, res) => {
    if (fs.existsSync(path.join(path.join(__dirname, "../page/"), "index.html"))) {
        res.status(200).sendFile(path.join(path.join(__dirname, "../page/"), "index.html"));
        return;
    }
});
app.get("*", (req, res) => {
    res.set("Sanitized-Value", path.join(__dirname, "../page/", req.path.replaceAll("..", '')));
    if (fs.existsSync(path.join(path.join(__dirname, "../page/"), req.path.replaceAll("..", "__")))) {
        res.status(200).sendFile(path.join(path.join(__dirname, "../page/"), req.path.replaceAll("..", "__")));
        return;
    }
    res.status(404).sendFile(path.join(__dirname, "../page/404.html"));
});
app.use('/scripts', express.static(path.join(__dirname, "../page/scripts/")));
app.post("/hash/", (req, res) => {
    if (crypto.getHashes().includes(req.body['hashtype'])) {
        var jsonValue = {
            sha1: crypto.createHash('sha1').update(req.body['value']).digest('hex'),
            sha224: crypto.createHash('sha224').update(req.body['value']).digest('hex'),
            sha256: crypto.createHash('sha256').update(req.body['value']).digest('hex'),
            sha384: crypto.createHash('sha384').update(req.body['value']).digest('hex'),
            sha512: crypto.createHash('sha512').update(req.body['value']).digest('hex'),
            md5: crypto.createHash('md5').update(req.body['value']).digest('hex'),
            length: req.body['value'].length,
            supported: crypto.getHashes()
        };
        jsonValue[req.body['hashtype']] = crypto.createHash(req.body['hashtype']).update(req.body['value']).digest('hex');
        res.send(jsonValue);
    }
    res.send({
        sha1: crypto.createHash('sha1').update(req.body['value']).digest('hex'),
        sha224: crypto.createHash('sha224').update(req.body['value']).digest('hex'),
        sha256: crypto.createHash('sha256').update(req.body['value']).digest('hex'),
        sha384: crypto.createHash('sha384').update(req.body['value']).digest('hex'),
        sha512: crypto.createHash('sha512').update(req.body['value']).digest('hex'),
        md5: crypto.createHash('md5').update(req.body['value']).digest('hex'),
        length: req.body['value'].length,
        supported: crypto.getHashes()
    });
});
app.listen(PORT, () => {
    console.log("available at http://localhost:8080");
});
