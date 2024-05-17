const { ParseForm } = require("../../beans");
const { DataBase } = require("../../controllers");

const NewPassword = async (req, res) => {
  const { old_password, password } = await new ParseForm(req).parseForm();

  const user = await new DataBase().select("password", "users", "id = $1", [
    req.user_id,
  ]);

  if (user.password !== old_password)
    return res
      .status(202)
      .send({ msg: "The old password was entered incorrectly!" });

  await new DataBase().update(
    "users",
    `password = '${password}'`,
    `id = '${req.user_id}'`
  );

  return res.status(200).send({ msg: "Password updated successfully" });
};

module.exports = NewPassword;
