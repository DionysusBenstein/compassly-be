const { DataBase } = require("../../controllers");

const GetSkills = async (req, res) => {
  const { subdomain_id } = req.params,
    skills = await new DataBase().custom(
      `SELECT * 
    FROM skills
    WHERE parrent_id = '${subdomain_id}'`,
      true
    );

  return res.status(200).send(skills);
};

module.exports = GetSkills;
