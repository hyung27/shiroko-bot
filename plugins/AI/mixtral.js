import Axios from "axios"
import { randomUUID } from "node:crypto"

export default (handler) => {
  handler.add({
    cmd: ["mixtral"],
    cats: ["Artificial Intelligence"],
    premium: true,
    typing: true,

    run: async ({ sys, exp }) => {
      try {
        const userId = randomUUID();
        const userText = sys.nbody;
  
        const result = await exp.ai(userId, userText);
        const output = typeof result === 'object' ? JSON.stringify(result, null, 2) : result;
        sys.text(`> Mixtral 8x7B

${output}`);
      } catch (error) {
        console.error("Error:", error.message);
        sys.text("> Terjadi kesalahan dalam mendapatkan respons.");
      }
    }
  })

  handler.func(async ({ exp }) => {
    exp.ai = async function ai(userid, text) {
      try {
          const response = await Axios.post('https://luminai.my.id/v2', {
              text: text,
              userId: userid,
              model: "mistralai/Mixtral-8x7B-Instruct-v0.1"
          });

          return response.data.reply.reply;
      } catch (error) {
          console.error("Terjadi kesalahan:", error.message);
          return "Gagal mendapatkan respons dari AI.";
      }
    }
  })
}