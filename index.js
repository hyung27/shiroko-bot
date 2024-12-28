/**
 * Lighweight Whatsapp Base Bot
 * Name: Shiroko Bot
 * Created By: X-Dev
 * Copyright 2024 MIT License
*/

import cfonts from "cfonts";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import cron from "node-cron";

import connectToWhatsApp from "./src/libs/connection.js";
import { loadPlugins } from "./src/libs/function.js";
import EventEmitter from "./src/libs/eventEmitter.js";
import config from "./src/settings/config.js";
import colors from "./src/libs/colors.js";

global.__pathname = fileURLToPath(import.meta.url);
global.__dirname = dirname(__pathname);
global.ev = new EventEmitter();

global.net = "@s.whatsapp.net";
global.init = true;
global.initFont = true;

global.users = {};
global.panel = {};
global.antiSpam = false;
global.showAll = true;
global.dataPanel = {
    "1gb": {
        "ram": "1024",
        "cpu": "10",
        "memory": "1024"
    },
    "2gb": {
        "ram": "2048",
        "cpu": "20",
        "memory": "2048"
    },
    "3gb": {
        "ram": "3072",
        "cpu": "30",
        "memory": "3072"
    },
    "4gb": {
        "ram": "4096",
        "cpu": "40",
        "memory": "4096"
    },
    "5gb": {
        "ram": "5120",
        "cpu": "50",
        "memory": "5120"
    },
    "6gb": {
        "ram": "6144",
        "cpu": "60",
        "memory": "6144"
    },
    "7gb": {
        "ram": "7168",
        "cpu": "70",
        "memory": "7168"
    },
    "8gb": {
        "ram": "8192",
        "cpu": "80",
        "memory": "8192"
    },
    "9gb": {
        "ram": "9216",
        "cpu": "90",
        "memory": "9216"
    },
    "10gb": {
        "ram": "10240",
        "cpu": "100",
        "memory": "10240"
    },
    "11gb": {
        "ram": "11264",
        "cpu": "100",
        "memory": "11264"
    },
    "12gb": {
        "ram": "12288",
        "cpu": "100",
        "memory": "12288"
    },
    "13gb": {
        "ram": "13312",
        "cpu": "100",
        "memory": "13312"
    },
    "14gb": {
        "ram": "14346",
        "cpu": "100",
        "memory": "14346"
    },
    "15gb": {
        "ram": "15360",
        "cpu": "100",
        "memory": "15360"
    },
    "16gb": {
        "ram": "16384",
        "cpu": "100",
        "memory": "16384"
    },
    "unli": {
        "ram": "0",
        "cpu": "0",
        "memory": "0"
    },
}

global.saveUserInfo = async (value) => {
    await fs.writeFileSync("./src/database/users.json", JSON.stringify(value))
}
global.savePanel = () => {
    fs.writeFileSync("./src/database/panel.json", JSON.stringify(Object.values(global.panel), null, 2));
}
global.reloadHandler = async () => {
    console.clear();
    console.log(`[ ${colors.green("System")} ] Perubahan terdeteksi, reload ulang...`)
    global.ev = null;
    global.ev = new EventEmitter();
    await loadPlugins();
}

console.clear()
cfonts.say("SHIROKO", {
    font: "shade",
    align: "center",
    color: ["cyan"],
});

global.ftroly = async (desc, thumb = false) => {
    return {
        key: { remoteJid: "0@s.whatsapp.net", participant: "0@s.whatsapp.net" },
        message: {
            orderMessage: {
                itemCount: 9999999999,
                status: 1,
                surface: 1,
                ...(thumb ? { thumbnail: await getBuffer(thumb) } : {}),
                message: desc,
                orderTitle: config.options.botName,
                sellerJid: "0@s.whatsapp.net",
            },
        },
        sendEphemeral: true
    }
}

global.fnewsletter = async (desc) => {
    return {
        key: { remoteJid: "0@s.whatsapp.net", participant: "0@s.whatsapp.net" },
        message: {
            newsletterAdminInviteMessage: {
                caption: desc,
                newsletterJid: settings.newsletterJid ? settings.newsletterJid : '120363361999470509@newsletter',
                newsletterName: settings.newsletterName,
                jpegThumbnail: await Buffer.from((await Axios.get(settings.thumbnailDocument, { responseType: "arraybuffer" })).data)
            }
        },
        sendEphemeral: true
    }
}

cron.schedule("0 0 0 * * *", () => {
    Object.keys(global.users).forEach((u) => {
        global.users[u].limit = config.options.limit
    })
})

async function initialize() {
    const worker = [
        (async () => {
            const dt = await fs.readFileSync("./src/database/users.json", "utf-8");
            global.users = await JSON.parse(dt)
        })(),
        (async () => {
            const dt = await fs.readFileSync("./src/database/panel.json", "utf-8");
            const j = await JSON.parse(dt);
            const mix = [...new Map([...j, ...config.options.panel].map(v => [v.domain, v])).values()].filter((p) => p.domain)
            global.panel = { ...mix.reduce((a, c, i) => { const f = { ...a }; f[`v${i + 1}`] = c; return f }, {}) }
        })()
    ]
    await Promise.all(worker)
}

async function start() {
    if (global.init) {
        await initialize();
        global.init = false;
    }
    await loadPlugins();
    connectToWhatsApp();
}

start();