const { DataBase } = require("../../controllers");

const GetProgram = async (req, res) => {
  const { first_page = null, list_value_first_page = 5 } = req.query,
    { client_id } = req.params,
    query = `SELECT DISTINCT ON (domains.id) *, client_domain.id as client_domain_id, domains.title as domain_name FROM client_domain INNER JOIN domains ON domains.id = client_domain.domain_id WHERE client_id = '${client_id}' AND maladaptive = false`;

  const _maladaptives = await new DataBase().custom(query, true);

  if (first_page) {
    const toData = list_value_first_page * first_page - list_value_first_page;
    const doData = list_value_first_page * first_page;

    const resultsArr = _maladaptives.slice(toData, doData);

    return res
      .status(200)
      .send({ list: resultsArr, counts: _maladaptives.length });
  }

  return res
    .status(200)
    .send({ list: _maladaptives, counts: _maladaptives.length });
};

module.exports = GetProgram;
