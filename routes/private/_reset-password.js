const { DataBase, Session, NewDoctor } = require("../../controllers"),
  { ParseForm, Sms } = require("../../beans");

const messages = {
  loginSuccess: "User login successfull!",
  userError: "User this email is not defined!",
};

const ResetPassword = async (req, res) => {
  const formData = await new ParseForm(req).parseForm(),
    user = await new DataBase().select(
      "*",
      "users",
      "email = $1",
      [formData.email]
    );

  if (!user)
    return res.status(201).send({ err: true, msg: messages.userError });

  const randomstring = Math.random().toString(36).slice(-8);

  await new DataBase().update(
    "users",
    `password = '${randomstring}'`,
    `id = '${user.id}'`
  );

  await new NewDoctor(user).sendNewPassword(randomstring);
  await new Sms().sendNewPassword(user, randomstring);

  return res.status(200).send({ err: null, status: true });
};

module.exports = ResetPassword;
