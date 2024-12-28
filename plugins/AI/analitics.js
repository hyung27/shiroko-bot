import Axios from "axios"

export default (handler) => {
  handler.add({
    cmd: ["ocr"],
    cats: ["Other AI"],
    premium: true,
    typing: true,

    run: async ({ sys, exp }) => {
      try {
        const buffer = await sys.m.dl();
        const userText = sys.nbody;
  
        const result = await exp.ai(buffer, userText);
        const output = typeof result === 'object' ? JSON.stringify(result, null, 2) : result;
        sys.text(`> OCR

${output}`);
      } catch (error) {
        console.error("Error:", error.message);
        sys.text("> Terjadi kesalahan dalam mendapatkan respons.");
      }
    }
  })

  handler.func(async ({ exp }) => {
    exp.ai = async function ai(buffer, text) {
      try {
          const response = await Axios.post('https://luminai.my.id/', {
              content: text,
              imageBuffer: buffer
          });

          return response.data.result;
      } catch (error) {
          console.error("Terjadi kesalahan:", error.message);
          return "Gagal mendapatkan respons dari AI.";
      }
    }
  })
}