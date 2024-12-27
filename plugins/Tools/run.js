import baileys from "baileys";
import { exec } from "child_process";

export default (handler) => {
  handler.add({
    cprefix: [">"],
    cats: ["Owner"],
    owner: true,
    args: true,
    typing: true,

    run: async ({ sys, exp, m }) => {
      try {
        const output = await exp.exec(sys.nbody);
        output ? sys.text(typeof output == "object" ? JSON.stringify(output, null, 2) : output) : null
      } catch (e) {
        sys.text(e.message)
      }
    }
  })

  handler.add({
    cprefix: ["$"],
    cats: ["Owner"],
    owner: true,
    args: true,
    typing: true,

    run: async ({ sys, exp }) => {
      const output = await exp.res(sys.nbody);
      sys.text(output)
    }
  })

  handler.func(({ exp, sys, sock }) => {
    exp.exec = async (code) => {
      try {
        const out = await eval(`
          try {
            (async (sys, sock, exp, ctx) => {
              ${code}
            })(sys, sock, exp, baileys)
          } catch (e) {
            e.message
          }
`)
        return out
        // return "> *Error* harap coba lagi nanti..."
      } catch (e) {
        if (e instanceof SyntaxError) {
          return e.message;
        } else {
          throw e;
        }
      }
    }

    exp.res = async (command) => {
      return new Promise((resolve, reject) => {
        try {
          exec(command, (stderr, stdout) => {
            if (stderr) resolve(stderr.message);
            resolve(stdout)
          })
        } catch (e) {
          resolve(e.message)
        }
      })
    }
  })
}