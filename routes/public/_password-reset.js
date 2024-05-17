const { DataBase } = require("../../controllers"),
  { ParseForm, Sms } = require("../../beans");

const messages = {
  loginSuccess: "login successfull!",
  resetError: "User with this number does not exist!",
};

const ResetPassword = async (req, res) => {
  const { number } = await new ParseForm(req).parseForm(),
    user = await new DataBase().select("*", "users", "number = $1", [
      number.replace(/[^+\d]/g, ""),
    ]);

  if (!user)
    return res.status(201).send({ err: true, msg: messages.resetError });

  const newSmsCode = await new Sms().sendCode(user, "reset_password");

  const cteatedSMS = await new DataBase().insert("sms_verify", newSmsCode),
    newTime = setTimeout(async () => {
      await new DataBase().update(
        "sms_verify",
        `active = false`,
        `id = '${cteatedSMS.id}'`
      );
      clearTimeout(newTime);
    }, 1000 * 60);

  res.status(200).send({ err: false, user_id: user.id });
};

module.exports = ResetPassword;
