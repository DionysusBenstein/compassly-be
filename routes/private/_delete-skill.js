const { DataBase } = require("../../controllers");

const DeleteSkill = async (req, res) => {
  const { id } = req.params;

  await new DataBase().delete("skills", `id = '${id}'`);
  await new DataBase().delete("dcm", `skill_id = '${id}'`);
  await new DataBase().delete("client_maladaptives", `skill_id = '${id}'`);

  return res.status(200).send({ status: "ok" });
};

module.exports = DeleteSkill;
