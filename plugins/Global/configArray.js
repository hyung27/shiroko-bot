export default (handler) => {
  handler.funcGlobal({
    getConfigId: (provider = "", nama = "") => {
      provider = provider?.toLowerCase();
      nama = nama?.toLowerCase();

      const providerArray = [
        ["telkomsel", "tsel", "telkom", "sel", "telekom", "telekomunikasi", "tri", "mytelkomsel", "telsel", 1, 1],
        ["axis", "eksis", "exsis", "aksis", "axsis", "akis", "eksis", "exis", "ekis", "asik", "murah", 2, 2],
        // ["xl", "eksel", "exsel", "ekl", "kl", "xs", "lx", "ls", "brottli", 3],
        // ["byu", "bayu", "baiu", "biu", "byeu", "bai", "baui", 4],
        // ["indosat", "isat", "indo", "sat", "insat", "m3", "mtri", 5]
      ]
      const configArray = [
        ["ilmupedia", "ilped", "pedia", "ilmu", "ilmuped", "pediailmu", "ilmupeds", "ilmupadi", 1, 1],
        ["sushiroll", "sussirol", "sussirrol", "sussirroll", "sussiirol", "susiroll", "susirool", "sushirool", "susiroll", 2, 2],
        // ["video", "vidio", "pidio", "vid", "pid", "pideo", "fidio", "fideo", "fid", 3],
        // ["edukasi", "edu", "eds", "kasi", 4],
        ["game", "gaming", "games", "gem", "geme", "gam", "gamee", 2, 5]
      ]
      
      if (!provider && !nama) {
        return {
          providerArray,
          configArray
        }
      }

      return {
        fileName: `Config ${providerArray.filter((v) => v.includes(provider))?.[0]?.[0] || null} ${configArray.filter((v) => v.includes(nama))?.[0]?.[0] || null}`,
        provider: providerArray.filter((v) => v.includes(provider))?.[0]?.at(-1) || null,
        config: configArray.filter((v) => v.includes(nama))?.[0]?.at(-1) || null,
        allProvider: providerArray.map((v) => v[0].charAt(0).toUpperCase() + v[0].slice(1)),
        allConfig: configArray.map((v) => v[0].charAt(0).toUpperCase() + v[0].slice(1)),
      }
    }
  })
}