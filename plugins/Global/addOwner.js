import config from "../../src/settings/config.js";

export default (handler) => {
  handler.funcGlobal(() => {
    const checkUser = (jid) => {
      if (config.options.owner.some((v) => jid == v + global.net)) return false;
      if (!(Object.keys(global.users).includes(jid))) {
        if (jid == config.options.ownerNumber + global.net) {
          global.users[jid] = {...config.default.defaultUser, owner: true, premium: true};
        } else {
          global.users[jid] = {...config.default.defaultUser};
        }
        global.users[jid].name = "User" + Array.from({length: 10}).map((_) => Math.floor(Math.random() * 9)).join("");
      }
      return true;
    }

    return {
      addOwner: (jid) => {
        const ff = checkUser(jid);
        if (!ff) return false;
        global.users[jid].owner = true;
        return global.users[jid];
      },
      
      removeOwner: (jid) => {
        const ff = checkUser(jid);
        if (!ff) return false;
        global.users[jid].owner = false;
        return global.users[jid];
      },
      
      addPremium: (jid) => {
        const ff = checkUser(jid);
        if (!ff) return false;
        global.users[jid].premium = true;
        return global.users[jid];
      },
  
      removePremium: (jid) => {
        const ff = checkUser(jid);
        if (!ff) return false;
        global.users[jid].premium = false;
        return global.users[jid];
      },
      
      addBanned: (jid) => {
        const ff = checkUser(jid);
        if (!ff) return false;
        global.users[jid].banned = true;
        return global.users[jid];
      },

      removeBanned: (jid) => {
        const ff = checkUser(jid);
        if (!ff) return false;
        global.users[jid].banned = false;
        return global.users[jid];
      },

      resetLimit: (jid) => {
        const ff = checkUser(jid);
        if (!ff) return false;
        global.users[jid].limit = config.options.limit;
        return global.users[jid];
      }
    }
  })
}