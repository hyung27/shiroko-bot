import { imageToWebp, videoToWebp, writeExif } from "../../src/libs/sticker.js"
import fs from "fs";

export default (handler) => {
  handler.add({
    cmd: [["sticker", "s"]],
    cats: ["Tools"], // ( OPSIONAL )
    type: ["IMAGE", "VIDEO"], // Type spesifik ( Hanya menerima IMAGE dan VIDEO )
    typing: true, // ( OPSIONAL ) default false
    
    run: async ({ sys, m }) => {
      const media = await m.dl();
      if (!media) return;
      const buff = await (media.type == "IMAGE" ? imageToWebp(media.buffer) : videoToWebp(media.buffer));
      const pathExif = await writeExif({data: buff, mimetype: "webp"})
      await sys.sticker(pathExif)
      fs.unlink(pathExif, (err) => {
        if (err) console.log(err)
      })
    }
  })
}