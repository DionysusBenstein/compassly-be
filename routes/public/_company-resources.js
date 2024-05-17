const { DataBase } = require("../../controllers");

const CompanyResources = async (req, res) => {
  const { page = null, list_value = 20 } = req.query,
    data = await new DataBase().custom(
      `SELECT DISTINCT ON (company_materials.id) company_materials.* 
      FROM company_materials 
      INNER JOIN company_materials_users ON company_materials_users.company_material_id = company_materials.id 
      WHERE company_materials_users.user_id = '${req.user_id}' OR company_materials_users.user_id = 'all'`,
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

  res.status(200).send({ data: result, counts: data.length });
};

module.exports = CompanyResources;
