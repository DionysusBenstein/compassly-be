const { DataBase } = require("../../controllers");

const GetDomains = async (req, res) => {
  const { client_id } = req.params,
    domains = await new DataBase().custom(`SELECT * FROM domains`, true),
    client = await new DataBase().custom(
      `SELECT * FROM client_domain WHERE client_domain.client_id = '${client_id}'`,
      true
    );

  let resArr = [];
  for (let domain of domains) {
    const { id } = domain;

    const check = client.find((x) => x.domain_id === id);
    if (!check && !domain.maladaptive) {
      resArr.push(domain);
    }
  }

  return res.status(200).send(resArr);
};

module.exports = GetDomains;
