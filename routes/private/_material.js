const { DataBase } = require("../../controllers"),
  moment = require("moment-timezone");

const UploadMaterial = async (req, res) => {
  const { client_id } = req.params,
    files = req.files,
    { type, link, title } = req.body;

  let ids = [];
  if (client_id === "0") {
    ids = ["all"];
  } else {
    ids = client_id.split(",");
  }

  if (type === "file") {
    for (const file of files) {
      let newMaterial = {
        title: title,
        size: file.size,
        format: file.mimetype,
        type: type,
        updated_date: moment().tz(global.tz).format("YYYY-MM-DD"),
        create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
        created_time: moment().tz(global.tz).format("HH:mm"),
      };

      const { id: material_id } = await new DataBase().insert(
        "materials",
        newMaterial
      );

      await new DataBase().insert("materials_name", {
        material_id: material_id,
        originalname: file?.originalname,
      });

      for (const id of ids) {
        const newMatUser = {
          client_id: id,
          material_id: material_id,
          create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
          created_time: moment().tz(global.tz).format("HH:mm"),
        };

        await new DataBase().insert("materials_users", newMatUser);
      }
    }
  } else {
    let newMaterial = {
      title: title || "...",
      size: 0,
      format: "link",
      type: type,
      link: link,
      updated_date: moment().tz(global.tz).format("YYYY-MM-DD"),
      create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
      created_time: moment().tz(global.tz).format("HH:mm"),
    };

    const { id: material_id } = await new DataBase().insert(
      "materials",
      newMaterial
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
  }

  return res.status(200).send({
    msg: "Upload file cuccessfull!",
  });
};

module.exports = UploadMaterial;
