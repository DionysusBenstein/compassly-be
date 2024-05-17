const { DataBase } = require("../../controllers");

const DeleteCustomType = async (req, res) => {
  const { s_id, c_id } = req.params;

  await new DataBase().delete(
    "skill_custom_type",
    `skill_id = '${s_id}' AND user_id = '${c_id}'`
  );
  await new DataBase().delete(
    "dcm",
    `client_id = '${c_id}' AND skill_id = '${s_id}'`
  );
  return res
    .status(200)
    .send({ err: false, status: "ok", msg: "Delete successfuly" });
};

module.exports = DeleteCustomType;
