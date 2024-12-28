export default (handler) => {
  handler.add({
    cmd: ["send"],
    cats: ["Owner"],
    owner: true,
    args: true,
    typing: true,

    run: async ({ sys, glob }) => {
      const nomor = await glob.jidConvert(sys.nbody.split(",")[0]?.trim() || ""), text = sys.nbody.split(",").slice(1).join(" ")?.trim() || "";
      if (!nomor || !text) return sys.reply("> Masukan data yang benar!");
      await sys.text(text, true, nomor.fullJid)
      await sys.text(`> Sukses mengirim pesan ke nomer ${nomor.fullJid.replace(global.net, "")}`);
    }
  })

  handler.add({
    cmd: ["sends"],
    cats: ["Owner"],
    owner: true,
    arg: true,
    composing: true,

    run: async ({ syn, glob }) => {
      const dl = await sys.m.dl();
      const nomor = await glob.jidConvert(sys.nbody.trim());
      if (!nomor || !dl) return sys.reply("> Masukan data yang benar!");
      await sys.sticker(dl, true, nomor.fullJid)
      await sys.text(`> Sukses mengirim sticker ke nomer ${nomor.fullJid.replace(global.net, "")}`);
    }
  })
}