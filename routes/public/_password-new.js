const { DataBase } = require("../../controllers"),
  { ParseForm } = require("../../beans");

const messages = {
  resetError: "User with this number does not exist!",
};

const ResetPassword = async (req, res) => {
  const { number, password } = await new ParseForm(req).parseForm(),
    user = await new DataBase().select("*", "users", "number = $1", [number]);

  if (!user)
    return res.status(201).send({ err: true, msg: messages.resetError });

  await new DataBase().update(
    "users",
    `password = '${password}'`,
    `number = '${number}'`
  );

  res.status(200).send({ err: null });
};

module.exports = ResetPassword;
