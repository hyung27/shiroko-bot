export default (handler) => {
  handler.add({
    cmd: ["nsfw"],
    cats: ["Group"],
    admin: true,
    args: true,
    typing: true,
    group: true,

    run: async ({ sys }) => {
      const user = sys.parseCommand[1]
      if (!user) return await sys.text("`1` untuk aktifkan `0` untuk nonaktif.");
      if (["1", "aktif", "active", "aktifkan", "true", "enable"].includes(user)) global.groups[sys.m.from].nsfw = true
      else if (["0", "deaktif", "nonaktif", "nonactive", "nonaktifkan", "false", "disable"].includes(user)) global.groups[sys.m.from].nsfw = false;
      sys.text(`Sukses mengubah settingan nsfw menjadi ${global.groups[sys.m.from].nsfw ? "`true`" : "`false`"} 🍃`);
    }
  })
}