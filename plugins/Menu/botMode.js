import config from "../../src/settings/config.js"

export default (handler) => {
  handler.add({
    cmd: ["public"],
    cats: ["Owner"],
    typing: true,
    owner: true,

    run: async ({ sys }) => {
      config.options.botMode = "PUBLIC";
      await sys.text("> Status bot sekarang `PUBLIC`, siapapun bisa menggunakan bot ini.")
    }
  })
  
  handler.add({
    cmd: ["self"],
    cats: ["Owner"],
    typing: true,
    owner: true,
    
    run: async ({ sys }) => {
      config.options.botMode = "SELF";
      await sys.text("> Status bot sekarang `SELF`, hanya owner itu sendiri yang bisa menggunakan bot ini.")
    }
  })
}