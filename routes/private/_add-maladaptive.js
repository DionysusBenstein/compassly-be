const { ParseForm } = require("../../beans"),
  moment = require("moment-timezone"),
  { DataBase } = require("../../controllers");

const AddMaladaptive = async (req, res) => {
  const formData = await new ParseForm(req).parseForm();

  const getDomain = await new DataBase().custom(
    `SELECT * FROM domains WHERE maladaptive = true`
  );

  if (Number(formData.action_type) === 5) {
    if (!formData.sub_type || formData.sub_type === "")
      return res
        .status(201)
        .json({ err: true, msg: "Error Intervals type value" });
  }

  const newMaladaptive = await new DataBase().insert("skills", {
    ...formData,
    id: `maladaptive_${Date.now()}_${Math.random()}`,
    parrent_id: getDomain.id,
    maladaptive: true,
    create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
    created_time: moment().tz(global.tz).format("HH:mm"),
    updated_date: moment().tz(global.tz).format("YYYY-MM-DD"),
  });

  return res.status(200).send(newMaladaptive);
};

module.exports = AddMaladaptive;
