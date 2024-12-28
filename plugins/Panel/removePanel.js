import config from "../../src/settings/config.js"

export default (handler) => {
  handler.add({
    cmd: ["deletepanel"],
    cats: ["Panel"],
    typing: true,
    owner: true,

    run: async ({ sys, exp }) => {
      const versi = sys.parseCommand[1]?.trim();
      if (!versi) return sys.text(`*ketik ${config.options.prefixExample}panel untuk melihat list versi*.\n\n> Masukan versi yang ingin dihapus, contoh: ${config.options.prefixExample}${sys.cmd} v1`)
      const vpanel = global.panel[versi.toLowerCase()];
      if (!vpanel) return await sys.text(`> Panel dengan versi ${versi} tidak ada!`);
      await sys.text(`┏❏──「 *Panel Info* 」───⬣
│ ❏ *Sukses Menghapus Panel*
│
│ ❏ *Domain* : ${vpanel.domain}
│ ❏ *Apikey* : ${vpanel.apikey}
│ ❏ *CApikey* : ${vpanel.capikey}
│ ❏ *Eggs* : ${vpanel.eggs}
│ ❏ *Location* : ${vpanel.location}
┗––––––––––✦

> Powered By *@${settings.ownerName}*`)
      const res = await exp.del(versi);
      if (!res) return await sys.text(`> Panel dengan versi ${versi} tidak ada!`);
      await global.reloadHandler();
    }
  })
  
  handler.func(({ exp }) => {
    exp.del = async (versi) => {
      delete global.panel[versi];
      global.savePanel();
      return true;
    }
  })
}