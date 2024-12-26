import fs from "fs";
import axios from "axios";
import path from "path";
import mimes from "mime-types";
import * as Jimp from "jimp";
import { fileTypeFromBuffer } from "file-type";
import colors from "./colors.js";

export function isUrl(url) {
    let regex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, "gi");
    if (!regex.test(url)) return false;
    return url.match(regex);
}

export const Styles = (text, style = 1) => {
    var xStr = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
    var yStr = Object.freeze({
        1: "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890",
    });
    var replacer = [];
    xStr.map((v, i) =>
        replacer.push({
            original: v,
            convert: yStr[style].split("")[i],
        })
    );
    var str = text.toLowerCase().split("");
    var output = [];
    str.map((v) => {
        const find = replacer.find((x) => x.original == v);
        find ? output.push(find.convert) : output.push(v);
    });
    return output.join("");
};

export function escapeRegExp(string) {
    return string.replace(/[.*=+:\-?^${}()|[\]\\]|\s/g, "\\$&");
}

export function formatDateInTimeZone(date) {
    const options = {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
}

export function formatSize(bytes, si = true, dp = 2) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return `${bytes} B`;
    }

    const units = si ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"] : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    return `${bytes.toFixed(dp)} ${units[u]}`;
}

export function fetchBuffer(string, options = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            if (/^https?:\/\//i.test(string)) {
                let data = await axios.get(string, {
                    headers: {
                        ...(!!options.headers ? options.headers : {}),
                    },
                    responseType: "arraybuffer",
                    ...options,
                });
                let buffer = await data?.data;
                let name = /filename/i.test(data.headers?.get("content-disposition"))
                    ? data.headers
                        ?.get("content-disposition")
                        ?.match(/filename=(.*)/)?.[1]
                        ?.replace(/["';]/g, "")
                    : "";
                let mime = mimes.lookup(name) || data.headers.get("content-type") || (await fileTypeFromBuffer(buffer))?.mime;
                resolve({
                    data: buffer,
                    size: Buffer.byteLength(buffer),
                    sizeH: formatSize(Buffer.byteLength(buffer)),
                    name,
                    mime,
                    ext: mimes.extension(mime),
                });
            } else if (/^data:.*?\/.*?;base64,/i.test(string)) {
                let data = Buffer.from(string.split`,`[1], "base64");
                let size = Buffer.byteLength(data);
                resolve({
                    data,
                    size,
                    sizeH: formatSize(size),
                    ...((await fileTypeFromBuffer(data)) || { mime: "application/octet-stream", ext: ".bin" }),
                });
            } else if (fs.existsSync(string) && fs.statSync(string).isFile()) {
                let data = fs.readFileSync(string);
                let size = Buffer.byteLength(data);
                resolve({
                    data,
                    size,
                    sizeH: formatSize(size),
                    ...((await fileTypeFromBuffer(data)) || { mime: "application/octet-stream", ext: ".bin" }),
                });
            } else if (Buffer.isBuffer(string)) {
                let size = Buffer?.byteLength(string) || 0;
                resolve({
                    data: string,
                    size,
                    sizeH: formatSize(size),
                    ...((await fileTypeFromBuffer(string)) || { mime: "application/octet-stream", ext: ".bin" }),
                });
            } else if (/^[a-zA-Z0-9+/]={0,2}$/i.test(string)) {
                let data = Buffer.from(string, "base64");
                let size = Buffer.byteLength(data);
                resolve({
                    data,
                    size,
                    sizeH: formatSize(size),
                    ...((await fileTypeFromBuffer(data)) || { mime: "application/octet-stream", ext: ".bin" }),
                });
            } else {
                let buffer = Buffer.alloc(20);
                let size = Buffer.byteLength(buffer);
                resolve({
                    data: buffer,
                    size,
                    sizeH: formatSize(size),
                    ...((await fileTypeFromBuffer(buffer)) || { mime: "application/octet-stream", ext: ".bin" }),
                });
            }
        } catch (e) {
            reject(new Error(e?.message || e));
        }
    });
}

export async function getFile(PATH, save) {
    try {
        let filename = null;
        let data = await fetchBuffer(PATH);

        if (data?.data && save) {
            filename = path.join(process.cwd(), "dist/temps", Date.now() + "." + data.ext);
            fs.promises.writeFile(filename, data?.data);
        }
        return {
            filename: data?.name ? data.name : filename,
            ...data,
        };
    } catch (e) {
        throw e;
    }
}

export async function resizeImage(buffer, height) {
    buffer = (await getFile(buffer)).data;

    return new Promise((resolve, reject) => {
        Jimp.read(buffer, (err, image) => {
            if (err) {
                reject(err);
                return;
            }

            image.resize(Jimp.AUTO, height).getBuffer(Jimp.MIME_PNG, (err, resizedBuffer) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(resizedBuffer);
            });
        });
    });
}

export async function loadPlugins() {
    try {
        let plugins = [];
        console.log(`[ ${colors.green("System")} ] Mengambil semua Plugin...`);
        let extendPluginsDefault = {
            /** Function lokal yang hanya bisa diginakan di file plugins yang sama */
            func: [],

            /** Function yang akan di inisialisasi atau dijalankan pertama kali ketika ada perintah seperti .menu */
            funcInit: [],

            /** Function utama */
            run: async () => { },

            /** Function khusus untuk public atau user ( Jika ingin membuat function khsus untuk user / public yang berbeda dengan owner ) */
            publicRun: async () => { },
            
            /** Command */
            cmd: [],
            
            /** Kategory untuk command */
            cats: [],
            
            /** isOwner? true berarti hanya owner yang bisa menggunakan perintah tertentu */
            owner: false,
            
            /** isPremium ? true berarti hanya user premium yang bisa menggunakan */
            premium: false,
            
            /** true = command setidaknya harus memasukan 1 argument pada commandnya */
            args: false,
            
            /** true = Pesan apapun akan langsung mengtrigger function tertentu */
            pass: false,
            
            /** false = Menonaktifkan command / plugin */
            active: true,
            
            /** true = Tampilkan `Sedang mengetik ...` untuk command ini */
            typing: false,
            
            /** type spesifik untuk command ["ALL"] = semua media / pesan ["IMAGE", "VIDEO", "STICKER", "ALL", "AUDIO"] */
            type: ["ALL"],
            
            /** Setting limit untuk pemakaian command, limit: true berarti akan mengurangi 1 limit setiap user menjalankan fitur, limit: 5 berarti mengurangi 5 limit */
            limit: true,
        }
        let current = [];
        let handler = async () => {
            return {
                func: (callback) => {
                    try {
                        current.length ? null : current.push(Object.assign({}, extendPluginsDefault));
                        current.forEach((v, i, a) => {
                            a[i] = Object.assign({}, a[i], { func: [...a[i].func, callback] })
                        })
                    } catch (e) {
                        console.log(e)
                    }
                },

                add: (extendPlugins) => {
                    try {
                        !(extendPlugins.active ?? extendPluginsDefault.active) ? extendPlugins.cmd.length ? extendPlugins.cats = [] : null : null;
                        !(extendPlugins.active ?? extendPluginsDefault.active) ? null : extendPlugins.cmd.length ? !current.some(v => v.func.length) ? current.push(Object.assign({}, extendPluginsDefault, extendPlugins)) : current[0] = (Object.assign({}, extendPluginsDefault, extendPlugins, { func: current[0].func })) : null;
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        };
        const readFolder = async (jalur) => {
            try {
                const f = await fs.readdirSync(jalur);
                for (const ff of f) {
                    if (ff.startsWith("__")) {
                        continue
                    } else if (await fs.statSync(path.join(jalur, ff)).isDirectory()) {
                        await readFolder(path.join(jalur, ff))
                    } else {
                        await (await (await import("file://" + path.join(process.cwd(), jalur, ff))).default)(await handler());
                        plugins.push(...current)
                        current = null
                        current = []
                    }
                }
            } catch (e) {
                console.log(e)
            }
        };

        await readFolder("plugins");
        for (const pl of plugins) {
            if (pl.funcInit.length != 0) {
                for (const f of pl.funcInit) {
                    try {
                        await f()
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        }

        console.log(`[ ${colors.green("System")} ] ${Object.keys(plugins).length} Total plugin`);
        console.log(`[ ${colors.green("System")} ] Mengkonversi ...`);
        for (const v of plugins) {
            (v.cmd.length != 0 ? v.cmd.flat() : ["Syntx"]).forEach((e) => {
                try {
                    global.ev.on(e, v)
                } catch (e) {
                    console.log(e)
                }
            });
        }
        console.log(`[ ${colors.green("System")} ] ${global.ev.events.size} Total listener`);
        Object.keys(plugins).forEach((v) => {
            Object.keys(v).forEach((f) => {
                plugins[v][f] = null;
            })
        })
        Object.keys(extendPluginsDefault).forEach((v) => {
            extendPluginsDefault[v] = null;
        })
    } catch (error) {
        console.log(error);
    }
}