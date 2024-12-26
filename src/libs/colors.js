const colors = {
  reset: (text) => "\x1b[0m" + text + "\x1b[0m",
  black: (text) => "\x1b[30m" + text + "\x1b[0m",
  red: (text) => "\x1b[31m" + text + "\x1b[0m",
  green: (text) => "\x1b[32m" + text + "\x1b[0m",
  yellow: (text) => "\x1b[33m" + text + "\x1b[0m",
  blue: (text) => "\x1b[34m" + text + "\x1b[0m",
  magenta: (text) => "\x1b[35m" + text + "\x1b[0m",
  cyan: (text) => "\x1b[36m" + text + "\x1b[0m",
  white: (text) => "\x1b[37m" + text + "\x1b[0m",

  bgReset: (text) => "\x1b[0m" + text + "\x1b[0m",
  bgBlack: (text) => "\x1b[40m" + text + "\x1b[0m",
  bgRed: (text) => "\x1b[41m" + text + "\x1b[0m",
  bgGreen: (text) => "\x1b[42m" + text + "\x1b[0m",
  bgYellow: (text) => "\x1b[43m" + text + "\x1b[0m",
  bgBlue: (text) => "\x1b[44m" + text + "\x1b[0m",
  bgMagenta: (text) => "\x1b[45m" + text + "\x1b[0m",
  bgCyan: (text) => "\x1b[46m" + text + "\x1b[0m",
  bgWhite: (text) => "\x1b[47m" + text + "\x1b[0m",
}

export default colors;