const { DataBase } = require("../../controllers");

const GetActiveUsers = async (req, res) => {
  const { id } = req.params,
    user = await new DataBase().custom(
      `SELECT * FROM users WHERE id = '${id}'`,
      true
    );

  if (!user)
    return res.status(200).json({ err: true, msg: "User id is not valid" });

  return res.status(200).send({
    err: false,
    data: {
      name: user[0].name,
      surname: user[0].surname,
      email: user[0].email,
    },
  });
};

module.exports = GetActiveUsers;
