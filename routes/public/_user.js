const { DataBase } = require("../../controllers");

const User = async (req, res) => {
  const user = await new DataBase().select("*", "users", "id = $1", [
    req.user_id,
  ]);

  return res.status(201).json(user);
};

module.exports = User;
