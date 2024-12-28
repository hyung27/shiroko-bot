import Axios from "axios"
import { randomUUID } from "node:crypto"

export default (handler) => {
  handler.add({
    cmd: [["llama70", "llm7"]],
    cats: ["Artificial Intelligence"],
    premium: true,
    typing: true,

    run: async ({ syn, exp }) => {
      try {
        const userId = randomUUID();
        const userText = sys.nbody;
  
        const result = await exp.ai(userId, userText);
        const output = typeof result === 'object' ? JSON.stringify(result, null, 2) : result;
        sys.text(`> LLAMA 70B
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
              model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo"
          });

          return response.data.reply.reply;
      } catch (error) {
          console.error("Terjadi kesalahan:", error.message);
          return "Gagal mendapatkan respons dari AI.";
      }
    }
  })
}