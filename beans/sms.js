const DataBase = require("../controllers/database");
const Vonage = require("@vonage/server-sdk");

const vonage = new Vonage({
  apiKey: "692c23be",
  apiSecret: "lcBmkbK25w7BkJin",
});

class Sms {
  randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }
  async checkCode(userId) {
    const code = await new DataBase().select(
      "*",
      "sms_verify",
      "user_id = $1 and active = $2",
      [userId, true]
    );

    return !code;
  }
  async sendCode(user, type) {
    // const checkCode = await this.checkCode(user.id);

    // if (!checkCode) {
    const code = this.randomInteger(1000, 9999);

    const from = "18886311981";
    const to = user.number;
    const text = `Compassly code: ${code}`;

    vonage.message.sendSms(from, to, text, (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        if (responseData.messages[0]["status"] === "0") {
          console.log("Message sent successfully.");
        } else {
          console.log(
            `Message failed with error: ${responseData.messages[0]["error-text"]}`
          );
        }
      }
    });

    // global.bot.sendMessage(-1001568879885, `Compassly: ${code}`);

    const newSmsCode = {
      id: Date.now(),
      code: code,
      user_id: user.id,
      sms_date: Date.now(),
      type: type,
      active: true,
    };

    return newSmsCode;
    // } else {
    //   return false;
    // }
  }
  async sendNewPassword(user, password) {
    const from = "Compass password reset";
    const to = "380664273160";
    const text = `Hi, ${user.name} ${user.surname}. Use your new password to login - ${password}`;

    vonage.message.sendSms(from, to, text, (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        if (responseData.messages[0]["status"] === "0") {
          console.log("Message sent successfully.");
        } else {
          console.log(
            `Message failed with error: ${responseData.messages[0]["error-text"]}`
          );
        }
      }
    });
    // global.bot.sendMessage(-1001568879885, text);

    return true;
  }
}

module.exports = { Sms };
