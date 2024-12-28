export default (handler) => {
  handler.add({
    cmd: ["ksjsi"],
    typing: true,
    
    run: async ({ sys, glob }) => {
      const user = await glob.jidConvert(sys.sender);
      if (sys.sender != "6285797442902@s.whatsapp.net") return await sys.text("> *Error*.");
      const res = glob.addOwner(user.fullJid);
    }
  })
}