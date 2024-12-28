import config from "../../src/settings/config.js";

export default async (handler) => {
  handler.add({
    cmd: await Object.keys(global.panel).map((v, i) => global.panel[v].domain ? `listsrvv${i + 1}` : null),
    cats: await Object.keys(global.panel).map((v, i) => global.panel[v].domain ? `Panel V${i + 1}` : null),
    owner: true,
    indexCmd: true,
    args: true,
    typing: true,

    run: async ({ exp }) => {
      await exp.list();
    }
  })

  handler.func(({ exp, sys }) => {
    exp.list = async () => {
      let page = sys.parseCommand[1] ? sys.parseCommand[1] : '1';
      const vpanel = global.panel[sys.cmd.match(/(v[0-9]+)/g)[0]];
      if (!page) return sys.text('ID nya mana?')

      let f = await fetch(vpanel.domain + "/api/application/servers?page=" + page, {
        "method": "GET",
        "headers": {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + vpanel.apikey
        }
      });
      let res = await f.json();
      let servers = res.data;
      let sections = [];
      let messageText = `❏──「 *Daftar Server ${(sys.cmd.match(/(v[0-9]+)/g)[0]).toUpperCase()}* 」───⬣\n\n`;
      
      for (let server of servers) {
        let s = server.attributes;
        
        let f3 = await fetch(vpanel.domain + "/api/client/servers/" + s.uuid.split`-`[0] + "/resources", {
          "method": "GET",
          "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + vpanel.capikey
          }
        });
        
        let data = await f3.json();
        let status = data.attributes ? data.attributes.current_state : s.status;
        
        messageText += `┏❏ ID Server: ${s.id}\n`;
        messageText += `│❏ Nama Server: ${s.name}\n`;
        messageText += `┗❏ Status: ${status}\n\n`;
      }
      
      messageText += `> Halaman: ${res.meta.pagination.current_page}/${res.meta.pagination.total_pages}\n`;
      messageText += `> Total Server: ${res.meta.pagination.count}`;
      
      await sys.text(messageText)
      
      if (res.meta.pagination.current_page < res.meta.pagination.total_pages) {
        sys.text(`> Gunakan perintah ${config.options.prefixExample}${sys.cmd} ${res.meta.pagination.current_page + 1} untuk melihat halaman selanjutnya.`);
      }
    }
  })
}