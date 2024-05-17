const { DataBase } = require("../../controllers");

const DeactiveClient = async (req, res) => {
  const { id } = req.params;

  await new DataBase().update("clients", `active = false`, `id = '${id}'`);
  return res
    .status(200)
    .send({ err: false, status: "ok", msg: "Deactivation client successfuly" });
};

module.exports = DeactiveClient;
