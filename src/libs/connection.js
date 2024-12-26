import config from "../settings/config.js";
import Handler from "../messages/handler.js";
import { Client } from "./client.js";
import {
    makeWASocket,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    makeInMemoryStore,
    useMultiFileAuthState,
    Browsers,
} from "baileys";
import NodeCache from "node-cache";
import P from "pino";
import path from "path";

import colors from "./colors.js";

const pairingCode = config.options?.pairingNumber;
const msgRetryCounterCache = new NodeCache();
const logger = P({ timestamp: () => `,"time":"${new Date().toISOString()}"` }); //, P.destination(path.resolve("./dist/temps/wa-logs.txt")));
logger.level = "fatal"; // trace

// const pathStore = path.resolve("./dist/temps/baileys_store_multi.json");
const store = makeInMemoryStore({ logger });
/* store.readFromFile(pathStore);
setInterval(() => store.writeToFile(pathStore), 30_000); */

export default async function connectToWhatsApp() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState(path.resolve((config.options?.sessionName || "lorraine_sessions")));
        const { version, isLatest } = await fetchLatestBaileysVersion();
        console.log(`[ ${colors.green("System")} ] Menggunakan WA v${version.join(".")}, versi terbaru: ${isLatest ? "Ya" : "Tidak"}`);

        const sock = makeWASocket({
            version,
            logger,
            printQRInTerminal: false,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, logger),
            },
            browser: Browsers.ubuntu("Chrome"),
            msgRetryCounterCache,
            generateHighQualityLinkPreview: true,
            getMessage: async (key) => {
                const msg = await store.loadMessage(key.remoteJid, key.id);
                return msg?.message;
            },
        });

        store.bind(sock.ev);

        if (pairingCode && !sock.authState.creds.registered) {
            const phoneNumber = config.options.pairingNumber.replace(/[^0-9]/g, "");
            setTimeout(async () => {
                const code = await sock.requestPairingCode(phoneNumber);
                console.log(colors.black(colors.bgGreen("Your Pairing Code:")), colors.white(code?.match(/.{1,4}/g)?.join("-") || code));
            }, 3000);
        }

        await Client({ sock, store });

        sock.ev.process(async (events) => {
            if (events["connection.update"]) {
                const { connection, lastDisconnect, qr } = events["connection.update"];
                if (!pairingCode && qr) {
                    console.log(colors.green("Scan the QR code below, expires in 60 seconds"));
                } else if (connection === "close") {
                    const reason = lastDisconnect?.error?.output?.statusCode;
                    if (reason !== DisconnectReason.loggedOut) {
                        sock.ws.close()
                    }

                    console.log(`[ ${colors.red("System")} ] Exit, Periksa jaringanmu ...`);
                    // process.exit(0);
                    connectToWhatsApp();
                } else if (connection === "connecting") {
                    console.log(`[ ${colors.green("System")} ] Menghubungkan ...`);
                } else if (connection === "open") {
                    sock.user.jid = sock.decodeJid(sock.user.id);
                    console.log(`[ ${colors.cyan("Shiroko")} ] Terhubung. Menunggu pesan ...\n\n`);
                }
            }

            if (events["messages.upsert"]) {
                Handler(sock, events["messages.upsert"]);
            }

            if (events["creds.update"]) {
                await saveCreds();
            }
        });

        return sock;
    } catch (error) {
        console.error(colors.red(error));
    }
}
