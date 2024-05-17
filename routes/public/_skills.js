const { DataBase, SkillsGraph } = require("../../controllers"),
  { ParseForm } = require("../../beans");

//1 - Latency
//2 - Duration
//3 - Frequency
//4 - Rate
//5 - Intervals

const Skills = async (req, res) => {
  const { parrent_id = null, client_id = null } = await new ParseForm(
    req
  ).parseForm();

  if (!parrent_id)
    return res.status(200).send({ err: true, msg: "Parrent id is not valid!" });

  const data = await new DataBase().custom(
    `SELECT * FROM skills INNER JOIN client_skills ON client_skills.skill_id = skills.id WHERE parrent_id = '${parrent_id}'`,
    true
  );

  let result = data || [];

  for (let data of result) {
    data.miniGraph = await new SkillsGraph().getSkillsGraph(data.id, client_id);
  }

  res.status(200).send({ data: result, counts: result.length });
};

module.exports = Skills;
