import baileys from "baileys";
import { exec } from "child_process";

import colors from "../../src/libs/colors.js";

export default (handler) => {
  handler.add({
    cprefix: [">"],
    cats: ["Owner"],
    owner: true,
    args: true,
    typing: true,

    run: async ({ sys, exp, m }) => {
      try {
        exp.handleError(sys);
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
      exp.handleError(sys)
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

    const antiDuplicate = (func) => {
      let time;

      return (...args) => {
        clearTimeout(time);

        time = setTimeout(() => {
          func.call(this, ...args)
        }, 1000)
      }
    }

    const once = antiDuplicate((mess, sys) => {
      sys.text(mess.toString());
    })
    
    exp.handleError = (sys) => {
      // process.once("uncaughtException", (err) => {
      //   console.log(`[ ${colors.red("ERROR")} ] ${colors.magenta(err.message)}`);
      //   once(err.message, sys)
      // });

      process.once("unhandledRejection", (reason, promise) => {
        console.log(`[ ${colors.red("ERROR")} ] ${colors.magenta(reason)} - ${colors.magenta(promise)}`);
        once(reason, sys)
      });
    }
  })
}