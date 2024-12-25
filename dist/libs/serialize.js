import { areJidsSameUser, extractMessageContent, getDevice } from "@whiskeysockets/baileys";
import fs from "fs";
import config from "../settings/config.js";
import message from "../settings/message.js";
import * as Function from "./function.js";

export async function Serialize(sock, msg) {
    const m = {};
    const botNumber = sock.decodeJid(sock.user?.id);

    if (!msg.message) return;
    if (msg.key && msg.key.remoteJid == "status@broadcast") return;

    m.message = extractMessageContent(msg.message);

    if (msg.key) {
        m.key = msg.key;
        m.from = sock.decodeJid(m.key.remoteJid);
        m.fromMe = m.key.fromMe;
        m.id = m.key.id;
        m.device = getDevice(m.id);
        m.isBaileys = m.id.startsWith("BAE5");
        m.isGroup = m.from.endsWith("@g.us");
        m.participant = !m.isGroup ? false : m.key.participant;
        m.sender = sock.decodeJid(m.fromMe ? sock.user.id : m.isGroup ? m.participant : m.from);
    }

    m.pushName = msg.pushName;
    m.isOwner = m.sender && [...config.options.owner, botNumber.split`@`[0]].includes(m.sender.replace(/\D+/g, ""));
    if (m.isGroup) {
        m.metadata = await sock.groupMetadata(m.from);
        m.admins = m.metadata.participants.reduce(
            (memberAdmin, memberNow) =>
                (memberNow.admin ? memberAdmin.push({ id: memberNow.id, admin: memberNow.admin }) : [...memberAdmin]) && memberAdmin,
            []
        );
        m.isAdmin = !!m.admins.find((member) => member.id === m.sender);
        m.isBotAdmin = !!m.admins.find((member) => member.id === botNumber);
    }

    if (m.message) {
        m.type = sock.getContentType(m.message) || Object.keys(m.message)[0];
        m.msg = extractMessageContent(m.message[m.type]) || m.message[m.type];
        m.mentions = m.msg?.contextInfo?.mentionedJid || [];
        m.body =
            m.msg?.text ||
            m.msg?.conversation ||
            m.msg?.caption ||
            m.message?.conversation ||
            m.msg?.selectedButtonId ||
            m.msg?.singleSelectReply?.selectedRowId ||
            m.msg?.selectedId ||
            m.msg?.contentText ||
            m.msg?.selectedDisplayText ||
            m.msg?.title ||
            m.msg?.name ||
            "";
        m.prefix = config.options.prefix.test(m.body) ? m.body.match(config.options.prefix)[0] : "#";
        m.command = m.body && m.body.replace(m.prefix, "").trim().split(/ +/).shift();
        m.arg =
            m.body
                .trim()
                .split(/ +/)
                .filter((a) => a) || [];
        m.args =
            m.body
                .trim()
                .replace(new RegExp("^" + Function.escapeRegExp(m.prefix), "i"), "")
                .replace(m.command, "")
                .split(/ +/)
                .filter((a) => a) || [];
        m.text = m.args.join(" ");
        m.expiration = m.msg?.contextInfo?.expiration || 0;
        m.timestamp =
            (typeof msg.messageTimestamp === "number"
                ? msg.messageTimestamp
                : msg.messageTimestamp.low
                  ? msg.messageTimestamp.low
                  : msg.messageTimestamp.high) || m.msg.timestampMs * 1000;
        m.isMedia = !!m.msg?.mimetype || !!m.msg?.thumbnailDirectPath;
        if (m.isMedia) {
            m.mime = m.msg?.mimetype;
            m.size = m.msg?.fileLength;
            m.height = m.msg?.height || "";
            m.width = m.msg?.width || "";
            if (/webp/i.test(m.mime)) {
                m.isAnimated = m.msg?.isAnimated;
            }
        }
        m.reply = async (text, options = {}) => {
            let chatId = options?.from ? options.from : m.from;
            let quoted = options?.quoted ? options.quoted : m;

            if (Buffer.isBuffer(text) || /^data:.?\/.*?;base64,/i.test(text) || /^https?:\/\//.test(text) || fs.existsSync(text)) {
                let data = await Function.getFile(text);
                if (!options.mimetype && (/utf-8|json/i.test(data.mime) || data.ext == ".bin" || !data.ext)) {
                    if (!!message.msg[text]) text = message.msg[text];
                    return sock.sendMessage(
                        chatId,
                        { text, mentions: [m.sender, ...sock.parseMention(text)], ...options },
                        { quoted, ephemeralExpiration: m.expiration, ...options }
                    );
                } else {
                    return sock.sendMedia(m.from, data.data, quoted, { ephemeralExpiration: m.expiration, ...options });
                }
            } else {
                if (!!message.msg[text]) text = message.msg[text];
                return sock.sendMessage(
                    chatId,
                    { text, mentions: [m.sender, ...sock.parseMention(text)], ...options },
                    { quoted, ephemeralExpiration: m.expiration, ...options }
                );
            }
        };
        m.download = (filepath) => {
            if (filepath) return sock.downloadMediaMessage(m, filepath);
            else return sock.downloadMediaMessage(m);
        };
        m.react = (emoji) => {
            sock.sendMessage(m.from, {
                react: {
                    text: String(emoji),
                    key: m.key,
                },
            });
        };
    }

    m.isQuoted = false;
    if (m.msg?.contextInfo?.quotedMessage) {
        m.isQuoted = true;
        m.quoted = {};
        m.quoted.message = extractMessageContent(m.msg?.contextInfo?.quotedMessage);

        if (m.quoted.message) {
            m.quoted.type = sock.getContentType(m.quoted.message) || Object.keys(m.quoted.message)[0];
            m.quoted.msg = extractMessageContent(m.quoted.message[m.quoted.type]) || m.quoted.message[m.quoted.type];
            m.quoted.key = {
                remoteJid: m.msg?.contextInfo?.remoteJid || m.from,
                participant: m.msg?.contextInfo?.remoteJid?.endsWith("g.us") ? sock.decodeJid(m.msg?.contextInfo?.participant) : false,
                fromMe: areJidsSameUser(sock.decodeJid(m.msg?.contextInfo?.participant), sock.decodeJid(sock?.user?.id)),
                id: m.msg?.contextInfo?.stanzaId,
            };
            m.quoted.from = m.quoted.key.remoteJid;
            m.quoted.fromMe = m.quoted.key.fromMe;
            m.quoted.id = m.msg?.contextInfo?.stanzaId;
            m.quoted.device = getDevice(m.quoted.id);
            m.quoted.isBaileys = m.quoted.id.startsWith("BAE5");
            m.quoted.isGroup = m.quoted.from.endsWith("@g.us");
            m.quoted.participant = m.quoted.key.participant;
            m.quoted.sender = sock.decodeJid(m.msg?.contextInfo?.participant);

            m.quoted.isOwner = m.quoted.sender && [...config.options.owner, botNumber.split`@`[0]].includes(m.quoted.sender.replace(/\D+/g, ""));
            if (m.quoted.isGroup) {
                m.quoted.metadata = await sock.groupMetadata(m.quoted.from);
                m.quoted.admins = m.quoted.metadata.participants.reduce(
                    (memberAdmin, memberNow) =>
                        (memberNow.admin ? memberAdmin.push({ id: memberNow.id, admin: memberNow.admin }) : [...memberAdmin]) && memberAdmin,
                    []
                );
                m.quoted.isAdmin = !!m.quoted.admins.find((member) => member.id === m.quoted.sender);
                m.quoted.isBotAdmin = !!m.quoted.admins.find((member) => member.id === botNumber);
            }

            m.quoted.mentions = m.quoted.msg?.contextInfo?.mentionedJid || [];
            m.quoted.body =
                m.quoted.msg?.text ||
                m.quoted.msg?.caption ||
                m.quoted?.message?.conversation ||
                m.quoted.msg?.selectedButtonId ||
                m.quoted.msg?.singleSelectReply?.selectedRowId ||
                m.quoted.msg?.selectedId ||
                m.quoted.msg?.contentText ||
                m.quoted.msg?.selectedDisplayText ||
                m.quoted.msg?.title ||
                m.quoted?.msg?.name ||
                "";
            m.quoted.prefix = config.options.prefix.test(m.quoted.body) ? m.quoted.body.match(config.options.prefix)[0] : "#";
            m.quoted.command = m.quoted.body && m.quoted.body.replace(m.quoted.prefix, "").trim().split(/ +/).shift();
            m.quoted.arg =
                m.quoted.body
                    .trim()
                    .split(/ +/)
                    .filter((a) => a) || [];
            m.quoted.args =
                m.quoted.body
                    .trim()
                    .replace(new RegExp("^" + Function.escapeRegExp(m.quoted.prefix), "i"), "")
                    .replace(m.quoted.command, "")
                    .split(/ +/)
                    .filter((a) => a) || [];
            m.quoted.text = m.quoted.args.join(" ");
            m.quoted.isMedia = !!m.quoted.msg?.mimetype || !!m.quoted.msg?.thumbnailDirectPath;
            if (m.quoted.isMedia) {
                m.quoted.mime = m.quoted.msg?.mimetype;
                m.quoted.size = m.quoted.msg?.fileLength;
                m.quoted.height = m.quoted.msg?.height || "";
                m.quoted.width = m.quoted.msg?.width || "";
                if (/webp/i.test(m.quoted.mime)) {
                    m.quoted.isAnimated = m?.quoted?.msg?.isAnimated || false;
                }
            }
            m.quoted.reply = (text, options = {}) => {
                return m.reply(text, { quoted: m.quoted, ...options });
            };
            m.quoted.download = (filepath) => {
                if (filepath) return sock.downloadMediaMessage(m.quoted, filepath);
                else return sock.downloadMediaMessage(m.quoted);
            };
        }
    }

    return m;
}
