import { createCanvas, loadImage, registerFont } from "canvas"
import path from "path"
import fs from "fs"

export default (handler) => {
  handler.add({
    cmd: ["canvas"],
    owner: true,
    typing: true,

    run: async ({ sys, exp, sock, m }) => {
      const jid = sys.parseCommand[1];
      const gen = await exp.createCanvas(jid ? jid : sys.sender, sys.pushName, sock, m);
      sys.image("Testing", gen);
    }
  })

  handler.func(({ exp }) => {
    exp.createCanvas = async (jid, pushName, sock, m) => {
      return new Promise(async (resolve) => {
        let ppUrl = ""
        let title = ""

        try {
          ppUrl = await sock.profilePictureUrl(jid, "image")
        } catch {
          ppUrl = path.join(global.__dirname, "src", "medias", "defaultProfile.jpg")
        }
        try {
          title = m.isGroup ? m.metadata.subject : pushName
        } catch (error) {
          title = pushName
        }

        if (true) {
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
        let line = [];
        let phase = 0;
        let currentLine = "";
        let index = 0;
        title.split(" ").forEach(v => line.push(v));
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
        ctx.fillText(pushName, posX, (posY * 2) + 40);
        ctx.font = "40px Chakra Petch Bold"
        ctx.fillStyle = '#ffffffbb';
        ctx.fillText("Selamat Datang di Grup", posX, (posY * 2) + 120);

        while (line.length >= index) {
          index++
          currentLine = line.slice(0, index).join(" ")
          
          if (ctx.measureText(currentLine).width >= (maxWidthText - 250)) {
            phase += 1;
            ctx.fillText(currentLine, posX, (posY * 2) + 120 + (45 * phase));
            currentLine = "";
            line.splice(0, index)
          }
          
          if (ctx.measureText(line.join(" ")).width < maxWidthText) {
            phase += 1;
            ctx.fillText(line.join(" "), posX, (posY * 2) + 120 + (45 * phase));
            line.splice(0, line.length)
            if (!line.length) break;
          }
        }

        const buffer = canvas.toBuffer()
        resolve(buffer)
        // const out = fs.createWriteStream(`./src/medias/${fileName}`);
        // const stream = canvas.createPNGStream();
        // stream.pipe(out);

        // out.on('finish', () => resolve(buffer));
      })
    }
  })
}