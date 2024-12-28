import Axios from "axios"

export default (handler) => {
  handler.add({
    cmd: ["gpt4"],
    cats: ["Artificial Intelligence"],
    premium: true,
    typing: true,

    run: async ({ sys, exp }) => {
      try {
        const userId = sys.sender;
        const userText = sys.nbody;
  
        const result = await exp.ai(userId, userText);
        const output = typeof result === 'object' ? JSON.stringify(result, null, 2) : result;
        sys.text(`> GPT 4

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
          const response = await Axios.post('https://luminai.my.id/', {
              content: text,
              userId: userid,
              model: "gpt-4o"
          }, {timeout: 10000});

          return response.data.result;
      } catch (error) {
          console.error("Terjadi kesalahan:", error.message);
          return "Gagal mendapatkan respons dari AI.";
      }
    }
  })
}