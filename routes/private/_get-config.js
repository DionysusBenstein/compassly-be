const path = require("path");
const { DataBase } = require("../../controllers");

const GetConfigDomain = async (req, res) => {
  const { domain_id, client_id } = req.params;
  const _domain = await new DataBase().custom(
    `SELECT * FROM domains WHERE id = '${domain_id}'`
  );

  const _QUERY = `SELECT st.*
  FROM (SELECT sub_domains.*, to_jsonb(COALESCE(array_agg(skills.*), ARRAY[]::skills[])) as skills_list
  FROM sub_domains
  LEFT JOIN skills ON skills.parrent_id = sub_domains.id
  WHERE sub_domains.parrent_id = '${domain_id}' 
  GROUP BY sub_domains.id
  ) AS st`;

  const _subdomains = await new DataBase().custom(_QUERY, true);
  const _QUERY_ACTIVES = `SELECT client_skills.*, skill_custom_type.custom_type FROM client_skills LEFT JOIN skill_custom_type ON skill_custom_type.skill_id = client_skills.skill_id WHERE client_skills.client_id = '${client_id}'`;
  const _actives = await new DataBase().custom(_QUERY_ACTIVES, true);

  return res.status(200).json({
    domain: _domain,
    subdomain: _subdomains,
    actives: _actives,
  });
};

module.exports = GetConfigDomain;
