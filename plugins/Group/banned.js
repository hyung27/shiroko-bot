export default (handler) => {
  handler.add({
    cmd: ["banned"],
    cats: ["Group"],
    admin: true,
    typing: true,
    group: true,

    run: async ({ sys }) => {
      const user = sys.parseCommand[1]
      if (!user) return await sys.text("`1` untuk aktifkan `0` untuk nonaktif.");
      if (["1", "aktif", "active", "aktifkan", "true", "enable"].includes(user)) global.groups[sys.m.from].banned = true
      else if (["0", "deaktif", "nonaktif", "nonactive", "nonaktifkan", "false", "disable"].includes(user)) global.groups[sys.m.from].banned = false;
      sys.text(`Group ini sekarang telah di ${global.groups[sys.m.from].banned ? "`banned`" : "`unbanned`"} 🍃`);
    }
  })
}