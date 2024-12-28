import config from "../../src/settings/config.js"

export default async (handler) => {
  handler.add({
    cmd: await Object.keys(global.panel).map((v, i) => global.panel[v].domain ? `listramv${i + 1}` : null),
    cats: await Object.keys(global.panel).map((v, i) => global.panel[v].domain ? `Panel V${i + 1}` : null),
    owner: true,
    indexCmd: true,
    args: true,
    typing: true,

    run: async ({ sys }) => {
      const lrm = `┏❏──「 *Info Panel* 」───⬣
│ ❏ *List Ram Panel ${(sys.cmd.match(/(v[0-9]+)/g)[0]).toUpperCase()}*
│
${Array.from({ length: 16 }).map((_, i) => `│ ▧ *RAM ${i + 1}GB*`).join("\n")}
│ ▧ *RAM UNLI*
┗––––––––––✦

> Powered By *@${config.options.ownerName}*`
      sys.text(lrm)
    }
  })
}