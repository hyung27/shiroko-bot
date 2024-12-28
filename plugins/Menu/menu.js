import moment from "moment-timezone";
import configs from "../../src/settings/config.js"
import { generateWAMessageFromContent } from "baileys";

export default (handler) => {
  handler.add({
    cmd: ["menu", "help"],
    cats: ["Main Menu"],
    typing: true,

    run: async ({ sys, exp }) => {
      const allMenu = configs.options.menuType == 1 ? exp.getListMenu(sys.pushName, sys.sender, sys.ev, true) : exp.getListMenu(sys.pushName, sys.sender, sys.ev)
      configs.options.menuType == 1 ?
        await exp.sendListButton(allMenu) :
        await sys.thumbnail(allMenu, configs.options.thumbnail, true, false);
    }
  })

  handler.func(async ({ exp, sys }) => {
    const time = moment.tz("Asia/Jakarta").format("HH")
    const prefix = "."

    const runtime = (seconds) => {
      seconds = Math.round(seconds);
      let days = Math.floor(seconds / (3600 * 24));
      seconds %= 3600 * 24;
      let hrs = Math.floor(seconds / 3600);
      seconds %= 3600;
      let mins = Math.floor(seconds / 60);
      let secs = seconds % 60;

      return `${days}d ${hrs}h ${mins}m ${secs}s;`;
    };

    //     ┏❏──「 *Dashboard* 」───⬣
    // │ ❏ *Mode*: _${settings.botMode}_
    // │ ▧ *Runtime*: _${runtime(process.uptime())}_
    // │ ▧ *Total Chat*: _${global.statusBot.totalChat}_
    // │ ❏ *Total User*: _${global.statusBot.totalUser}_
    // │ ⦁> Owner: _${global.statusBot.ownerUser}_
    // │ ⦁> Premium user: _${global.statusBot.premiumUser}_
    // │ ⦁> Free user: _${global.statusBot.freeUser}_
    // │ ⦁> Banned user: _${global.statusBot.bannedUser}_
    // ┗––––––––––✦

    function calc(angka) {
      return Boolean(Math.sign(angka + 1) == 1) ? angka : 9999999;
    }

    exp.getListMenu = function getListMenu(pushName, sender, evm, headOnly = false) {
      let pengucapan = "Kok Belum Tidur Kak? 🥱"
      if (parseInt(time) >= 4) {
        pengucapan = "Selamat Pagi 🌄"
      }
      if (parseInt(time) >= 10) {
        pengucapan = "Selamat Siang 🌤"
      }
      if (parseInt(time) >= 15) {
        pengucapan = "Selamat Sore 🌇"
      }
      if (parseInt(time) >= 18) {
        pengucapan = "Selamat Malam 🌙"
      }
      if (parseInt(time) >= 23) {
        pengucapan = "Masih online nih, Gadang ya? 😅"
      }
      const headText = `\nHai *${pushName}*, ${pengucapan}

┌ 「 ❏ *User Status* ❏ 」 
│ ❏ *Name*: _${global.users[sender].name}_
│ ▧ *Status*: _${global.users[sender].owner ? "Owner 👨‍💻" : global.users[sender].premium ? "Premium 💎" : "Free"}_
│ ▧ *Chat*: _${global.users[sender].chat}_
│
│ ❏ *Tanda \`P\`*: untuk user *Premium*
│ ❏ *Tanda \`O\`*: khusus *Owner*
│ ❏ *Tanda \`|\`*: alias ( *atau* )
┗––––––––––✦`
      if (headOnly) return headText;

      const allMenu = `${headText}


> ───「 ❏ *List Menu* ❏ 」───

${[...new Set(Array.from(evm.events.values()).reduce((acc, v) => [...acc, ...v.reduce((acc2, v2) => v2.cats[0] ? [...acc2, JSON.stringify([Math.min(v2.cats.map((y) => calc(configs.menu.order.map((v) => v.toLowerCase()).indexOf(y.toLowerCase())))), ...v2.cats])] : acc2, [])], []))].reduce((a, v) => { const l = JSON.parse(v); return ([...a, l].sort((a, b) => typeof a[0] == "boolean" && typeof b[0] != "boolean" ? 1 : typeof a[0] != "boolean" && typeof b[0] == "boolean" ? -1 : a[0] - b[0])) }, []).map(v => v.slice(1)).flat().filter((v, i, a) => a.indexOf(v) == i).filter(v => global.showAll ? true : !(/panel\sv/i.test(v))).map((v) => `┏❏──「 *${v}* 」───⬣ 
${Array.from(new Set(Object.entries(Array.from(evm.events.entries()).reduce((acc, [key, value], fh) => { acc[key] = value.filter(s => s.cats?.includes(v)); return Object.fromEntries(Object.entries(acc).filter(([_, f]) => f.length)) }, {})).map(([key, d]) => d.map(value => { const mamas = value.cprefix ? value.cprefix : value.cmd; return mamas.map((n, w) => value.indexCmd ? value.cats[w] === v ? `│ ⦁> ${prefix}*${Array.isArray(n) ? typeof n[n.length - 1] == "boolean" ? n.slice(0, -1).join(" | ") : n.join(" | ") : n}* ${value.owner ? " - `O`" : value.premium ? " - `P`" : Array.isArray(n) ? typeof n[n.length - 1] == "boolean" ? n[n.length - 1] == false ? " - `P`" : " - `O`" : "" : ""}` : null : `│ ⦁> ${prefix}*${Array.isArray(n) ? typeof n[n.length - 1] == "boolean" ? n.slice(0, -1).join(" | ") : n.join(" | ") : n}* ${value.owner ? " - `O`" : value.premium ? " - `P`" : Array.isArray(n) ? typeof n[n.length - 1] == "boolean" ? n[n.length - 1] == false ? " - `P`" : " - `O`" : "" : ""}`) }).flat().filter(Boolean).filter((v) => !(/Syntx/i.test(v))).filter((v, i, a) => a.indexOf(v) == i).join("\n")))).filter((v, i, a) => a.indexOf(v) == i).join("\n")}
┗––––––––––✦`).join("\n\n")}`;

      return allMenu;
    }

    exp.generateMesaage = () => {
      const list = [];
      const { providerArray, configArray } = glob.getConfigId();

      const avaibleList = providerArray.reduce((a, v, i, r) => {
        const config = configArray
          .filter(p => p[p.length - 2] == v[v.length - 2])
          .map(n => [n[0], n[n.length - 1]]);
        const curr = {};
        curr[v[0]] = config;
        return {
          ...a,
          ...curr
        };
      }, {});

      for (let i = 0; i < Object.keys(avaibleList).length; i++) {
        const row = [];
        const prov = Object.keys(avaibleList);

        avaibleList[prov[i]].forEach((h) => {
          row.push({
            header: `${prov[i].charAt(0).toUpperCase()}${prov[i].slice(1)}`,
            title: `${h[0].charAt(0).toUpperCase()}${h[0].slice(1)}`,
            description: "",
            id: `.getconfig ${prov[i]} ${h[0]}`
          });
        });

        list.push({
          title: `Config ${prov[i].charAt(0).toUpperCase()}${prov[i].slice(1)}`,
          ...(list.length == 0 ? { highlight_label: "Populer 🔥" } : {}),
          rows: row
        });
      }

      return list;
    };

    exp.sendListButton = async (text) => {
      const generate = exp.generateMesaage();

      const list = {
        title: "Menu",
        sections: generate
      };

      const gen = await glob.generateCanvasIntro(
        sys.m.sender,
        sys.pushName,
        sock
      );

      const imgMessage = await prepareWAMessageMedia(
        {
          image: gen,
          caption: config.options.botName
        },
        {
          upload: sock.waUploadToServer
        }
      );

      let msg = generateWAMessageFromContent(
        sys.m.sender,
        {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
              },
              interactiveMessage: proto.WAE2E.Message.InteractiveMessage.create(
                {
                  body: proto.WAE2E.Message.InteractiveMessage.Body.create({
                    text: "Jangan komplen kalau speed nya kurang, wajarlah gratisan"
                  }),
                  footer: proto.WAE2E.Message.InteractiveMessage.Footer.create({
                    text: `© ${config.options.botName} ${new Date().getFullYear()}`
                  }),
                  header: proto.WAE2E.Message.InteractiveMessage.Header.create({
                    title: "Silahkan Pilih Config",
                    subtitle: "",
                    ...proto.WAE2E.Message.ImageMessage.create(imgMessage),
                    hasMediaAttachment: true
                  }),
                  nativeFlowMessage:
                    proto.WAE2E.Message.InteractiveMessage.NativeFlowMessage.create(
                      {
                        buttons: [
                          {
                            name: "single_select",
                            buttonParamsJson: JSON.stringify(list)
                          }
                        ]
                      }
                    ),
                  contextInfo: proto.WAE2E.ContextInfo.create({
                    ...(config.message.forwarded
                      ? {
                        forwardingScore: 999,
                        isForwarded: true
                      }
                      : {}),
                    forwardedNewsletterMessageInfo: {
                      newsletterJid: config.options.newsletterJid
                        ? config.options.newsletterJid
                        : config.default.newsletterJid,
                      serverMessageId: -1,
                      newsletterName: config.options.newsletterName
                    },
                    externalAdReply:
                      proto.WAE2E.ContextInfo.ExternalAdReplyInfo.create({
                        title: config.options.ownerName,
                        body: `© ${config.options.botName
                          } ${new Date().getFullYear()}`,
                        thumbnailUrl: config.options.thumbnail,
                        sourceUrl: config.options.ownerLink,
                        mediaType: 1,
                        renderLargerThumbnail: false
                      })
                  })
                }
              )
            }
          }
        },
        {
          userJid: sys.m.sender,
          quoted: await global.ftroly(config.options.botName),
          ephemeralExpiration: 86400
        }
      );

      await sock.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
      });
    }
  })
}