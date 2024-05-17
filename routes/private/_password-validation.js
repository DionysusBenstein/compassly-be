const { DataBase } = require("../../controllers"),
  { ParseForm } = require("../../beans");

const messages = {
  passwordIsNUll: "Password is null!",
  passwordIncorect: "Oops! Password is incorrect",
  passwordCorect: "Oops! Password is incorrect",
};

const PasswordValidation = async (req, res) => {
  const { passwd = null } = await new ParseForm(req).parseForm();

  if (!passwd)
    return res
      .status(201)
      .send({ err: true, status: false, msg: messages.passwordIsNUll });

  const { password = null } = await new DataBase().custom(
    `SELECT users.password FROM users WHERE id = '${req.user_id}'`
  );

  return res.status(200).send({
    err: !(passwd === password),
    status: passwd === password,
    msg: !(passwd === password)
      ? messages.passwordCorect
      : messages.passwordIncorect,
  });
};

module.exports = PasswordValidation;
