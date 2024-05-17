const { DataBase } = require("../../controllers");

const DeleteClient = async (req, res) => {
  const { id } = req.params;

  await new DataBase().delete("clients", `id = '${id}'`);
  await new DataBase().delete("clients_doctors", `client_id = '${id}'`);
  await new DataBase().delete("client_domain", `client_id = '${id}'`);
  await new DataBase().delete("files", `client_id = '${id}'`);
  await new DataBase().delete("dcm", `client_id = '${id}'`);
  await new DataBase().delete("daily_planner", `client_id = '${id}'`);
  await new DataBase().delete("calendar", `client_id = '${id}'`);
  await new DataBase().delete("materials_users", `client_id = '${id}'`);

  return res.status(200).send({ status: "ok" });
};

module.exports = DeleteClient;
