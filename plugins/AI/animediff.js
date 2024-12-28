import Axios from "axios";

export default (handler) => {
  handler.add({
    cmd: ["animdiff"],
    cats: ["Image Gen AI"],
    premium: true,
    args: true,
    typing: true,

    run: async ({ sys, exp }) => {
      const res = await exp.anim(sys.nbody);
      await sys.image(sys.nbody, res);
    }
  })

  handler.func(async ({ exp }) => {
    exp.anim = async (prompt) => {
      const result = await Axios.get(`https://api.botwa.space/api/animediff?prompt=${encodeURIComponent(prompt)}&apikey=MudH0fxWVHV6`)
      return result.data.result.url;
    }
  })
}