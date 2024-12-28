import config from "../../src/settings/config.js"

export default (handler) => {
  handler.add({
    cmd: ["addpanel"],
    cats: ["Panel"],
    typing: true,
    owner: true,

    run: async ({ sys, exp }) => {
      const data = sys.nbody.split("|");
      const domain = data[0]?.trim();
      const apikey = data[1]?.trim();
      const capikey = data[2]?.trim();
      const eggs = data[3]?.trim() ?? "15";
      const location = data[4]?.trim() ?? "1";
      if (!(domain || apikey || capikey)) return sys.text(`\`Cara menggunakannya\`\n\n> ${config.options.prefixExample}${sys.cmd} domain | apikey | capikey | eggs | location`);
      const res = await exp.add(domain, apikey, capikey, eggs, location);
      if (!res) return await sys.text(`> Domain itu telah terpakai, mohon hapus terlebih dahulu untuk melanjutkan.`);
      await global.reloadHandler();
      await sys.text(`┏❏──「 *Panel Info* 」───⬣
│ ❏ *Sukses Menambahkan Panel*
│
│ ❏ *Domain* : ${domain}
│ ❏ *Apikey* : ${apikey}
│ ❏ *CApikey* : ${capikey}
│ ❏ *Eggs* : ${eggs}
│ ❏ *Location* : ${location}
┗––––––––––✦

> Powered By *@${config.options.ownerName}*`)
    }
  })
  
  handler.func(({ exp }) => {
    exp.add = async (domain, apikey, capikey, eggs, location) => {
      if (Object.values(global.panel).some(v => v.domain.includes(domain))) return false;
      const getNamePanel = Object.keys(global.panel).at(-1) || "v0";
      global.panel[getNamePanel.replace(/([0-9]+)/, (p1) => +p1 + 1)] = {
        domain: domain,
        apikey: apikey, 
        capikey: capikey,
        eggsnya: eggs,
        location: location
      }
      global.savePanel();
      return true;
    }
  })
}