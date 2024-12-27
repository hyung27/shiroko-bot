import colors from "../libs/colors.js";
import { Serialize } from "../libs/serialize.js";
import config from "../settings/config.js";

export default async function Handler(sock, upsert) {
    if (upsert.type === "notify") {
        for (const msg of upsert.messages) {
            try {
                if (msg) {
                    let m = await Serialize(sock, msg);
                    // console.log(JSON.stringify(m, null, 2))
                    // console.log(m)
                    if (!m?.key) return;
                    if (!m?.message) return;
                    if (m?.key?.fromMe) return;
                    if (!m?.body) return;
                    if (Object.keys(msg.message)[0] == "protocolMessage") return;
                    if (!m) return;

                    const prefix = config.options.prefix;
                    const isCmd = prefix.test(m.body);
                    const text = isCmd ? m.body.slice(1).split(" ")[0] : m.body.split(" ")[0];
                    const { sender, pushName } = m;

                    if (!(Object.keys(global.users).includes(sender))) {
                        if (config.options.owner.some((v) => v + global.net == sender) || sender == config.options.pairingNumber + global.net) {
                            global.users[sender] = { ...config.default.defaultUser, owner: true, premium: true };
                        } else {
                            global.users[sender] = { ...config.default.defaultUser };
                        }
                    }

                    const len = m.body.length
                    console.log(`[ ${isCmd ? "CMD" : "MESSAGE"} ] [ ${pushName ? pushName : "Komunitas"} ] - Message: ${len > 100 ? m.body.slice(0, 100) + "..." : m.body}`);

                    global.users[sender].name = pushName;
                    global.users[sender].chat += 1;

                    global.ev.emit({
                        command: text,
                        sock,
                        m,
                    });
                }
            } catch (e) {
                console.error(colors.red(e));
            }
        }
    }
}
