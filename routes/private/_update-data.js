const { ParseForm } = require("../../beans"),
  moment = require("moment-timezone"),
  { DataBase } = require("../../controllers");

const checkValideIcon = (base) => {
  return base.indexOf("image/svg+xml") === -1;
};

const UpdateData = async (req, res) => {
  const formData = await new ParseForm(req).parseForm(),
    { table, id } = req.params;

  if (table === "users") {
    const user = await new DataBase().custom(
      `SELECT users.* FROM users WHERE users.id = '${id}'`
    );

    if (!user)
      return res.status(200).send({ err: true, msg: "User is not defined!" });

    if (formData.email && user.email !== formData.email) {
      const userFromEmail = await new DataBase().custom(
        `SELECT users.* FROM users WHERE users.email = '${formData.email}'`
      );

      if (!!userFromEmail) {
        return res
          .status(200)
          .send({ err: true, msg: "User with this email already exists!" });
      }
    }
  }

  if (table === "domains") {
    if (
      formData.icon !== "" &&
      formData.icon !== "null" &&
      checkValideIcon(formData.icon)
    ) {
      return res.status(200).json({
        err: true,
        msg: "Error image validation, please upload SVG image!",
      });
    }

    if (formData.icon === "null") formData.icon === null;
  }

  if (table === "skills") {
    const _skill = await new DataBase().custom(
      `SELECT * FROM skills WHERE id = '${id}'`
    );

    if (_skill) {
      if (Number(_skill.action_type) !== Number(formData.action_type)) {
        await new DataBase().delete("dcm", `skill_id = '${id}'`);
      }
    }
  }

  if (table === "company_materials") {
    const users = formData.users;
    delete formData.users;

    await new DataBase().delete(
      "company_materials_users",
      `company_material_id = ${id}`
    );

    let ids = [];
    if (users === "0") {
      ids = ["all"];
    } else {
      ids = users.split(",");
    }

    for (const user_id of ids) {
      const newMatUser = {
        user_id: user_id,
        company_material_id: id,
        create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
        created_time: moment().tz(global.tz).format("HH:mm"),
      };

      await new DataBase().insert("company_materials_users", newMatUser);
    }
  }

  const keys = Object.keys(formData);

  let queryLine = "",
    key = 1;

  for (const el of keys) {
    const isNum = el === "number";
    queryLine += `"${el}" = '${
      isNum ? formData[el].replace(/[^+\d]/g, "") : formData[el]
    }'${key < keys.length ? ", " : ""}`;
    key++;
  }

  if (table === "skills_data") {
    await new DataBase().update(table, queryLine, `id = ${id}`);
  } else {
    await new DataBase().update(table, queryLine, `id = '${id}'`);
  }

  return res.status(200).send({ err: false, msg: "saved successfully" });
};

module.exports = UpdateData;
