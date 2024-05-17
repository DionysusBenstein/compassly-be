const { DataBase, SkillsGraph } = require("../../controllers"),
  { ParseForm } = require("../../beans");

const SkillsData = async (req, res) => {
  const { skill_id = null, client_id = null } = await new ParseForm(
    req
  ).parseForm();

  if (!skill_id && !client_id)
    return res
      .status(200)
      .send({ err: true, msg: "Skill od Client id is not valid!" });

  const skill = await new DataBase().custom(
      `SELECT * FROM skills WHERE id = '${skill_id}'`,
      false
    ),
    data = await new DataBase().custom(
      `SELECT * FROM dcm WHERE skill_id = '${skill_id}' and client_id = '${client_id}'`,
      true
    ),
    result = data || [];

  // if (result.length < 10) return res.status(201).send({ result: 0 });

  const skillData = await new SkillsGraph().getSkillsGraph(skill_id, client_id),
    tabsData = await new DataBase().custom(
      `SELECT * FROM skills_data WHERE skill_id = '${skill_id}'`,
      true
    ),
    resultData = {
      action_type: Number(skill.action_type),
      ...skillData,
      tabs: tabsData,
    };

  console.log("skillData: ", skillData);

  res.status(200).send(resultData);
};

module.exports = SkillsData;
