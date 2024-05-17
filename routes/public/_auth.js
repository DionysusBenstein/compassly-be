const { DataBase, Session } = require("../../controllers"),
  { ParseForm } = require("../../beans");

const messages = {
  loginSuccess: "User login successfull!",
  loginError: "User is not defined!",
  accessError: "You don't have access!",
};

const standart = async (req, res) => {
  const formData = await new ParseForm(req).parseForm(),
    user = await new DataBase().custom(`
    SELECT users.*, user_groups.level as user_level FROM users 
    LEFT JOIN user_groups ON user_groups.id = users.group 
    WHERE email = '${formData.email}' 
    AND password = '${formData.password}' 
    `); //AND verify = true

  /** TO DO -  back to verify true */

  if (!user)
    return { status: 201, data: { err: true, msg: messages.loginError } };

  // if (Number(user.user_level) === 3 || Number(user.user_level) === 4)
  //   return { status: 201, data: { err: true, msg: messages.accessError } };

  const { token } = await new Session(user).createSession();
  return { status: 201, data: { err: null, token } };
};

const biometric = async (req, res) => {
  const { device_id } = req.params;

  if (!device_id)
    return { status: 201, data: { err: true, msg: "Invalid device ID!" } };

  const bio = await new DataBase().custom(
    `SELECT * FROM biometric WHERE device_id = '${device_id}'`
  );

  if (!bio) return { status: 201, data: { err: true, msg: "Invalid device!" } };

  const user = await new DataBase().custom(
    `SELECT users.*, user_groups.level as user_level FROM users LEFT JOIN user_groups ON user_groups.id = users.group WHERE users.id = '${bio.user_id}'`
  );

  if (!user) return { status: 201, data: { err: true, msg: "Invalid user!" } };

  if (Number(user.user_level) === 3 || Number(user.user_level) === 4)
    return { status: 201, data: { err: true, msg: messages.accessError } };

  const { token } = await new Session(user).createSession();

  return { status: 201, data: { err: null, token } };
};

const Auth = async (req, res) => {
  const { device_id = null } = req.params;

  if (device_id) {
    const { status, data } = await biometric(req, res);

    return res.status(status).json(data);
  } else {
    const { status, data } = await standart(req, res);

    return res.status(status).json(data);
  }
};

module.exports = Auth;
