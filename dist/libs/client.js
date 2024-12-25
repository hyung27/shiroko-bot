import config from "../settings/config.js";
import * as Function from "./function.js";
import { writeExif } from "./sticker.js";

import baileys, {
    prepareWAMessageMedia,
    jidNormalizedUser,
    areJidsSameUser,
    generateWAMessageFromContent,
    downloadContentFromMessage,
    toBuffer,
} from "@whiskeysockets/baileys";
import fs from "fs";
import PhoneNumber from "awesome-phonenumber";
import Crypto from "crypto";

export function Client({ sock, store }) {
    delete store.groupMetadata;

    for (let v in store) {
        sock[v] = store[v];
    }

    const client = Object.defineProperties(sock, {
        getContentType: {
            value(content) {
                if (content) {
                    const keys = Object.keys(content);
                    const key = keys.find(
                        (k) =>
                            (k === "conversation" || k.endsWith("Message") || k.endsWith("V2") || k.endsWith("V3")) &&
                            k !== "senderKeyDistributionMessage"
                    );
                    return key;
                }
            },
            enumerable: true,
        },

        decodeJid: {
            value(jid) {
                if (/:\d+@/gi.test(jid)) {
                    const decode = jidNormalizedUser(jid);
                    return decode;
                } else return jid;
            },
        },

        generateMessageID: {
            value(id = "3EB0", length = 18) {
                return id + Crypto.randomBytes(length).toString("hex").toUpperCase();
            },
        },

        getName: {
            value(jid) {
                if (jid === "0@s.whatsapp.net") {
                    return "WhatsApp";
                }

                for (const chatKey in store.messages) {
                    if (store.messages.hasOwnProperty(chatKey)) {
                        const usersArray = store.messages[chatKey].array;
                        const userMsgs = usersArray.filter((m) => m.sender === jid && m?.pushName);
                        if (userMsgs.length !== 0) {
                            return userMsgs[userMsgs.length - 1].pushName;
                        }
                    }
                }

                return PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international");
            },
        },

        sendContact: {
            async value(jid, number, quoted, options = {}) {
                let list = [];
                for (let v of number) {
                    list.push({
                        displayName: await sock.getName(v),
                        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await sock.getName(v + "@s.whatsapp.net")}\nFN:${await sock.getName(v + "@s.whatsapp.net")}\nitem1.TEL;waid=${v}:${v}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:${config.exif.packEmail}\nitem2.X-ABLabel:Email\nitem3.URL:${config.exif.packWebsite}\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`,
                    });
                }
                return sock.sendMessage(
                    jid,
                    {
                        contacts: {
                            displayName: `${list.length} Contact`,
                            contacts: list,
                        },
                        mentions: quoted?.participant ? [sock.decodeJid(quoted?.participant)] : [sock.decodeJid(sock?.user?.id)],
                        ...options,
                    },
                    { quoted, ...options }
                );
            },
            enumerable: true,
        },

        parseMention: {
            value(text) {
                return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + "@s.whatsapp.net") || [];
            },
        },

        downloadMediaMessage: {
            async value(message, filename) {
                let mime = {
                    imageMessage: "image",
                    videoMessage: "video",
                    stickerMessage: "sticker",
                    documentMessage: "document",
                    audioMessage: "audio",
                    ptvMessage: "video",
                }[message.type];

                if ("thumbnailDirectPath" in message.msg && !("url" in message.msg)) {
                    message = {
                        directPath: message.msg.thumbnailDirectPath,
                        mediaKey: message.msg.mediaKey,
                    };
                    mime = "thumbnail-link";
                } else {
                    message = message.msg;
                }

                return await toBuffer(await downloadContentFromMessage(message, mime));
            },
            enumerable: true,
        },

        sendMedia: {
            async value(jid, url, quoted = "", options = {}) {
                let { mime, data: buffer, ext, size } = await Function.getFile(url);
                mime = options?.mimetype ? options.mimetype : mime;
                let data = { text: "" },
                    mimetype = /audio/i.test(mime) ? "audio/mpeg" : mime;
                if (size > 45000000)
                    data = {
                        document: buffer,
                        mimetype: mime,
                        fileName: options?.fileName ? options.fileName : `${sock.user?.name} (${new Date()}).${ext}`,
                        ...options,
                    };
                else if (options.asDocument)
                    data = {
                        document: buffer,
                        mimetype: mime,
                        fileName: options?.fileName ? options.fileName : `${sock.user?.name} (${new Date()}).${ext}`,
                        ...options,
                    };
                else if (options.asSticker || /webp/.test(mime)) {
                    let pathFile = await writeExif({ mimetype, data: buffer }, { ...options });
                    data = { sticker: fs.readFileSync(pathFile), mimetype: "image/webp", ...options };
                    fs.existsSync(pathFile) ? await fs.promises.unlink(pathFile) : "";
                } else if (/image/.test(mime)) data = { image: buffer, mimetype: options?.mimetype ? options.mimetype : "image/png", ...options };
                else if (/video/.test(mime)) data = { video: buffer, mimetype: options?.mimetype ? options.mimetype : "video/mp4", ...options };
                else if (/audio/.test(mime)) data = { audio: buffer, mimetype: options?.mimetype ? options.mimetype : "audio/mpeg", ...options };
                else data = { document: buffer, mimetype: mime, ...options };
                let msg = await sock.sendMessage(jid, data, { quoted, ...options });
                return msg;
            },
            enumerable: true,
        },

        cMod: {
            value(jid, copy, text = "", sender = sock.user.id, options = {}) {
                let mtype = sock.getContentType(copy.message);
                let content = copy.message[mtype];
                if (typeof content === "string") copy.message[mtype] = text || content;
                else if (content.caption) content.caption = text || content.text;
                else if (content.text) content.text = text || content.text;
                if (typeof content !== "string") {
                    copy.message[mtype] = { ...content, ...options };
                    copy.message[mtype].contextInfo = {
                        ...(content.contextInfo || {}),
                        mentionedJid: options.mentions || content.contextInfo?.mentionedJid || [],
                    };
                }
                if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
                if (copy.key.remoteJid.includes("@s.whatsapp.net")) sender = sender || copy.key.remoteJid;
                else if (copy.key.remoteJid.includes("@broadcast")) sender = sender || copy.key.remoteJid;
                copy.key.remoteJid = jid;
                copy.key.fromMe = areJidsSameUser(sender, sock.user.id);
                return baileys.proto.WebMessageInfo.fromObject(copy);
            },
        },

        sendPoll: {
            async value(chatId, name, values, options = {}) {
                let selectableCount = options?.selectableCount ? options.selectableCount : 1;
                return await sock.sendMessage(
                    chatId,
                    {
                        poll: {
                            name,
                            values,
                            selectableCount,
                        },
                        ...options,
                    },
                    { ...options }
                );
            },
            enumerable: true,
        },

        setProfilePicture: {
            async value(jid, media, type = "full") {
                let { data } = await Function.getFile(media);
                if (/full/i.test(type)) {
                    data = await Function.resizeImage(media, 720);
                    await sock.query({
                        tag: "iq",
                        attrs: {
                            to: await sock.decodeJid(jid),
                            type: "set",
                            xmlns: "w:profile:picture",
                        },
                        content: [
                            {
                                tag: "picture",
                                attrs: { type: "image" },
                                content: data,
                            },
                        ],
                    });
                } else {
                    data = await Function.resizeImage(media, 640);
                    await sock.query({
                        tag: "iq",
                        attrs: {
                            to: await sock.decodeJid(jid),
                            type: "set",
                            xmlns: "w:profile:picture",
                        },
                        content: [
                            {
                                tag: "picture",
                                attrs: { type: "image" },
                                content: data,
                            },
                        ],
                    });
                }
            },
            enumerable: true,
        },

        sendGroupV4Invite: {
            async value(
                jid,
                groupJid,
                inviteCode,
                inviteExpiration,
                groupName,
                jpegThumbnail,
                caption = "Invitation to join my WhatsApp Group",
                options = {}
            ) {
                const media = await prepareWAMessageMedia({ image: (await Function.getFile(jpegThumbnail)).data }, { upload: sock.waUploadToServer });
                const message = baileys.proto.Message.fromObject({
                    groupJid,
                    inviteCode,
                    inviteExpiration: inviteExpiration ? parseInt(inviteExpiration) : +new Date(new Date() + 3 * 86400000),
                    groupName,
                    jpegThumbnail: media.imageMessage?.jpegThumbnail || jpegThumbnail,
                    caption,
                });

                const m = generateWAMessageFromContent(jid, message, { userJid: sock.user?.id });
                await sock.relayMessage(jid, m.message, { messageId: m.key.id });

                return m;
            },
            enumerable: true,
        },
    });

    return sock;
}
