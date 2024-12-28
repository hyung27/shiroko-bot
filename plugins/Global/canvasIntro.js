import { createCanvas, loadImage, registerFont } from "canvas"
import path from "path"
import fs from "fs"

export default (handler) => {
  handler.funcGlobal({
    generateCanvasIntro: async (jid, pushName, sock) => {
      return new Promise(async (resolve) => {
        let ppUrl = ""
        
        try {
          ppUrl = await sock.profilePictureUrl(jid, "image")
        } catch {
          ppUrl = path.join(global.__dirname, "src", "medias", "defaultProfile.jpg")
        }
  
        if (global.initFont) {
          if (!fs.existsSync(path.join(global.__dirname, "src", "medias", "font", "ChakraPetch-Bold.ttf"))) {
            console.error('Font file not found!');
          }
          registerFont(path.join(global.__dirname, "src", "medias", "font", "ChakraPetch-Bold.ttf"), { family: "Chakra Petch Bold" });
          global.initFont = false;
        }
  
        const width = 1280;
        const height = 720;
        const profileSize = 300
        const maxWidthText = 700 - 20
        let fontSize = 85
        const posX = 700 / 2;
        const posY = 200;
        const profileRadius = Math.min(profileSize, profileSize) / 2;
  
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
  
        const bgImage = await loadImage('./src/medias/bgNya.png')
        const boxImage = await loadImage('./src/medias/boxNya.png')
        const profileImage = await loadImage(ppUrl)
        ctx.drawImage(bgImage, 0, 0, width, height);
        ctx.drawImage(boxImage, 0, 0, 700, 720);
  
        ctx.save()
        ctx.beginPath()
        ctx.arc(posX, posY, profileRadius, 0, Math.PI * 2)
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(profileImage, posX / 2 + 25, posY / 2 - 50, profileSize, profileSize);
        ctx.restore()
  
        ctx.beginPath()
        ctx.arc(posX, posY, profileRadius, 0, Math.PI * 2)
        ctx.lineWidth = 10
        ctx.strokeStyle = "white"
        ctx.stroke()
  
        do {
          ctx.font = `${fontSize}px Chakra Petch Bold`;
          const textMetrics = ctx.measureText(pushName);
          if (textMetrics.width <= maxWidthText) {
            break;
          }
          fontSize--;
        } while (fontSize > 10);
  
        ctx.fillStyle = 'white';
        ctx.fontStyle = "bold";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pushName, posX, posY * 2);
        ctx.font = "35px Chakra Petch Bold"
        ctx.fillStyle = '#ffffffbb';
        ctx.fillText("Selamat Datang, jangan lupa", posX, (posY * 2) + 85);
        ctx.fillText("follow github saya di", posX, (posY * 2) + 130);
        ctx.fillText("htttps://github.com/Fahmi-XD", posX, (posY * 2) + 175);
  
        const buff = canvas.toBuffer()
        resolve(buff)
      })
    }
  })
}