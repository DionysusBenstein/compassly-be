const { DataBase } = require("../../controllers");

const Init = async (req, res) => {
  const user = await new DataBase().select("*", "dcm", "createdate = $1", [
    new Date().toISOString().slice(0, 10),
  ]);

  res.status(200).send({ isDCM: !!user });
};

module.exports = Init;
