const { DataBase } = require("../../controllers");

const messages = {
  loginSuccess: "Logout successfull!",
};

const Logout = async (req, res) => {
  await new DataBase().update(
    "tokens",
    `active = false`,
    `token = '${req.token}'`
  );
  res.status(200).send({ err: false, msg: messages.loginSuccess });
};

module.exports = Logout;
