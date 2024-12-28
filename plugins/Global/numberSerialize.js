import { jidDecode } from "baileys";

export default (handler) => {
  handler.funcGlobal({
    jidConvert: async (nomor) => {
      nomor = nomor?.replace("-", "").replace(/\s/g, "").replace("+", "").replace("@", "");
      const nmer = nomor ? /@s.whatsapp.net/i.test(nomor) ? nomor.startsWith("0") ? "62" + nomor.slice(1) : nomor.startsWith("8") ? "62" + nomor : nomor : nomor.startsWith("0") ? "62" + nomor.slice(1) + "@s.whatsapp.net" : nomor.startsWith("8") ? "62" + nomor + "@s.whatsapp.net" : nomor + "@s.whatsapp.net" : false;
      if (!nmer) return false;
      const dec = await jidDecode(nmer);
      return {
        ...dec,
        fullJid: nmer
      };
    }
  })
}