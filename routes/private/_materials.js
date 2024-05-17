const { DataBase } = require("../../controllers");

const GetMaterials = async (req, res) => {
  const { page = 1, client_id, list_value = 20 } = req.query;

  let _join = "";
  let _where = "";
  if (client_id) {
    _join = `LEFT JOIN clients ON clients.id = materials_users.client_id`;
    _where = `${
      _where === "" ? "WHERE" : " AND"
    } materials_users.client_id = '${client_id}' OR materials_users.client_id = 'all'`;
  }
  const query = `SELECT DISTINCT ON (materials.id) materials.*, materials_users.client_id, materials_name.originalname FROM materials LEFT JOIN materials_name ON materials_name.material_id = materials.id INNER JOIN materials_users ON materials_users.material_id = materials.id ${_join} ${_where}`;
  const _list = await new DataBase().custom(query, true);

  const toData = list_value * Number(page) - list_value;
  const doData = list_value * Number(page);

  const resultsArr = _list.slice(toData, doData);

  for (const material of resultsArr) {
    if (material.client_id === "all") {
      material.clients = [{ value: 0, label: "All clients" }];
    } else {
      const _clients_query = `SELECT clients.* FROM clients INNER JOIN materials_users ON clients.id = materials_users.client_id WHERE materials_users.material_id = ${material.id}`,
        clientsRes = await new DataBase().custom(_clients_query, true);

      material.clients =
        clientsRes.map((el) => {
          return {
            value: el.id,
            label: el.title || `${el.name} ${el.surname}`,
          };
        }) || [];
    }
  }

  return res
    .status(200)
    .send({ list: resultsArr, counts: Number(_list.length) });
};

module.exports = GetMaterials;
