const { DataBase } = require("../../controllers");

const ActiveClient = async (req, res) => {
  const { id } = req.params;

  await new DataBase().update("clients", `active = true`, `id = '${id}'`);
  return res
    .status(200)
    .send({ err: false, status: "ok", msg: "Activation client successfuly" });
};

module.exports = ActiveClient;
