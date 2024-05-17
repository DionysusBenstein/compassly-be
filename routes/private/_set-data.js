const { ParseForm } = require("../../beans"),
  moment = require("moment-timezone"),
  { DataBase } = require("../../controllers");

const checkValideIcon = (base) => {
  if (base !== "" && base) {
    return base.indexOf("image/svg+xml") === -1;
  } else {
    return false;
  }
};

const SetData = async (req, res) => {
  const formData = await new ParseForm(req).parseForm(),
    { table } = req.params;

  let afterData = null;

  if (table === "calendar") {
    const ids = formData.client_id.split(",");
    delete formData.client_id;

    for (const id of ids) {
      formData.client_id = id;
      formData.author = req.user_id;
      await new DataBase().insert(table, formData);
    }

    return res.status(200).send({ msg: "Added successfully" });
  }

  if (table === "domains") {
    if (formData.icon !== "null" && checkValideIcon(formData.icon))
      return res.status(200).json({
        err: true,
        msg: "Error image validation, please upload SVG image!",
      });

    formData.create_date = moment().tz(global.tz).format("YYYY-MM-DD");
    formData.created_time = moment().tz(global.tz).format("HH:mm");
    formData.updated_date = moment().tz(global.tz).format("YYYY-MM-DD");
  }

  //before create
  if (table === "sub_domains") {
    formData.rate = 0;
    formData.create_date = moment().tz(global.tz).format("YYYY-MM-DD");
    formData.created_time = moment().tz(global.tz).format("HH:mm");
    formData.updated_date = moment().tz(global.tz).format("YYYY-MM-DD");
  }

  if (table === "skills") {
    formData.create_date = moment().tz(global.tz).format("YYYY-MM-DD");
    formData.created_time = moment().tz(global.tz).format("HH:mm");
    formData.updated_date = moment().tz(global.tz).format("YYYY-MM-DD");
  }

  if (table === "company_materials") {
    afterData = formData.users;
    delete formData.users;
    formData.client_id = req.user_id;
    formData.create_date = moment().tz(global.tz).format("YYYY-MM-DD");
    formData.created_time = moment().tz(global.tz).format("HH:mm");
    formData.updated_date = moment().tz(global.tz).format("YYYY-MM-DD");
  }

  const _RES = await new DataBase().insert(table, formData);

  // After
  if (table === "company_materials") {
    let ids = [];
    if (client_id === "0") {
      ids = ["all"];
    } else {
      ids = afterData.split(",");
    }

    for (const id of ids) {
      const newMatUser = {
        user_id: id,
        company_material_id: _RES.id,
        create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
        created_time: moment().tz(global.tz).format("HH:mm"),
      };

      await new DataBase().insert("company_materials_users", newMatUser);
    }
  }
  return res.status(200).send({ msg: "Added successfully", domain: _RES });
};

module.exports = SetData;
