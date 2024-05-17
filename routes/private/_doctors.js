const { DataBase } = require("../../controllers");

const GetDoctors = async (req, res) => {
  const doctors = await new DataBase().custom(
    `SELECT users.id, users.name, users.surname
    FROM users
    INNER JOIN user_groups ON user_groups.id = users.group
    WHERE user_groups.level = 2 OR user_groups.level = 1`,
    true
  );

  return res.status(200).send(doctors);
};

module.exports = GetDoctors;
