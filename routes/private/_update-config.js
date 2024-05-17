// UpMalIcon
const { ParseForm } = require("../../beans"),
  { DataBase } = require("../../controllers");

const UpConfigDomain = async (req, res) => {
  const { skill_id, client_id } = req.params,
    { active } = await new ParseForm(req).parseForm();

  const ckeckActive = await new DataBase().custom(
    `SELECT * FROM client_skills WHERE skill_id = '${skill_id}' AND client_id = '${client_id}'`
  );

  if (ckeckActive) {
    await new DataBase().update(
      "client_skills",
      `active = ${active === "true"}`,
      `skill_id = '${skill_id}' AND client_id = '${client_id}'`
    );
    // await new DataBase().delete(
    //   "client_skills",
    //   `skill_id = '${skill_id}' AND client_id = '${client_id}'`
    // );
  } else {
    await new DataBase().insert("client_skills", {
      id: `config_${Date.now()}_${Math.random()}`,
      skill_id,
      client_id,
      active: true,
    });
  }

  return res.status(200).send({ msg: "Added successfully" });
};

module.exports = UpConfigDomain;
