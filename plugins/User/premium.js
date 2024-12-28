export default (handler) => {
  handler.add({
    cmd: ["premium"],
    cats: ["Owner"],
    owner: true,
    typing: true,

    run: async ({ sys, glob }) => {
      const user = await glob.jidConvert(sys.parseCommand[1]) ? await glob.jidConvert(sys.parseCommand[1]) : {fullJid: sys.m.quoted.sender};
      if (!user) return await sys.text("> Tag orang yang mau dijadikan premium atau masukan nomernya");
      const res = glob.addPremium(user.fullJid);
      res ? sys.text(`> Sukses menambahkan @${user.fullJid.replace("@s.whatsapp.net", "")} sebagai user premium`) : sys.text(`> User ${user.fullJid} Tidak ada!`);
    }
  })

  handler.add({
    cmd: ["unpremium"],
    cats: ["Owner"],
    owner: true,
    typing: true,

    run: async ({ sys, glob }) => {
      const user = await glob.jidConvert(sys.parseCommand[1]) ? await glob.jidConvert(sys.parseCommand[1]) : {fullJid: sys.m.quoted.sender};
      if (!user) return await sys.text("> Tag orang yang mau dihapus status premiumnya atau masukan nomernya");
      const res = glob.removePremium(user.fullJid);
      res ? sys.text(`> Sukses menghapus @${user.fullJid.replace("@s.whatsapp.net", "")} sebagai user premium`) : sys.text(`> User ${user.fullJid} Tidak ada!`);
    }
  })
}