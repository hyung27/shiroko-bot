import config from "../../src/settings/config.js"

export default async (handler) => {
  handler.add({
    cmd: await Object.keys(global.panel).map((v, i) => global.panel[v].domain ? `addv${i + 1}` : null),
    cats: await Object.keys(global.panel).map((v, i) => global.panel[v].domain ? `Panel V${i + 1}` : null),
    owner: true,
    typing: true,
    indexCmd: true,

    run: async ({ exp }) => {
      return await exp.add();
    },
  });

  handler.func(async ({ exp, sys, sock, glob }) => {
    exp.add = async function () {
      try {
        const vpanel = global.panel[sys.cmd.match(/(v[0-9]+)/g)[0]];
        if (!vpanel) return null;
        let t = sys.nbody.split(",");
        if (t.length < 3)
          return sys.text(`*Format salah!*
  
Penggunaan:
${config.options.prefixExample + sys.cmd} 1gb, user, nomer
${config.options.prefixExample + sys.cmd} --c 350, 350, 50, user, nomer

> Gunakan \`--c\` untuk membuat panel yang custom.`);
        let ramUse, u, username;
        if (/--c/.test(t[0].trim().toLowerCase())) {
          username = t[3].trim();
          ramUse = {
            select: t[0].replace("--c ", "").trim(),
            ram: t[0].replace("--c ", "").trim(),
            cpu: t[2].trim(),
            memory: t[1].trim()
          }
          u = sys.m.quoted ? sys.m.quoted.sender : (await glob.jidConvert(t[4].trim())).fullJid ? (await glob.jidConvert(t[4].trim())).fullJid : sys.m.mentionedJid[0];
        } else {
          username = t[1].trim();
          ramUse = { select: t[0].trim(), ...global.dataPanel[t[0].trim().toLowerCase()] }
          u = sys.m.quoted ? sys.m.quoted.sender : (await glob.jidConvert(t[2].trim())).fullJid ? (await glob.jidConvert(t[2].trim())).fullJid : sys.m.mentionedJid[0];
        }
        let name = username + " " + ramUse.select;
        let egg = vpanel.eggsnya;
        let loc = vpanel.location;
        let memo = ramUse.ram;
        let cpu = ramUse.cpu;
        let disk = ramUse.memory;
        let email = username + "1389@gmail.com";
        let akunlo = "https://img99.pixhost.to/images/882/516934136_test.jpg";
        if (!u) return null;
        let password = username + (Math.floor(Math.random() * 500) + 100).toString();
        let f = await fetch(vpanel.domain + "/api/application/users", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + vpanel.apikey,
          },
          body: JSON.stringify({
            email: email,
            username: username,
            first_name: username,
            last_name: username,
            language: "en",
            password: password,
          }),
        });
        let data = await f.json();
        if (data.errors) return sys.m.reply(JSON.stringify(data.errors[0], null, 2));
        let user = data.attributes;
        let f2 = await fetch(
          vpanel.domain + "/api/application/nests/5/eggs/" + egg,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + vpanel.apikey,
            },
          }
        );
  
        const ctf = `Hai
  
┏❏──「 *Panel* 」───⬣
│ ❏ *Username* : ${user.username}
│ ❏ *Password* : ${password}
│ ❏ *Login* : ${vpanel.domain}
┗––––––––––✦

> *Note:* _OWNER HANYA MENGIRIM 1X DATA AKUN ANDA MOHON DI SIMPAN BAIK BAIK KALAU DATA AKUN ANDA HILANG OWNER TIDAK DAPAT MENGIRIM AKUN ANDA LAGI_

> Powered By *@${config.options.ownerName}*`;
        console.log(ctf)
        sock.sendMessage(
          u,
          { image: { url: akunlo }, caption: ctf },
          { quoted: await global.ftroly(config.options.botName) }
        );
        let data2 = await f2.json();
        let startup_cmd = data2.attributes.startup;
  
        let f3 = await fetch(vpanel.domain + "/api/application/servers", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + vpanel.apikey,
          },
          body: JSON.stringify({
            name: name,
            description: " ",
            user: user.id,
            egg: parseInt(egg),
            docker_image: "ghcr.io/parkervcp/yolks:nodejs_18",
            startup: startup_cmd,
            environment: {
              INST: "npm",
              USER_UPLOAD: "0",
              AUTO_UPDATE: "0",
              CMD_RUN: "npm start",
            },
            limits: {
              memory: memo,
              swap: 0,
              disk: disk,
              io: 500,
              cpu: cpu,
            },
            feature_limits: {
              databases: 5,
              backups: 5,
              allocations: 1,
            },
            deploy: {
              locations: [parseInt(loc)],
              dedicated_ip: false,
              port_range: [],
            },
          }),
        });
        let res = await f3.json();
        if (res.errors) return sys.text(JSON.stringify(res.errors[0], null, 2));
        let server = res.attributes;
        sys.text(`┏❏──「 *Info* 」───⬣
│ ❏ *Success create user + server id :* \`${user.id}\`
┗––––––––––✦

> Data sudah dikirim ke nomor tujuan.

> DONE BY ${config.options.ownerName}⚡`);
      } catch (error) {
        console.log(error)
      }
    };
  });
};
