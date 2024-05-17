const { DataBase } = require("../../controllers"),
  { ParseForm } = require("../../beans/forms");

const messages = {
  loginError: "Login error!",
};

const Code = async (req, res) => {
  const formData = await new ParseForm(req).parseForm(),
    data = await new DataBase().custom(
      `SELECT * FROM sms_verify LEFT JOIN users ON users.id = sms_verify.user_id WHERE code = '${formData.code}' and sms_verify.user_id = '${formData.id}' and active = true`
    );

  // Check is data value from DB
  if (!!data) {
    await new DataBase().update("users", `verify = true`, `id = '${data.user_id}'`);
    return res.status(200).send({
      err: null,
      user_id: data.user_id,
    });
  }
  res.status(201).send({ err: true, msg: messages.loginError });
};

module.exports = Code;
