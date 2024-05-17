const { SECRET_KEY } = process.env,
  jwt = require("jsonwebtoken"),
  moment = require("moment-timezone"),
  DataBase = require("../database");

class Session {
  constructor(user) {
    this.user = user;
  }
  async createSession() {
    const { id, number } = this.user,
      token = jwt.sign({ id, number }, SECRET_KEY, {
        expiresIn: "30 days",
      }),
      newToken = {
        id: Date.now(),
        token,
        user_id: id,
        active: true,
        create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
        created_time: moment().tz(global.tz).format("HH:mm"),
      };

    await new DataBase().update(
      "sms_verify",
      `active = false`,
      `user_id = '${id}'`
    );

    if (!this.user.verify) {
      await new DataBase().update("users", `verify = true`, `id = '${id}'`);
    }

    await new DataBase().insert("tokens", newToken);

    return { token };
  }
}

module.exports = { Session };
