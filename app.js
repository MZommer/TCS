"use strict";
let assert = require("assert");
let compression = require("compression");
let express = require("express");
let fs = require("fs");
let morgan = require("morgan");
let path = require("path");
let cors = require("cors");
const multer  = require('multer');
const upload = multer();
require('dotenv').config()
const db = require("./lib/db");
const TempestClient = require("./lib/client");

// db.createEnv("DEV", "ARS", 1000)
// db.createSpace("UAT", "DEV")

const PUBLIC_PORT = 4000;
const HTTP_HEADERS_TIMEOUT_MS = 410 * 1000;
const HTTP_KEEP_ALIVE_TIMEOUT_MS = 410 * 1000;
const BODYPARSER_LIMIT = "20mb";

// A tiny enum for the app type
const AppType = {
	Public: "public",
	Private: "private"
}

const app = express()

app.set("appType", AppType.Public)

app.set("db", db)
app.set("upload", upload)
app.set("Tempest", TempestClient);
app.set("port", process.env.PORT || PUBLIC_PORT);

app.set("trust proxy", true);
app.set("view engine", "ejs");
// declare middlewares
// Add Cross Origin header to allow any domain to consume APIs
app.use(cors())
app.use(morgan("dev"))

// ensure that the IP is defined
app.use(function (req, res, next) {
    Object.defineProperty(req, "ip", {
        value: (req.ip ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress).trim(),
    });

    return next();
})

app.use(compression())
app.use(express.json({ limit: BODYPARSER_LIMIT }))

// disable auto etag (md5) generation for responses
app.set("etag", false)

// Nothing to serve on "/" on the public port.
app.get("/", function (req, res) {
    return res.end();
});

console.info("Public directory is accessible")
app.use(express.static(__dirname + "/public"))

app.use("/static", express.static(__dirname + "/static"))

app.use((err, req, res, next) => {
    res.status(err.status || 400).json({
        success: false,
        message: err.message || 'An error occured.',
        errors: err.error || undefined,
    });
});

function servicesInit(app, callback){
    // append all available services
    fs.readdir(__dirname + "/services", (err, files) => {
        if (err) return console.error(err);
        for (let i in files) {
            let filename = files[i]
            let filepath = path.join(__dirname, "services", filename)

            let stats = fs.statSync(filepath)
            if (!stats.isFile())
                continue;

            let parts = filename.split(".")
            assert.equal(parts.length, 3)
            let serviceName = parts[0]
            let version = parts[1]

            // build a router for each service version
            // general URL form: /version/service/...
            let router = express.Router({
                caseSensitive: true,
                strict: true
            })

            let urlPrefix = "/" + serviceName + "/" + version

            // Both the app types have been initialized with the same libs
            // so we can provide either of them to the services, here appPublic.
            require(filepath)(app, router, urlPrefix);

            // Routes that are supposed to be accessed publicly.
            app.use(urlPrefix, router)
        }
        callback(app);
    })
}
servicesInit(app, app => {
    // start http server
    let httpServer = app.listen(app.get("port"), function () {
        console.log({
            port: app.get("port"),
            api: app.get("appType")
        }, "Server listening");
    });

    // The value set here is higher than the AWS ELB configured timeout. This ensures node's default 5 second timeout
    // doesn't close connections causing HTTP 502s at the ELB.
    // source: https://adamcrowder.net/posts/node-express-api-and-aws-alb-502/
    httpServer.keepAliveTimeout = HTTP_KEEP_ALIVE_TIMEOUT_MS
    httpServer.headersTimeout = HTTP_HEADERS_TIMEOUT_MS

    httpServer.timeout = HTTP_KEEP_ALIVE_TIMEOUT_MS
});
