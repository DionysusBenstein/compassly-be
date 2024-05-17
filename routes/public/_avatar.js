const { DataBase } = require("../../controllers"),
  { ParseForm } = require("../../beans");

const Avatar = async (req, res) => {
  const { user_id } = req.params,
    { file } = await new ParseForm(req).parseFiles(`${user_id}_${Date.now()}`);

  if (file) {
    await new DataBase().update(
      "users",
      `avatar = '${file}'`,
      `id = '${user_id}'`
    );

    return res.status(200).send(file);
  }

  return res.status(200).send({ err: true, msg: "Error update photo!" });
};

module.exports = Avatar;
