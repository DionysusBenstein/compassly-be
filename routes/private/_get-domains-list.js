const { DataBase } = require("../../controllers");

const GetDomainsList = async (req, res) => {
  const { client_id } = req.params,
    domains = await new DataBase().custom(
      `SELECT domains.* FROM domains INNER JOIN client_domain ON client_domain.domain_id = domains.id WHERE client_domain.client_id = '${client_id}'`,
      true
    );

  return res.status(200).send(domains);
};

module.exports = GetDomainsList;
