import config from "../../src/settings/config.js"

export default (handler) => {
  handler.add({
    cmd: ["panel"],
    cats: ["Panel"],
    owner: true,
    typing: true,
    
    run: async ({ sys }) => {
      const text = `*Hi @${sys.pushName} 👋*
┏❏──「 *Info Panel* 」───⬣
│ ❏ *List Panel Anda*
│
${Object.keys(global.panel).length ? Object.entries(global.panel).map(([k, v]) => `│ ▧ ${k.toUpperCase()}`).join("\n") : "│ Tidak ditemukan!"}
┗––––––––––✦

${Object.keys(global.panel).length ? `┏❏──「 *Penggunaan* 」───⬣
│ ❏ *CARA ADD USER PANEL*
│ ▧ _${config.options.prefixExample}addv1 ram,user,nomer_
│
│ *contoh:*
│ *${config.options.prefixExample}addv1 1gb, angga, 62895428251533*
│ *${config.options.prefixExample}addv1 --c 350, 350, 50, user, nomer*
┗––––––––––✦

> Gunakan \`--c\` untuk membuat panel yang custom.` : `> Tidak ada panel yang ditambakan, Setting panel anda di file config.js`}

> Powered By *@${config.options.ownerName}*`

      await sys.thumbnail(text, config.options.thumbnail, false, false)
    }
  })
}