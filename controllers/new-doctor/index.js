const { API_URL, FRONT_URL } = process.env,
  DataBase = require("../database"),
  moment = require("moment-timezone"),
  { Email, RegisterURL } = require("../../beans");

const messages = {
  emailSendSuccess: "Email sending success!",
  emailSendError: "Email sending error!",
};

class NewDoctor {
  constructor(user) {
    this.user = user;
  }

  async sendEmailNewPasswd(passwd, call) {
    new Email({
      to: this.user.email,
      subject: "Register from Compass",
      message: `Hi, ${this.user.name} ${this.user.surname}. New password - ${passwd}`,
    }).sendMessage(async (error, info) => {});

    return true;
  }
  async sendEmailClinician() {
    const regToken = await new RegisterURL().generate(this.user.email),
      sendingResult = new Promise((resolve, reject) => {
        const NEW_URL = `${API_URL}/deeplink/${regToken}`;

        new Email({
          to: this.user.email,
          subject: "Register from Compass",
          message: `Hi, ${this.user.name} ${this.user.surname}. Please, download the Compass application and follow the link to set up the password for your account - ${NEW_URL}`,
        }).sendMessage(async (error, info) => {
          try {
            await new DataBase().insert("registers_url", {
              id: Date.now(),
              token: regToken,
              user_id: this.user.id,
              email: this.user.email,
              active: true,
              create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
              created_time: moment().tz(global.tz).format("HH:mm"),
            });
          } catch (e) {
            reject({ status: 201, message: messages.emailSendError });
          } finally {
            resolve({ status: 201, message: messages.emailSendSuccess });
          }
        });
      });

    return sendingResult;
  }

  async sendEmailOther() {
    const regToken = await new RegisterURL().generate(this.user.email),
      sendingResult = new Promise((resolve, reject) => {
        const NEW_URL = `${API_URL}/admin/activate/${regToken}`;
        // const DEMO = `${FRONT_URL}/demo?token=${regToken}`; [Demo link -  ${DEMO}]
        /** TO DO */
        new Email({
          to: this.user.email,
          subject: "Register from Compass",
          message: `Hi, ${this.user.name} ${this.user.surname}. Please, activate the link - ${NEW_URL}`,
        }).sendMessage(async (error, info) => {
          await new DataBase().insert("registers_url", {
            id: Date.now(),
            token: regToken,
            user_id: this.user.id,
            email: this.user.email,
            active: true,
            create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
            created_time: moment().tz(global.tz).format("HH:mm"),
          });

          resolve({ status: 201, message: messages.emailSendSuccess });
        });
      });

    return sendingResult;
  }

  async sendNewPassword(password) {
    const sendingResult = new Promise((resolve, reject) => {
      new Email({
        to: this.user.email,
        subject: "Forgot password from Compass",
        message: `Hi, ${this.user.name} ${this.user.surname}. Use your new password to login - ${password}`,
      }).sendMessage(async (error, info) => {
        resolve({ status: 201, message: messages.emailSendSuccess });
      });
    });

    return sendingResult;
  }
}

module.exports = { NewDoctor };
