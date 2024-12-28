import Groq from "groq-sdk";

const groq = new Groq({ apiKey: "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" })

export default (handler) => {
  handler.add({
    cmd: [
      ["llama8b", "llm8"],
      ["llama70b", "llm70"],
      ["llama90b", "llm90"],
      ["llama3b", "llm3"],
      ["llama1b", "llm1"],
      ["llama11b", "llm11"],
      ["llama8bi", "llm8i"],
      ["llama70bv", "llm70v"],
      "genma9b",
    ],
    cats: ["Artificial Intelligence"],
    premium: true,
    typing: true,

    run: async ({ sys, exp }) => {
      try {
        let model = "";

        if (["llama8b", "llm8"].includes(sys.cmd)) {
          model = "llama3-8b-8192";
        } else if (["llama70b", "llm70"].includes(sys.cmd)) {
          model = "llama3-70b-8192";
        } else if (["llama90b", "llm90"].includes(sys.cmd)) {
          model = "llama-3.2-90b-text-preview";
        } else if (["llama3b", "llm3"].includes(sys.cmd)) {
          model = "llama-3.2-3b-preview";
        } else if (["llama1b", "llm1"].includes(sys.cmd)) {
          model = "llama-3.2-1b-preview";
        } else if (["llama11b", "llm11"].includes(sys.cmd)) {
          model = "llama-3.2-11b-text-preview";
        } else if (["llama8bi", "llm8i"].includes(sys.cmd)) {
          model = "llama-3.1-8b-instant";
        } else if (["llama70bv", "llm70v"].includes(sys.cmd)) {
          model = "llama-3.1-70b-versatile";
        } else if (sys.cmd == "genma9b") {
          model = "gemma2-9b-it";
        }
        const userText = sys.nbody;
  
        const result = await exp.ai(model, userText);
        const output = typeof result === 'object' ? JSON.stringify(result, null, 2) : result;
        sys.text(`> ${model.toUpperCase().split("-").join(" ")}

${output}`);
      } catch (error) {
        console.error("Error:", error.message);
        sys.text("> Terjadi kesalahan dalam mendapatkan respons.");
      }
    }
  })

  handler.func(async ({ exp }) => {
    exp.ai = async function ai(model, text) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          "messages": [
            {
              "role": "user",
              "content": text
            }
          ],
          "model": model,
          "temperature": 1,
          "max_tokens": 1024,
          "top_p": 1,
          "stream": false,
          "stop": null
        });
      
        return chatCompletion.choices[0]?.message?.content || ''
      } catch (error) {
          console.error("Terjadi kesalahan:", error.message);
          return "Gagal mendapatkan respons dari AI.";
      }
    }
  })
}