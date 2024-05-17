const { DataBase } = require("../../controllers");

const CheckSession = async (req, res) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    const checkToken = await new DataBase().select(
      "*",
      "tokens",
      "token = $1 and active = true",
      [bearerToken]
    );

    const user = await new DataBase().custom(
      `SELECT users.*, user_groups.level as user_level FROM users INNER JOIN user_groups ON user_groups.id = users.group WHERE users.id = '${checkToken?.user_id}'`
    );

    if (!user) return res.send(null);

    delete user.password;
    if (checkToken) res.send(user);
    else res.send(null);
  } else {
    // Forbidden
    res.send(null);
  }
};

module.exports = CheckSession;
