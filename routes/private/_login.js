const { DataBase, Session } = require("../../controllers"),
  { ParseForm } = require("../../beans");

const messages = {
  loginSuccess: "User login successfull!",
  loginError: "User is not defined!",
  accessError: "you don't have access!",
};

const Login = async (req, res) => {
  const formData = await new ParseForm(req).parseForm(),
    user = await new DataBase().custom(`
      SELECT users.*, user_groups.level as user_level FROM users 
      LEFT JOIN user_groups ON user_groups.id = users.group 
      WHERE email = '${formData.email}' 
      AND password = '${formData.password}' 
      `);

  if (!user)
    return res.status(201).send({ err: true, msg: messages.loginError });

  // if (Number(user.user_level) === 2)
  //   return res.status(201).send({ err: true, msg: messages.accessError });

  const { token } = await new Session(user).createSession();

  return res
    .status(200)
    .send({ err: null, token, user_level: user.user_level });
};

module.exports = Login;
