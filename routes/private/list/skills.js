const { DataBase } = require("../../../controllers");

const getSkills = async (req, res) => {
  const {
    page = null,
    parrent_id = null,
    search = null,
    list_value = 20,
  } = req.query;

  const _domains = await new DataBase().custom(
    `SELECT DISTINCT ON (skills.id) skills.*, sub_domains.title AS sub_domain_title, domains.title AS domain_title FROM skills 
    LEFT JOIN sub_domains ON sub_domains.id = skills.parrent_id
    LEFT JOIN domains ON domains.id = sub_domains.parrent_id
    WHERE skills.maladaptive = false ${
      parrent_id ? `AND skills.parrent_id = '${parrent_id}'` : ""
    } ${search ? `AND skills.title ilike '%${search}%'` : ""}`,
    true
  );

  if (page) {
    const toData = list_value * page - list_value;
    const doData = list_value * page;

    const resultsArr = _domains.slice(toData, doData);

    return res.status(200).send({ list: resultsArr, counts: _domains.length });
  }

  return res.status(200).send({ list: _domains, counts: _domains.length });
};

module.exports = { getSkills };
