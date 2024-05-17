const { DataBase } = require("../../controllers");

const Therapists = async (req, res) => {
  // WHERE user_groups.program_library = true and user_groups.clients = true
  const list = await new DataBase().custom(
    `SELECT *, users.id as user_id FROM users INNER JOIN user_groups ON user_groups.id = users.group`,
    true
  );

  return res.status(200).send(list);
};

module.exports = Therapists;
