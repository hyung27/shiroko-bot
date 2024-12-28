import Axios from "axios";
import FormData from "form-data";

export default (handler) => {
  handler.add({
    cmd: [["img2code", "i2c"]],
    cats: ["Other AI"],
    premium: true,
    typing: true,
    
    run: async ({ sys, exp, sock }) => {
      try {
        const buffer = await sys.m.dl();
        const form = new FormData();
        form.append('file', buffer, {
          filename: new Date() * 1 + '.jpg',
          contentType: "image/jpeg",
        })
        
        const response = await Axios.post('https://tmpfiles.org/api/v1/upload', form, {
          headers: {
            ...form.getHeaders()
          }
        });
        sys.text("> Proses ini akan memakan waktu yang lama mohon bersabar...")
        const imageUrl = response.data.data.url.replace("s.org/","s.org/dl/")
  
        const result = await exp.ai(imageUrl, "html_css");
        const output = typeof result === 'object' ? JSON.stringify(result, null, 2) : result;
        sys.text(output);
      } catch (error) {
        console.error("Error:", error.message);
        sys.text("> Terjadi kesalahan dalam mendapatkan respons.");
      }
    }
  })

  handler.func(async ({ exp }) => {
    exp.ai = async function ai(imageUrl, typecode) {
      try {
          const response = await Axios.post('https://luminai.my.id/screenshot-to-code', {
            imageUrl,
            typecode
          });

          return response.data.result.data;
      } catch (error) {
          console.error("Terjadi kesalahan:", error.message);
          return "Gagal mendapatkan respons dari AI.";
      }
    }
  })
}