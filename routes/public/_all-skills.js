const { DataBase, SkillsGraph } = require("../../controllers"),
  { ParseForm } = require("../../beans");

const Skills = async (req, res) => {
  const { client_id, domain_id } = await new ParseForm(req).parseForm();
  if (!client_id && !domain_id)
    return res
      .status(200)
      .send({ err: true, msg: "Client or Domain id is not valide" });

  const data = await new DataBase().custom(
    `SELECT sub_domains.*, skills as skills_list FROM client_domain 
      INNER JOIN sub_domains ON sub_domains.parrent_id = client_domain.domain_id 
      INNER JOIN skills ON skills.parrent_id = sub_domains.id
      INNER JOIN client_skills ON client_skills.skill_id = skills.id 
      WHERE client_id = '${client_id}' and client_domain.domain_id = '${domain_id}' AND maladaptive = false`,
    true
  );

  let result = data || [];

  for (let data of result) {
    data.miniGraph = await new SkillsGraph().getSkillsGraph(data.id, client_id);
  }

  res.status(200).send({ data: result, counts: result.length });
};

module.exports = Skills;
