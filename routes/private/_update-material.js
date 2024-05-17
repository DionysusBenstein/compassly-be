const { ParseForm } = require("../../beans");
const { DataBase } = require("../../controllers"),
  moment = require("moment-timezone");

const UploadMaterial = async (req, res) => {
  const { id: material_id, client_id } = req.params;
  const { title, link, type } = await new ParseForm(req).parseForm();

  let ids = [];
  if (client_id === "0") {
    // const clientsRes = await new DataBase().custom(
    //   `SELECT clients.id FROM clients`,
    //   true
    // );
    ids = ["all"]; //clientsRes.map((x) => x.id);
  } else {
    ids = client_id.split(",");
  }

  if (type === "link") {
    const _BODY = {
        title,
        link,
        type,
        updated_date: moment().tz(global.tz).format("YYYY-MM-DD"),
      },
      keys = Object.keys(_BODY);

    let queryLine = "",
      key = 1;

    for (const el of keys) {
      queryLine += `"${el}" = '${_BODY[el]}' ${key < keys.length ? ", " : ""}`;
      key++;
    }

    await new DataBase().update("materials", queryLine, `id = ${material_id}`);
  } else {
    const _BODY = {
        title,
        type,
        updated_date: moment().tz(global.tz).format("YYYY-MM-DD"),
      },
      keys = Object.keys(_BODY);

    let queryLine = "",
      key = 1;

    for (const el of keys) {
      queryLine += `"${el}" = '${_BODY[el]}' ${key < keys.length ? ", " : ""}`;
      key++;
    }

    await new DataBase().update("materials", queryLine, `id = ${material_id}`);
  }

  await new DataBase().delete(
    "materials_users",
    `material_id = ${material_id}`
  );
  for (const id of ids) {
    const newMatUser = {
      client_id: id,
      material_id: material_id,
      create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
      created_time: moment().tz(global.tz).format("HH:mm"),
    };

    await new DataBase().insert("materials_users", newMatUser);
  }

  return res.status(200).send({
    msg: "Update cuccessfull!",
  });
};

module.exports = UploadMaterial;
