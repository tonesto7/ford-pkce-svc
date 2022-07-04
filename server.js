const appVer = require("./package.json");
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

    app.get("/getChallenge", (req, res) => {
        const c = pkceChallenge();
        res.type("application/json").send(JSON.stringify(c));
    });
    const PORT = process.env.PORT ? process.env.PORT : 3000;
    app.listen(PORT, () => {
        console.log(`** API (v${appVer}) is Running at (IP: ${getIPAddress()} | Port: ${PORT}) | ProcessId: ${process.pid} **`);
    });
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
