const { DataBase } = require("../../controllers");

const Login = async (req, res) => {
  await new DataBase().update(
    "tokens",
    `active = false`,
    `token = '${req.token}'`
  );

  await new DataBase().delete("tokens", `token = '${req.token}'`);

  return res.status(200).send({ status: "ok" });
};

module.exports = Login;
