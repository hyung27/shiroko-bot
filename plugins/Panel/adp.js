import config from "../../src/settings/config.js"

export default async (handler) => {
  handler.add({
    cmd: await Object.keys(global.panel).map((v, i) => global.panel[v].domain ? `adpv${i + 1}` : null),
    cats: await Object.keys(global.panel).map((v, i) => global.panel[v].domain ?  `Panel V${i + 1}` : null),
    owner: true,
    indexCmd: true,
    args: true,
    typing: true,

    run: async ({ exp }) => {
      await exp.addSrv();
    }
  })

  handler.func(({ exp, sys, sock, glob }) => {
    exp.addSrv = async () => {
      let s = sys.nbody.split(',');
      const vpanel = global.panel[sys.cmd.match(/(v[0-9]+)/g)[0]];
      let username = s[0]
      let nomor = s[1]
      if (!username || !nomor) return sys.text(`Ex : ${config.options.prefixExample + sys.cmd} Username,@tag/nomor\n\nContoh :\n${config.options.prefixExample + sys.cmd} example,@user`)
      let password = username + "024"
      let nomornya = (await glob.jidConvert(nomor)).fullJid
      let f = await fetch(vpanel.domain + "/api/application/users", {
          "method": "POST",
          "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + vpanel.apikey
          },
          "body": JSON.stringify({
            "email": username + "@AnggaOffc.com",
            "username": username,
            "first_name": username,
            "last_name": "Memb",
            "language": "en",
            "root_admin" : true,  
            "password": password.toString()
          })
      })

      let data = await f.json();
      if (data.errors) return sys.text(JSON.stringify(data.errors[0], null, 2));
      let user = data.attributes
      let tks = `┏❏──「 *Info Panel* 」───⬣
│ ❏ *ADP*
│
│ ▧ TYPE: USER
│ ▧ ID: ${user.id}
│ ▧ USERNAME: ${user.username}
│ ▧ EMAIL: ${user.email}
│ ▧ NAME: ${user.first_name} ${user.last_name}
│ ▧ CREATED AT: ${user.created_at}
┗––––––––––✦`
          await sys.text(tks);

          await sock.sendMessage(nomornya, {
              ai: true,
              text: `┏❏──「 *Data Panel Anda* 」───⬣
│ ❏ *Username* : ${username}
│ ❏ *Password* : ${password}
│ ❏ *Login* : ${vpanel.domain}
┗––––––––––✦

> *NOTE :* _OWNER HANYA MENGIRIM 1X DATA AKUN ANDA MOHON DI SIMPAN BAIK BAIK KALAU DATA AKUN ANDA HILANG OWNER TIDAK DAPAT MENGIRIM AKUN ANDA LAGI_`,
          }, { quoted: await global.ftroly(config.options.ownerName)})
    }
  })
}