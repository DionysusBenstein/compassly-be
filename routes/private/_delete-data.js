const { DataBase } = require("../../controllers");

const DeleteData = async (req, res) => {
  const { table, id } = req.params;

  if (table === "users") {
    const user = await new DataBase().custom(
      `SELECT * FROM users WHERE id = '${id}'`
    );

    await new DataBase().delete("registers_url", `email = '${user.email}'`);
  }

  if (table === "company_materials") {
    await new DataBase().delete(
      "company_materials_users",
      `company_material_id = ${id}`
    );
  }

  await new DataBase().delete(table, `id = '${id}'`);

  return res.status(200).send({ status: "ok" });
};

module.exports = DeleteData;
