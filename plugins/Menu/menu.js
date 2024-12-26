import moment from "moment-timezone";
import config from "../../src/settings/config.js"

export default (handler) => {
  handler.add({
    cmd: ["menu", "help"],
    cats: ["Main Menu"],
    typing: true,

    run: async ({ sys, exp }) => {
      const allMenu = exp.getListMenu(sys.pushName, sys.sender, sys.ev);
      config.options.menuType == 1 ?
      await sys.product(config.options.botName, "Kasih sayang admin kepada member 🥰", allMenu, `\nCreated by ${config.options.ownerName}\n${config.options.ownerLink}`, config.options.thumbnail) :
      await sys.thumbnail(allMenu, config.options.thumbnail);
    }
  })

  handler.func(async ({ exp }) => {
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

    exp.getListMenu = function getListMenu(pushName, sender, evm) {
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

      const allMenu = `\nHai *${pushName}*, ${pengucapan}

┌ 「 ❏ *User Status* ❏ 」 
│ ❏ *Name*: _${global.users[sender].name}_
│ ▧ *Status*: _${global.users[sender].owner ? "Owner 👨‍💻" : global.users[sender].premium ? "Premium 💎" : "Free"}_
│ ▧ *Chat*: _${global.users[sender].chat}_
│
│ ❏ *Tanda \`P\`*: untuk user *Premium*
│ ❏ *Tanda \`O\`*: khusus *Owner*
│ ❏ *Tanda \`|\`*: alias ( *atau* )
┗––––––––––✦


> ───「 ❏ *List Menu* ❏ 」───

${[...new Set(Array.from(evm.events.values()).reduce((acc, v) => [...acc, ...v.reduce((acc2, v2) => v2.cats[0] ? [...acc2, JSON.stringify([v2.index, ...v2.cats])] : acc2, [])], []))].reduce((a, v) => { const l = JSON.parse(v); return ([...a, l].sort((a, b) => typeof a[0] == "boolean" && typeof b[0] != "boolean" ? 1 : typeof a[0] != "boolean" && typeof b[0] == "boolean" ? -1 : a[0] - b[0])) }, []).map(v => v.slice(1)).flat().filter((v, i, a) => a.indexOf(v) == i).filter(v => global.showAll ? true : !(/panel\sv/i.test(v))).map((v) => `┏❏──「 *${v}* 」───⬣ 
${Array.from(new Set(Object.entries(Array.from(evm.events.entries()).reduce((acc, [key, value], fh) => { acc[key] = value.filter(s => s.cats?.includes(v)); return Object.fromEntries(Object.entries(acc).filter(([_, f]) => f.length)) }, {})).map(([key, d]) => d.map(value => value.cmd.map((n, w) => value.indexCmd ? value.cats[w] === v ? `│ ⦁> ${prefix}*${Array.isArray(n) ? typeof n[n.length - 1] == "boolean" ? n.slice(0, -1).join(" | ") : n.join(" | ") : n}* ${value.owner ? " - `O`" : value.premium ? " - `P`" : Array.isArray(n) ? typeof n[n.length - 1] == "boolean" ? n[n.length - 1] == false ? " - `P`" : " - `O`" : "" : ""}` : null : `│ ⦁> ${prefix}*${Array.isArray(n) ? typeof n[n.length - 1] == "boolean" ? n.slice(0, -1).join(" | ") : n.join(" | ") : n}* ${value.owner ? " - `O`" : value.premium ? " - `P`" : Array.isArray(n) ? typeof n[n.length - 1] == "boolean" ? n[n.length - 1] == false ? " - `P`" : " - `O`" : "" : ""}`)).flat().filter(Boolean).filter((v) => !(/Syntx/i.test(v))).filter((v, i, a) => a.indexOf(v) == i).join("\n")))).filter((v, i, a) => a.indexOf(v) == i).join("\n")}
┗––––––––––✦`).join("\n\n")}`;

      // console.log([...new Set(Array.from(evm.events.values()).reduce((acc, v) => [...acc, ...v.reduce((acc2, v2) => v2.cats[0] ? [...acc2, JSON.stringify([v2.index, ...v2.cats])] : acc2, [])], []))].reduce((a, v) => { const l = JSON.parse(v); return ([...a, l].sort((a, b) => typeof a[0] == "boolean" && typeof b[0] != "boolean" ? 1 : typeof a[0] != "boolean" && typeof b[0] == "boolean" ? -1 : a[0] - b[0])) }, []).map(v => v.slice(1)).flat().filter((v, i, a) => a.indexOf(v) == i).filter(v => global.showAll ? true : !(/panel\sv/i.test(v))).map((v) => `┏❏──「 *${v}* 」───⬣ 
      // ${Array.from(new Set(Object.entries(Array.from(evm.events.entries()).reduce((acc, [key, value], fh) => {acc[key] = value.filter(s => s.cats?.includes(v)); console.log(value); return Object.fromEntries(Object.entries(acc).filter(([_, f]) => f.length))}, {}))))}
      // ┗––––––––––✦`).join("\n\n"))

      return allMenu;
    }
  })
}