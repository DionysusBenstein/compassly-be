const { ParseForm } = require("../../beans"),
  moment = require("moment-timezone"),
  { DataBase } = require("../../controllers");

const SetData = async (req, res) => {
  const formData = await new ParseForm(req).parseForm();
  const list = formData.domain_id?.split(",");

  delete formData.skill_id;

  for (const dom of list) {
    const _DATA = {
      ...formData,
      id: `${Date.now()}_${Math.random()}`,
      domain_id: dom,
      create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
      created_time: moment().tz(global.tz).format("HH:mm"),
      updated_date: moment().tz(global.tz).format("YYYY-MM-DD"),
    };

    await new DataBase().insert("client_domain", _DATA);
  }

  res.status(200).send({ msg: "Added successfully" });
};

module.exports = SetData;
