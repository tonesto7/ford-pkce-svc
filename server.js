const appVer = require("./package.json").version;
const express = require("express");
const os = require("os");
const app = express();
const path = require("path");
const pkceChallenge = require("pkce-challenge").default;

function startServer() {
    app.use(express.json());
    // app.use("/", express.static(path.join(__dirname, "../../", "public")));
    app.get("/", (req, res) => {
        res.type("application/json").send(JSON.stringify({ version: appVer }));
    });

    app.post("/getChallenge", (req, res) => {
        const c = createPkceChallenge();
        res.type("application/json").send(JSON.stringify(c));
    });

    // app.get("/getChallenge", (req, res) => {
    //     let c = createPkceChallenge();
    //     res.type("application/json").send(JSON.stringify(c));
    // });

    const PORT = process.env.PORT ? process.env.PORT : 3001;
    app.listen(PORT, () => {
        console.log(`** API (v${appVer}) is Running at (IP: ${getIPAddress()} | Port: ${PORT}) | ProcessId: ${process.pid} **`);
    });
}

function testAlphaNumeric(input_string) {
    if (input_string.match(/^[0-9a-z]+$/gi)) {
        console.log("Alpha Numeric", input_string);
        return true;
    } else {
        console.log("Not Alpha Numeric", input_string);
        return false;
    }
}

function createPkceChallenge() {
    const c = pkceChallenge();
    if (!testAlphaNumeric(c.code_verifier) || !testAlphaNumeric(c.code_challenge)) {
        return createPkceChallenge();
    }
    return c;
}

function getIPAddress() {
    let interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        let iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            let alias = iface[i];
            if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal) {
                return alias.address;
            }
        }
    }
    return "0.0.0.0";
}

startServer();
