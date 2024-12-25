import chalk from "chalk";
import { Serialize } from "../libs/serialize.js";

export default async function Handler(sock, upsert) {
    if (upsert.type === "notify") {
        for (const msg of upsert.messages) {
            try {
                let m = await Serialize(sock, msg);
                if (!m) return;

                const prefix = m.prefix;
                const isCmd = m.body.startsWith(prefix);
                const command = isCmd ? m.command.toLowerCase() : "";
                const quoted = m.isQuoted ? m.quoted : m;

                console.log(m);
            } catch (e) {
                console.error(chalk.red(e));
            }
        }
    }
}
