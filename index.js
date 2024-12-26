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

import connectToWhatsApp from "./src/libs/connection.js";
import { loadPlugins } from "./src/libs/function.js";
import EventEmitter from "./src/libs/eventEmitter.js";
import config from "./src/settings/config.js";

global.__pathname = fileURLToPath(import.meta.url);
global.__dirname = dirname(__pathname);
global.ev = new EventEmitter();

global.net = "@s.whatsapp.net";
global.users = {};
global.init = true;

global.saveUserInfo = async (value) => {
    await fs.writeFileSync("./src/database/users.json", JSON.stringify(value))
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

async function initialize() {
    const worker = [
        (async () => {
            const dt = await fs.readFileSync("./src/database/users.json", "utf-8");
            global.users = await JSON.parse(dt)
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