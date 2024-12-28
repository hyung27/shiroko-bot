import axios from "axios";
import config from "../settings/config.js";
import messageInfo from "../settings/message.js";

class EventEmitter {
  constructor() {
    this.events = new Map();
    this.globalFunction = new Map();
    this.sys = {};
    this.exp = {};
  }

  clear() {
    this.events.clear();
    this.globalFunction.clear();
    this.sys = {};
    this.exp = {};
  }

  on(event, listener) {
    try {
      if (!this.events.has(event)) {
        this.events.set(event, []);
      }
      Array.isArray(listener) ? this.events.get(event).push(...listener) : this.events.get(event).push(listener);
    } catch (error) {
      console.error(error);
    }
  }

  off(event) {
    if (!this.events.has(event)) return;
    this.events.forEach(v => {
      v.forEach(b => {
        b.cmd.forEach((n, l) => {
          if (n == event || (Array.isArray(n) && n.some((k) => k == event))) {
            const j = this.events.get(event)
            console.log(event, n, j)
            Array.isArray(n) ? j.forEach((_, i) => j[i].cmd = b.cmd.filter(x => !x.includes(event))) : j.forEach((_, i) => j[i].cmd = b.cmd.filter(x => x != event))
            Array.isArray(n) ? n.forEach(w => this.events.delete(w)) : this.events.delete(n);
          }
        })
      })
    })
  }

  async emit(event) {
    let other;
    let senders;

    try {
      let pluginCall = {};
      this.sys = {};
      this.exp = {};

      const { command: cmds, m, sock } = event;
      const command = this.events.has(cmds) ? cmds : "pass";
      const { from, pushName, sender, body, isGroup } = m;
      senders = sender;
      const prefix = config.options.prefix;
      const noPrefix = prefix.test(m.body) ? body.slice(1) : body;
      const parseCommand = noPrefix.split(" ");
      const text = noPrefix.split(" ").slice(1).join(" ");
      const cmd = prefix.test(m.body)
        ? (prefix.test(m.body) ? body.slice(1) : body).split(" ")[0]
        : parseCommand[0];

      const dpluginCall =
        command == "pass"
          ? this.events.get("pass")
          : [...this.events]
            .filter(([key, value]) => value[0].cmd[0] instanceof RegExp)
            .map(([key, value]) =>
              key.test(noPrefix) ? value[0] : this.events.get(command)
            )[0];
      pluginCall = dpluginCall ? dpluginCall : this.events.get(command);
      if (!pluginCall) return;

      for (const plugin of pluginCall) {
        this.sys.sticker = async (sticker, ephe = true, jid = false) => sock.sendMessage(
          jid ? jid : from,
          {
            sticker: typeof sticker == "object" ? sticker : { url: sticker },
            mentions: [sender],
            ...(!sender.endsWith("@newsletter") ? { ai: true } : {}),
            contextInfo: {
              ...(config.message.forwarded ? {
                forwardingScore: 999,
                isForwarded: true,
              } : {})
            },
          },
          {
            quoted: await global.ftroly(config.options.botName),
            ...(ephe && !sender.endsWith("@newsletter") ? { ephemeralExpiration: 86400 } : {})
          }
        );
        this.sys.text = async (teks, ephe = true, jid = false) => sock.sendMessage(
          jid ? jid : from,
          {
            text: teks,
            mentions: [sender],
            ...(!sender.endsWith("@newsletter") ? { ai: true } : {}),
            contextInfo: {
              ...(config.message.forwarded ? {
                forwardingScore: 999,
                isForwarded: true,
              } : {})
            },
          },
          {
            quoted: await global.ftroly(config.options.botName),
            ...(ephe && !sender.endsWith("@newsletter") ? { ephemeralExpiration: 86400 } : {})
          }
        );
        this.sys.product = async (title, description, body, footer, url = false, letter = true, ephe = true) => await sock.sendMessage(from, {
          body: body,
          businessOwnerJid: from,
          footer: footer,
          ...(!sender.endsWith("@newsletter") ? { ai: true } : {}),
          product: {
            currencyCode: "Rp",
            description: description,
            productId: Array.from({ length: 15 }).map((_) => Math.floor(Math.random() * 9)).join("").toString(),
            productImageCount: 1,
            priceAmount1000: 99999,
            salePriceAmount1000: 99999,
            title: title,
            url: url ? url : config.options.thumbnail,
            productImage: {
              url: url ? url : config.options.thumbnail
            }
          },
          contextInfo: {
            ...(config.message.forwarded ? {
              forwardingScore: 999,
              isForwarded: true,
            } : {}),
            ...(letter ? {
              forwardedNewsletterMessageInfo: {
                newsletterJid: config.options.newsletterJid ? config.options.newsletterJid : config.default.newsletterJid,
                serverMessageId: -1,
                newsletterName: config.options.newsletterName
              }
            } : {}),
            externalAdReply: {
              title: config.options.ownerName,
              body: `© ${config.options.botName} ${(new Date()).getFullYear()}`,
              thumbnailUrl: url,
              sourceUrl: config.options.ownerLink,
              mediaType: 1,
              renderLargerThumbnail: false,
            },
          },
        },
          {
            quoted: await global.ftroly(config.options.botName),
            ...(ephe && !sender.endsWith("@newsletter") ? { ephemeralExpiration: 86400 } : {})
          })
        this.sys.thumbnail = async (teks, url, isLarger = true, isDocs = true, letter = true, ephe = true) => await sock.sendMessage(
          from,
          {
            ...(isDocs ? {
              document: await Buffer.from((await axios.get(config.options.thumbnailDocument, { responseType: "arraybuffer" })).data),
              fileName: `${config.options.ownerName}`,
              mimetype: "image/png",
              fileLength: 10990050000500,
              jpegThumbnail: await Buffer.from((await axios.get(config.options.thumbnailDocument, { responseType: "arraybuffer" })).data),
              description: 'hello',
              caption: teks,
            } : { text: teks, }),
            mentions: [sender],
            ...(!sender.endsWith("@newsletter") ? { ai: true } : {}),
            contextInfo: {
              ...(config.message.forwarded ? {
                forwardingScore: 999,
                isForwarded: true,
              } : {}),
              ...(letter ? {
                forwardedNewsletterMessageInfo: {
                  newsletterJid: config.options.newsletterJid ? config.options.newsletterJid : config.default.newsletterJid,
                  serverMessageId: -1,
                  newsletterName: config.options.newsletterName
                }
              } : {}),
              externalAdReply: {
                title: config.options.ownerName,
                body: `© ${config.options.botName} ${(new Date()).getFullYear()}`,
                thumbnailUrl: url,
                sourceUrl: config.options.ownerLink,
                mediaType: 1,
                renderLargerThumbnail: isLarger,
              },
            },
          },
          {
            quoted: await global.ftroly(config.options.botName),
            ...(ephe && !sender.endsWith("@newsletter") ? { ephemeralExpiration: 86400 } : {})
          }
        );
        this.sys.document = async (fake = true, teks, url = "", fileName = "", mimetype = "", fileLength = 0, quoted = true, letter = true, forward = true, ephe = true) => await sock.sendMessage(
          from,
          {
            ...(fake ? {
              document: await Buffer.from((await axios.get(config.options.thumbnailDocument, { responseType: "arraybuffer" })).data),
              jpegThumbnail: await Buffer.from((await axios.get(config.options.thumbnailDocument, { responseType: "arraybuffer" })).data),
              fileName: `${config.options.ownerName}`,
              mimetype: "image/png",
              fileLength: 10990050000500,
              description: 'hello',
            } : {
              document: typeof url == "object" || url == "" ? url : { url: url },
              // jpegThumbnail: await Buffer.from((await axios.get(config.options.thumbnailDocument, { responseType: "arraybuffer" })).data),
              fileName,
              title: fileName,
              mimetype,
              ...(fileLength == 0 ? {} : { fileLength: fileLength }),
              description: 'hello',
            }),
            caption: teks,
            mentions: [sender],
            ...(!sender.endsWith("@newsletter") ? { ai: true } : {}),
            contextInfo: {
              ...(config.message.forwarded && forward ? {
                forwardingScore: 999,
                isForwarded: true,
              } : {}),
              ...(letter ? {
                forwardedNewsletterMessageInfo: {
                  newsletterJid: config.options.newsletterJid ? config.options.newsletterJid : config.default.newsletterJid,
                  serverMessageId: -1,
                  newsletterName: config.options.newsletterName
                }
              } : {}),
            },
          },
          quoted ? {
            quoted: await global.ftroly(config.options.botName),
            ...(ephe && !sender.endsWith("@newsletter") ? { ephemeralExpiration: 86400 } : {})
          } : {}
        );
        this.sys.image = async (teks, url, ephe = true, letter = true, forward = true) => await sock.sendMessage(from, {
          image: typeof url == "object" ? url : {
            url: url
          },
          ...(!sender.endsWith("@newsletter") ? { ai: true } : {}),
          caption: teks,
          mimetype: "image/jpeg",
          contextInfo: {
            ...(config.message.forwarded && forward ? {
              forwardingScore: 999,
              isForwarded: true,
            } : {}),
            ...(letter ? {
              forwardedNewsletterMessageInfo: {
                newsletterJid: config.options.newsletterJid ? config.options.newsletterJid : config.default.newsletterJid,
                serverMessageId: -1,
                newsletterName: config.options.newsletterName
              }
            } : {}),
          },
        }, {
          quoted: await global.ftroly(config.options.botName),
          ...(ephe && !sender.endsWith("@newsletter") ? { ephemeralExpiration: 86400 } : {})
        })
        this.sys.video = async (teks, url, ephe = true, letter = true, forward = true) => await sock.sendMessage(from, {
          video: typeof url == "object" ? url : {
            url: url
          },
          ...(!sender.endsWith("@newsletter") ? { ai: true } : {}),
          caption: teks,
          mimetype: "video/mp4",
          contextInfo: {
            ...(config.message.forwarded && forward ? {
              forwardingScore: 999,
              isForwarded: true,
            } : {}),
            ...(letter ? {
              forwardedNewsletterMessageInfo: {
                newsletterJid: config.options.newsletterJid ? config.options.newsletterJid : config.default.newsletterJid,
                serverMessageId: -1,
                newsletterName: config.options.newsletterName
              }
            } : {}),
          },
        }, {
          quoted: await global.ftroly(config.options.botName),
          ...(ephe && !sender.endsWith("@newsletter") ? { ephemeralExpiration: 86400 } : {})
        })
        this.sys.audio = async (url, isThumb = false, isLarger = false, ephe = true, letter = true) => await sock.sendMessage(from, {
          audio: {
            url: url
          },
          ...(!sender.endsWith("@newsletter") ? { ai: true } : {}),
          mimetype: "audio/mp4",
          ...(isThumb ? {
            contextInfo: {
              ...(config.message.forwarded ? {
                forwardingScore: 999,
                isForwarded: true,
              } : {}),
              ...(letter ? {
                forwardedNewsletterMessageInfo: {
                  newsletterJid: config.options.newsletterJid ? config.options.newsletterJid : config.default.newsletterJid,
                  serverMessageId: -1,
                  newsletterName: config.options.newsletterName
                }
              } : {}),
              externalAdReply: {
                title: config.options.botName,
                body: `© Created by ${config.options.ownerName}`,
                thumbnailUrl: url,
                sourceUrl: config.options.ownerLink,
                mediaType: 1,
                renderLargerThumbnail: isLarger,
              },
            },
          } : {})
        }, {
          quoted: await global.ftroly(config.options.botName),
          ...(ephe && !sender.endsWith("@newsletter") ? { ephemeralExpiration: 86400 } : {})
        })
        this.sys.contact = async (displayName, vcard, letter = true, isThumb = false, isLarger = false, ephe = true) => {
          if (letter) {
            vcard.forEach((v) => {
              v["contextInfo"]["forwardedNewsletterMessageInfo"] = {
                newsletterJid: config.options.newsletterJid ? config.options.newsletterJid : config.default.newsletterJid,
                serverMessageId: -1,
                newsletterName: config.options.newsletterName
              }
            })
          }
          if (isThumb) {
            vcard.forEach((v) => {
              v["contextInfo"]["externalAdReply"] = {
                title: config.options.botName,
                body: `© Created by ${config.options.ownerName}`,
                thumbnailUrl: url,
                sourceUrl: config.options.ownerLink,
                mediaType: 1,
                renderLargerThumbnail: isLarger,
              }
            })
          }

          await sock.sendMessage(from, {
            contacts: {
              displayName,
              contacts: vcard
            },
            ...(!sender.endsWith("@newsletter") ? { ai: true } : {}),
          });
        }

        other = {
          cmd,
          m,
          from,
          body,
          sender,
          pushName,
          noPrefix,
          nbody: text,
          parseCommand,
          ev: global.ev,
          public: plugin.isSpecialForOwner,
        }
        Object.assign(this.sys, other)
        const glob = { ...Object.fromEntries(this.globalFunction) };
        if (plugin.func.length) {
          for (const pl of plugin.func) {
            await pl({ sock, exp: this.exp, sys: this.sys, glob, ...other })
          }
        }

        const serial = {
          "imageMessage": "IMAGE",
          "videoMessage": "VIDEO",
          "conversation": "TEXT",
          "stickerMessage": "STICKER"
        }
        const typess = m.isQuoted ? m.quoted.type : m.type;

        if (!sender.endsWith("@newsletter")) {
          if (plugin.group && !isGroup) return this.sys.text(messageInfo.msg.group);
          if (plugin.admin && !m?.isAdmin && !global.users[sender].owner) return this.sys.text(messageInfo.msg.admin);
          if (global.users[sender].banned) return;
          if (isGroup && global.groups[m.from].banned) return;
          if (global.users[sender].limit < 1 && !global.users[sender].premium) return this.sys.text(messageInfo.msg.limit);
          if (!prefix.test(m.body) && !plugin.pass && !plugin.cprefix.length) return;
          if (plugin.args && parseCommand.length <= 1) return this.sys.text(messageInfo.msg.query);
          if (plugin.owner && !global.users[sender].owner) return this.sys.text(messageInfo.msg.owner);
          if (!plugin.type.some((t) => t == "ALL" ? true : t == serial[typess])) return this.sys.text(messageInfo.msg.format(plugin.type.length > 1 ? plugin.type.join(" dan ").toLowerCase() : plugin.type.join("").toLowerCase()));
          if (plugin.premium && !global.users[sender].premium && !global.users[sender].owner) return this.sys.text(messageInfo.msg.premium);
          if (plugin.cmd?.filter((v) => Array.isArray(v)).map((v) => typeof v[v.length - 1] == "boolean" && v[v.length - 1] ? v.includes(parseCommand[0]) : false).includes(true) && !global.users[sender].premium && !global.users[sender].owner) return this.sys.text(messageInfo.msg.premium);
          sock.readMessages([m.key]);
        }
        const type = () => sock.sendPresenceUpdate("composing", m.isGroup ? m.metadata.id : m.from);

        if (
          !plugin.pass && plugin.typing && !sender.endsWith("@newsletter") &&
          (typeof body == "string" || body != "" || body)
        ) {
          type()
        }

        await plugin.run.call(this, { sock, sys: this.sys, exp: this.exp, glob, type, ...other });
        !sender.endsWith("@newsletter") ? config.options.systemLimit && !global.users[sender].owner ? global.users[sender].limit -= plugin.limit ? typeof plugin.limit == "boolean" && plugin.limit ? 1 : plugin.limit : 1 : null : null;
      }
    } catch (error) {
      console.log(error);
    } finally {
      // Object.keys(this.sys).forEach((v) => {
      //   this.sys[v] = null;
      // })
      // Object.keys(this.exp).forEach((v) => {
      //   this.exp[v] = null;
      // })
      if (other) Object.keys(other).forEach((v) => {
        other[v] = null;
      })
      !senders.endsWith("@newsletter") ? global.saveUserInfo(global.users) : null
    }
  }
}

export default EventEmitter;