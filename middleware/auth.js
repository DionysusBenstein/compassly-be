const { DataBase } = require("../controllers");

const verifyToken = async (req, res, next) => {
  /* Вернуть проверку токена */
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

    req.token = bearerToken;
    req.user_id = checkToken?.user_id;
    if (checkToken) next();
    else res.sendStatus(403);
  } else {
    // Forbidden
    res.sendStatus(403);
  }
};

module.exports = verifyToken;
