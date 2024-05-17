const { DataBase } = require("../../controllers");

const AddCustomType = async (req, res) => {
  const { s_id, c_id } = req.params,
    { custom_type } = req.body;

  await new DataBase().delete(
    "skill_custom_type",
    `skill_id = '${s_id}' AND user_id = '${c_id}'`
  );
  await new DataBase().delete(
    "dcm",
    `client_id = '${c_id}' AND skill_id = '${s_id}'`
  );

  await new DataBase().insert("skill_custom_type", {
    skill_id: s_id,
    user_id: c_id,
    custom_type: custom_type,
  });

  return res
    .status(200)
    .send({ err: false, status: "ok", msg: "Activation client successfuly" });
};

module.exports = AddCustomType;
