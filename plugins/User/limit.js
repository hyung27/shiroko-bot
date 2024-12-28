export default (handler) => {
  handler.add({
    cmd: ["resetlimit"],
    cats: ["Owner"],
    owner: true,
    args: true,
    typing: true,

    run: async ({ sys, glob }) => {
      const user = await glob.jidConvert(sys.parseCommand[1]) || {fullJid: sys.m.quoted.sender} || {fullJid: sys.m.mentions[0]};
      if (!user) return await sys.text("> Tag orang yang mau direset limitnya atau masukan nomernya");
      const res = glob.resetLimit(user.fullJid);
      res ? sys.text(`> Sukses mereset limit user @${user.fullJid.replace("@s.whatsapp.net", "")} 🍃`) : sys.text(`> User ${user.fullJid} Tidak ada!`);
    }
  })
}