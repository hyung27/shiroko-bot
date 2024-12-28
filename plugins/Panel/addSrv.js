import config from "../../src/settings/config.js"

export default async (handler) => {
  handler.add({
    cmd: await Object.keys(global.panel).map((v, i) => global.panel[v].domain ? `addsrvv${i + 1}` : null),
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
      let s = sys.nbody.split(',');
      const vpanel = global.panel[sys.cmd.match(/(v[0-9]+)/g)[0]];
      if (s.length < 7) return sys.text(`*Format salah!*

Penggunaan:
${config.options.prefixExample + sys.cmd} name,tanggal,userId,eggId,locationId,memory/disk,cpu`)
      let name = s[0].trim();
      let desc = s[1].trim() || ''
      let usr_id = s[2].trim();
      let egg = s[3].trim();
      let loc = s[4].trim();
      let memo_disk = s[5].trim().split(`/`);
      let cpu = s[6].trim();
      let f1 = await fetch(vpanel.domain + "/api/application/nests/5/eggs/" + egg, {
          "method": "GET",
          "headers": {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + vpanel.apikey
        }
      })
      let data = await f1.json();
      let startup_cmd = data.attributes.startup

      let f = await fetch(vpanel.domain + "/api/application/servers", {
        "method": "POST",
        "headers": {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + vpanel.apikey,
        },
        "body": JSON.stringify({
          "name": name,
          "description": desc,
          "user": usr_id,
          "egg": parseInt(egg),
          "docker_image": "ghcr.io/parkervcp/yolks:nodejs_18",
          "startup": startup_cmd,
          "environment": {
            "INST": "npm",
            "USER_UPLOAD": "0",
            "AUTO_UPDATE": "0",
            "CMD_RUN": "npm start"
          },
          "limits": {
            "memory": memo_disk[0],
            "swap": 0,
            "disk": memo_disk[1],
            "io": 500,
            "cpu": cpu
            },
          "feature_limits": {
            "databases": 5,
            "backups": 5,
            "allocations": 5
          },
          deploy: {
            locations: [parseInt(loc)],
            dedicated_ip: false,
            port_range: [],
          },
        })
      })
      let res = await f.json()
      if (res.errors) return sys.text(JSON.stringify(res.errors[0], null, 2));
      let server = res.attributes
      sys.text(`┏❏──「 *Info Panel* 」───⬣
│ ❏ *Succesfully ADD Server*
│
│ ▧ TYPE: ${res.object}
│ ▧ ID: ${server.id}
│ ▧ UUID: ${server.uuid}
│ ▧ NAME: ${server.name}
│ ▧ DESCRIPTION: ${server.description}
│ ▧ MEMORY: ${server.limits.memory === 0 ? 'Unlimited' : server.limits.memory} MB
│ ▧ DISK: ${server.limits.disk === 0 ? 'Unlimited' : server.limits.disk} MB
│ ▧ CPU: ${server.limits.cpu}%
│ ▧ CREATED AT: ${server.created_at}
┗––––––––––✦

> Powered By *@${config.options.ownerName}*`)
    }
  })
}