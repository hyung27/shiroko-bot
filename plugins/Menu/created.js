export default handler => {
  handler.add({
    cmd: ["owner"],
    cats: ["Info"],
    typing: true,

    run: async ({ sys }) => {
      try {
        const contacts = [
          {
            displayName: "Fahmi XD",
            vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;;;;\nFN: Fahmi XD ✆\nitem1.TEL;waid=6285797442902:+62 85-7974-42902\nitem1.X-ABLabel:Ponsel\nPHOTO;\nX-WA-BIZ-DESCRIPTION:Developer bot Syntx\nX-WA-BIZ-NAME:\nMy Name Is *Fahmi* 🙂\nEND:VCARD",
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true
            }
          }
        ]
        sys.contact("Fahmi XD", contacts, false)
      } catch (e) {
        sys.text(e.message);
      }
    }
  });
};
