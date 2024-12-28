import config from "../../src/settings/config.js";

export default async (handler) => {
  handler.add({
    cmd: await Object.keys(global.panel).map((v, i) => global.panel[v].domain ? `listadpv${i + 1}` : null),
    cats: await Object.keys(global.panel).map((v, i) => global.panel[v].domain ? `Panel V${i + 1}` : null),
    owner: true,
    indexCmd: true,
    args: true,
    typing: true,

    run: async ({ exp }) => {
      await exp.addSrv();
    }
  })

  handler.func(({ exp, sys }) => {
    exp.addSrv = async () => {
      const vpanel = global.panel[sys.cmd.match(/(v[0-9]+)/g)[0]];
      let page = sys.parseCommand[1] ? sys.parseCommand[1] : '1';
      let f = await fetch(vpanel.domain + "/api/application/users?page=" + page, {
        "method": "GET",
        "headers": {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + vpanel.apikey
        }
      });
      let res = await f.json();
      let users = res.data;
      let messageText = `❏──「 *List Admin ${(sys.cmd.match(/(v[0-9]+)/g)[0]).toUpperCase()}* 」───⬣\n\n`;

      for (let user of users) {
        let u = user.attributes;
        if (u.root_admin) {
          messageText += `┏❏ ID: ${u.id} - Status: ${u.attributes?.user?.server_limit === null ? 'Inactive' : 'Active'}\n`;
          messageText += `│❏ Name: ${u.username}\n`;
          messageText += `┗❏ Full: ${u.first_name} ${u.last_name}\n\n`;
        }
      }

      messageText += `> Page: ${res.meta.pagination.current_page}/${res.meta.pagination.total_pages}\n`;
      messageText += `> Total Admin: ${res.meta.pagination.count}`;

      await sys.text(messageText)

      if (res.meta.pagination.current_page < res.meta.pagination.total_pages) {
        sys.text(`> Gunakan perintah ${config.options.prefixExample}${sys.cmd} ${res.meta.pagination.current_page + 1} untuk melihat halaman selanjutnya.`);
      }
    }
  })
}