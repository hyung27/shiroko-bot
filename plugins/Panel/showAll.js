export default (handler) => {
  handler.add({
    cmd: [["showall", "sall"]],
    cats: ["Panel"],
    owner: true,
    args: true,
    typing: true,
    
    run: ({ sys }) => {
      if (["enable", "enb", "1", "true", "aktif", "active"].includes(sys.parseCommand[1].toLowerCase())) {
        global.showAll = true;
        sys.text("> Settingan show all panel menu sudah di aktifkan.")
      } else if (["disable", "dis", "0", "false", "deaktif", "deactive"].includes(sys.parseCommand[1].toLowerCase())) {
        global.showAll = false;
        sys.text("> Settingan show all panel menu sudah di nonaktifkan.")
      } else {
        sys.text("> *Perintah tidak ditemukan.*")
      }
    }
  })
}