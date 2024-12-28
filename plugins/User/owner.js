export default (handler) => {
  handler.add({
    cmd: ["addowner"],
    cats: ["Owner"],
    owner: true,
    typing: true,

    run: async ({ sys, glob }) => {
      const user = await glob.jidConvert(sys.parseCommand[1]) || {fullJid: sys.m.quoted.sender} || {fullJid: sys.m.mentionedJid[0]};
      if (!user) return await sys.text("> Tag orang yang mau dijadikan owner atau masukan nomernya");
      const res = glob.addOwner(user.fullJid);
      res ? sys.text(`> Sukses menambahkan @${user.fullJid.replace("@s.whatsapp.net", "")} sebagai owner 👨‍💻`) : sys.text(`> User ${user.fullJid} Tidak ada!`);
    }
  })

  handler.add({
    cmd: ["unowner"],
    cats: ["Owner"],
    owner: true,
    typing: true,

    run: async ({ sys, glob }) => {
      const user = await glob.jidConvert(sys.parseCommand[1]) || {fullJid: sys.m.quoted.sender} || {fullJid: sys.m.mentionedJid[0]};
      if (!user) return await sys.text("> Tag orang yang mau dihapus kepemilikannya atau masukan nomernya");
      const res = glob.removeOwner(user.fullJid);
      res ? sys.text(`> Sukses menghapus @${user.fullJid.replace("@s.whatsapp.net", "")} sebagai owner 👨‍💻`) : sys.text(`> User ${user.fullJid} Tidak ada!`);
    }
  })
}