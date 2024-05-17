const { ParseForm } = require("../../beans");
const { GraphController, DataBase } = require("../../controllers");

const SetData = async (req, res) => {
  const { start, end, doctor, client, domain, subdomain, skill, report } =
    await new ParseForm(req).parseForm();

  const { data } = await new GraphController(skill, client, "24h").getGraph({
    start: start,
    end: end,
  });

  const clientData = await new DataBase().custom(
    `SELECT * FROM clients WHERE id = '${client}'`,
    false
  );

  const domainData = await new DataBase().custom(
    `SELECT * FROM domains WHERE id = '${domain}'`,
    false
  );

  const subdomainData = await new DataBase().custom(
    `SELECT * FROM sub_domains WHERE id = '${subdomain}'`,
    false
  );

  const skills = await new DataBase().custom(
    `SELECT * FROM skills WHERE id = '${skill}'`,
    false
  );

  return res.status(200).send({
    report: data,
    client: clientData,
    domain: domainData,
    subdomain: subdomainData,
    skill: skills,
  });
};

module.exports = SetData;
