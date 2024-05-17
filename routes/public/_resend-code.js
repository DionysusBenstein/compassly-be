const { DataBase } = require("../../controllers"),
  { ParseForm, Sms } = require("../../beans");

const messages = {
  loginError: "Login error!",
};

const ResendCode = async (req, res) => {
  const formData = await new ParseForm(req).parseForm(),
    user = await new DataBase().select("*", "users", "id = $1", [formData.id]);

  if (!user)
    return res.status(201).send({ err: true, msg: messages.loginError });

  await new DataBase().delete("sms_verify", `user_id = '${formData.id}'`);

  const newSmsCode = await new Sms().sendCode(user, "login");

  const cteatedSMS = await new DataBase().insert("sms_verify", newSmsCode),
    newTime = setTimeout(async () => {
      await new DataBase().update(
        "sms_verify",
        `active = false`,
        `id = '${cteatedSMS.id}'`
      );
      clearTimeout(newTime);
    }, 1000 * 60);

  // Check is data value from DB
  return res.status(200).send({
    err: null,
    data: "new sms sending",
  });
};

module.exports = ResendCode;
