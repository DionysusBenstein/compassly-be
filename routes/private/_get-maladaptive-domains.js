const { DataBase } = require("../../controllers");

const GetMaladaptiveDomains = async (req, res) => {
  const { id } = req.params;
  const domains = await new DataBase().custom(`SELECT * FROM domains`, true);

  const currentDomain = await new DataBase().custom(
    `SELECT domains.* FROM skills
    INNER JOIN sub_domains ON sub_domains.id = skills.parrent_id
    INNER JOIN domains ON domains.id = sub_domains.parrent_id
    WHERE skills.id = '${id}'`,
    false
  );

  domains.map((x) => {
    if (x.id === currentDomain.id) {
      x.current = true;
    } else {
      x.current = false;
    }
  });

  for (let d of domains) {
    if (d.id === currentDomain.id) {
      d.current = true;
    } else {
      d.current = false;
    }
  }

  return res.status(200).send(domains);
};

module.exports = GetMaladaptiveDomains;
