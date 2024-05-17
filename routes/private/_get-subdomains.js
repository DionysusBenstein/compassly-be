const { DataBase } = require("../../controllers");

const GetSubDomains = async (req, res) => {
  const { domain_id } = req.params,
    subdomains = await new DataBase().custom(
      `SELECT * 
    FROM sub_domains
    WHERE parrent_id = '${domain_id}'`,
      true
    );

  return res.status(200).send(subdomains);
};

module.exports = GetSubDomains;
