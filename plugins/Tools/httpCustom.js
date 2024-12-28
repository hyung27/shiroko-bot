import config from "../../src/settings/config.js"
import axios from "axios";
import baileys, {
  generateWAMessageFromContent,
  proto,
  prepareWAMessageMedia
} from "baileys";
import fs from "fs";
import path from "path";

export default handler => {
  handler.add({
    cmd: [["config", "hc"]],
    cats: ["Proxy"],
    typing: true,

    run: async ({ sys, sock, glob, exp }) => {
      const generate = exp.generateMesaage();

      const list = {
        title: "Tekan tombol ini",
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
  });

  handler.add({
    cmd: ["getconfig"],
    cats: ["Proxy"],
    typing: true,

    run: async ({ sys, glob }) => {
      const [, prov, name] = sys.parseCommand;
      if (!prov || !name) {
        return sys.thumbnail(
          `\n> \`Format Salah\`\n\nContoh penggunaan:\n\n*${config.options.prefixExample}${sys.cmd} telkomsel ilmupedia*\n\natau\n\n*${config.options.prefixExample}${sys.cmd} axis video*`,
          config.options.thumbnail,
          false,
          false
        );
      }
      const { provider, config : configHc, fileName } = glob.getConfigId(prov, name);
      if (!provider || !configHc) {
        return sys.thumbnail(
          `\n> \`Config Tidak ditemukan\`\n\nContoh penggunaan:\n\n*${config.options.prefixExample}${sys.cmd} telkomsel ilmupedia*\n\natau\n\n*${config.options.prefixExample}${sys.cmd} axis video*`,
          config.options.thumbnail,
          false,
          false
        );
      }

      let isBreak = false;

      await sys.thumbnail(
        "\n> Filenya akan segera dikirm, mohon tunggu...\n\n> Maaf kalau error wajarlah manusia",
        config.options.thumbnail,
        false,
        false
      );
      await new Promise(resolve => setTimeout(resolve, 2000));
      for (let i = 1; i < 100 || !isBreak; i++) {
        try {
          const url = `https://raw.githubusercontent.com/Fahmi-XD/configs/refs/heads/main/${provider}/${configHc}%20(${i}).hc`;
          const file = await axios.get(url, { responseType: "arraybuffer" });
          if (file.data == "404: Not Found" || file.status == 404) {
            isBreak = true;
          }
          // console.info(file.data.length);
          await sys.document(
            false,
            "",
            file.data,
            `${fileName}-${i}.hc`,
            "application/octet-stream",
            file.data.length,
            false,
            false,
            false
          );
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch {
          isBreak = true;
        }
      }
    }
  });

  handler.func(({ exp, glob }) => {
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
  });
};
