const { DataBase } = require("../../controllers"),
  { ParseForm } = require("../../beans");

const Domains = async (req, res) => {
  const { client_id } = await new ParseForm(req).parseForm();

  const _CHECK_MAL = await new DataBase().custom(
    `SELECT * FROM client_maladaptives WHERE client_id = '${client_id}'`
  );
  let _BEF = null;
  if (!_CHECK_MAL) {
    _BEF = `AND maladaptive = false`;
  }

  const data = await new DataBase().custom(
      `SELECT DISTINCT ON (domains.id) * FROM client_domain INNER JOIN domains ON domains.id = client_domain.domain_id WHERE client_id = '${client_id}' ${
        _BEF || ""
      }`,
      true
    ),
    result = data || [];

  res.status(200).send({ data: result, counts: result.length });
};

module.exports = Domains;
