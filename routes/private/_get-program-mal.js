const { DataBase } = require("../../controllers");

const GetProgram = async (req, res) => {
  const { two_page = null, list_value_two_page = 5 } = req.query,
    { client_id } = req.params,
    query = `SELECT *, client_maladaptives.id as client_maladaptives_id FROM client_maladaptives INNER JOIN skills ON skills.id = client_maladaptives.skill_id WHERE client_maladaptives.client_id = '${client_id}'`;

  const _maladaptives = await new DataBase().custom(query, true);

  if (two_page) {
    const toData = list_value_two_page * two_page - list_value_two_page;
    const doData = list_value_two_page * two_page;

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
