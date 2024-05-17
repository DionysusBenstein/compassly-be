const { getSort } = require("../../calculates");
const { DataBase } = require("../../controllers"),
  { ParseForm } = require("../../beans");

const ReportSubdomains = async (req, res) => {
  const { parrent_id = null, client_id = null } = await new ParseForm(
    req
  ).parseForm();

  if (!parrent_id)
    return res
      .status(200)
      .send({ err: true, msg: "Domain id is not valid!", data: [], counts: 0 });

  if (!client_id)
    return res
      .status(200)
      .send({ err: true, msg: "Client id is not valid!", data: [], counts: 0 });

  const data = await new DataBase().custom(
    `SELECT * FROM sub_domains WHERE parrent_id = '${parrent_id}'`,
    true
  );

  let resultDataList = [];

  for (let subdomain of data) {
    const _QUERY = `SELECT skills.*, 
    COALESCE (
      NULLIF (skill_custom_type.custom_type, ''),
      LEFT (skills.action_type, 40)
    ) as action_type 
    FROM skills 
    INNER JOIN client_skills ON client_skills.skill_id = skills.id 
    LEFT JOIN skill_custom_type ON skill_custom_type.skill_id = client_skills.skill_id
    WHERE skills.parrent_id = '${subdomain.id}' AND client_skills.client_id = '${client_id}' AND client_skills.active = true`;

    const getSkills = await new DataBase().custom(_QUERY, true);
    if (getSkills.length > 0) {
      subdomain.skills_list = getSkills;

      resultDataList.push(subdomain);
    }
  }

  res.status(200).send({ data: resultDataList, counts: resultDataList.length });
};

module.exports = ReportSubdomains;
