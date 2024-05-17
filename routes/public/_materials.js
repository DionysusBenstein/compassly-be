const { DataBase } = require("../../controllers");

const Materials = async (req, res) => {
  const { client_id } = req.params;

  const query = `SELECT DISTINCT ON (materials.id) materials.* 
  FROM materials 
  INNER JOIN materials_users ON materials_users.material_id = materials.id WHERE materials_users.client_id = '${client_id}'`;
  const _list = await new DataBase().custom(query, true);

  // const materials = await new DataBase().custom(
  //   `SELECT * FROM materials WHERE client_id = '${client_id}'`,
  //   true
  // );

  return res.status(200).send({ err: false, data: _list });
};

module.exports = Materials;
