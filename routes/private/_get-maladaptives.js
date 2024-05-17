const { DataBase } = require("../../controllers");

const GetMaladaptives = async (req, res) => {
  const { client_id } = req.params,
    skills = await new DataBase().custom(
      `SELECT * FROM skills WHERE maladaptive = true`,
      true
    ),
    client = await new DataBase().custom(
      `SELECT * FROM client_maladaptives WHERE client_maladaptives.client_id = '${client_id}'`,
      true
    );

  let resArr = [];
  for (let skill of skills) {
    const { id } = skill;

    const check = client.find((x) => x.skill_id === id);
    if (!check) {
      resArr.push(skill);
    }
  }

  return res.status(200).send(resArr);
};

module.exports = GetMaladaptives;
