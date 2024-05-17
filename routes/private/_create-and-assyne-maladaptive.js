const { ParseForm } = require("../../beans"),
  moment = require("moment-timezone"),
  { DataBase } = require("../../controllers");

const NewProgramClient = async (req, res) => {
  const { title, description, client_id, action_type, sub_type } =
    await new ParseForm(req).parseForm();

  const getDomain = await new DataBase().custom(
    `SELECT * FROM domains WHERE maladaptive = true`
  );

  if (Number(action_type) === 5) {
    if (!sub_type || sub_type === "")
      return res
        .status(201)
        .json({ err: true, msg: "Error Intervals type value" });
  }

  const newMaladaptive = await new DataBase().insert("skills", {
    id: `maladaptive_${Date.now()}_${Math.random()}`,
    title: title,
    description: description,
    parrent_id: getDomain.id,
    maladaptive: true,
    action_type: action_type,
    sub_type: sub_type,
    create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
    created_time: moment().tz(global.tz).format("HH:mm"),
    updated_date: moment().tz(global.tz).format("YYYY-MM-DD"),
  });

  await new DataBase().insert("client_maladaptives", {
    id: `${Date.now()}_${Math.random()}`,
    client_id: client_id,
    skill_id: newMaladaptive.id,
    create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
    created_time: moment().tz(global.tz).format("HH:mm"),
    updated_date: moment().tz(global.tz).format("YYYY-MM-DD"),
  });

  return res.status(200).send({ msg: "Added maladaptive successfully" });
};

module.exports = NewProgramClient;
