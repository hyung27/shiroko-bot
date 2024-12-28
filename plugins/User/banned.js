export default (handler) => {
  handler.add({
    cmd: ["banned"],
    cats: ["Owner"],
    owner: true,
    typing: true,

    run: async ({ sys, glob }) => {
      const user = await glob.jidConvert(sys.parseCommand[1]) ? await glob.jidConvert(sys.parseCommand[1]) : {fullJid: sys.m.quoted.sender};
      if (!user) return await sys.text("> Tag orang yang mau dibanned akunnya atau masukan nomernya");
      const res = glob.addBanned(user.fullJid);
      res ? sys.text(`> Sukses membanned @${user.fullJid.replace("@s.whatsapp.net", "")}`) : sys.text(`> User ${user.fullJid} Tidak ada!`);
    }
  })

  handler.add({
    cmd: ["unbanned"],
    cats: ["Owner"],
    owner: true,
    typing: true,

    run: async ({ sys, glob }) => {
      const user = await glob.jidConvert(sys.parseCommand[1]) ? await glob.jidConvert(sys.parseCommand[1]) : {fullJid: sys.m.quoted.sender};
      if (!user) return await sys.text("> Tag orang yang mau dihapus bannednya atau masukan nomernya");
      const res = glob.removeBanned(user.fullJid);
      res ? sys.text(`> Sukses membuka banned @${user.fullJid.replace("@s.whatsapp.net", "")}`) : sys.text(`> User ${user.fullJid} Tidak ada!`);
    }
  })
}