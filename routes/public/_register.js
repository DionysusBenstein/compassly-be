const { DataBase } = require("../../controllers"),
  { ParseForm, Validations } = require("../../beans"),
  { Sms } = require("../../beans/sms");

const messages = {
  userIsNotRegistered: "User with not registered!",
  regSuccessfull: "User register successfull!",
  regError: "User register error!",
  passwordError: "Password is not valide",
  numberError: "Error number valide",
};

const Register = async (req, res) => {
  const formData = await new ParseForm(req).parseForm(),
    checkUser = await new DataBase().custom(
      `SELECT * FROM registers_url INNER JOIN users ON users.id = registers_url.user_id WHERE token = '${formData.token}' and active = true`
    );

  //Check user from database
  if (!checkUser)
    return res.status(201).send({
      err: true,
      msg: messages.userIsNotRegistered,
    });

  //Password validation
  if (!new Validations().password(formData.password))
    return res.status(201).send({
      err: true,
      msg: messages.passwordError,
    });

  // if (!new Validations().number(formData.number))
  //   return res.status(201).send({
  //     err: true,
  //     msg: messages.numberError,
  //   });

  const { user_id } = checkUser;
  //after update user data from register
  await new DataBase().update(
    "users",
    `number = '${formData.number}', password = '${formData.password}', verify = true`,
    `id = '${user_id}'`
  );

  const newSmsCode = await new Sms().sendCode(checkUser, "login");

  const cteatedSMS = await new DataBase().insert("sms_verify", newSmsCode),
    newTime = setTimeout(async () => {
      await new DataBase().update(
        "sms_verify",
        `active = false`,
        `id = '${cteatedSMS.id}'`
      );
      clearTimeout(newTime);
    }, 1000 * 60);

  return res
    .status(200)
    .send({ err: false, msg: messages.regSuccessfull, user_id: user_id });
};

module.exports = Register;
