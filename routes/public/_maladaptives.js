const { DataBase, SkillsGraph } = require("../../controllers"),
  { ParseForm } = require("../../beans");

const Maladaptives = async (req, res) => {
  const { client_id } = await new ParseForm(req).parseForm(),
    { page = null, list_value = 20 } = req.query,
    _dom = await new DataBase().custom(
      `SELECT * FROM domains WHERE maladaptive = true`
    ),
    data = await new DataBase().custom(
      `SELECT skills.* FROM client_maladaptives INNER JOIN skills ON skills.id = client_maladaptives.skill_id WHERE skills.parrent_id = '${_dom.id}' AND client_maladaptives.client_id = '${client_id}'`,
      true
    );

  let result = [];

  if (page) {
    const toData = list_value * page - list_value;
    const doData = list_value * page;

    result = data.slice(toData, doData);
  } else {
    result = data;
  }

  for (let skill of result) {
    skill.miniGraph = await new SkillsGraph().getSkillsGraph(
      skill.id,
      client_id
    );
  }

  res.status(200).send({ data: result, counts: data.length });
};

module.exports = Maladaptives;
