const clc = require("cli-color"),
  notice = clc.blue,
  warn = clc.yellow,
  error = clc.red;

class CreateMessage {
  constructor() {
    this.init = true;
  }
  success(text) {
    console.log(notice(text));
  }
  error(text) {
    console.log(error(text));
  }
  warn(text) {
    console.log(warn(text));
  }
}

module.exports = { CreateMessage };
