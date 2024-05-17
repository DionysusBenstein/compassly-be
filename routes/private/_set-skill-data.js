const { ParseForm } = require("../../beans"),
  moment = require("moment-timezone"),
  { DataBase } = require("../../controllers");

const SetSkillData = async (req, res) => {
  const data = req.body,
    { skill_id } = req.params;

  const getSkill = await new DataBase().custom(
    `SELECT * FROM skills WHERE id = '${skill_id}'`
  );

  if (!getSkill) {
    return res.status(201).json({ err: true, msg: "Error skill data" });
  }

  const newMaladaptive = await new DataBase().insert("skills_data", {
    ...data,
    skill_id: skill_id,
  });

  return res.status(200).send(newMaladaptive);
};

module.exports = SetSkillData;
