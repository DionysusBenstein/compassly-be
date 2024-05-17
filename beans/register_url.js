const crypto = require("crypto");

class RegisterURL {
  async generate(email) {
    const URL = `${email}_REG_${Date.now()}`;
    const hash = crypto.createHash("sha256").update(URL).digest("hex");

    return hash;
  }
}

module.exports = { RegisterURL };
