const { ParseForm } = require("../../beans"),
  moment = require("moment-timezone"),
  { DataBase } = require("../../controllers");

const NewProgramClient = async (req, res) => {
  const {
    id,
    title,
    updated_date,
    description,
    parrent_id,
    client_id,
    domain_id,
    action_type,
    sub_type,
  } = await new ParseForm(req).parseForm();

  if (!parrent_id)
    return res
      .status(201)
      .json({ err: true, msg: "Subdomain is not selected" });

  const _DATA = {
    id: `${Date.now()}_${Math.random()}`,
    domain_id: domain_id,
    client_id: client_id,
    create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
    created_time: moment().tz(global.tz).format("HH:mm"),
    updated_date: moment().tz(global.tz).format("YYYY-MM-DD"),
  };

  await new DataBase().insert("client_domain", _DATA);

  const newSkill = {
    id,
    updated_date,
    description,
    title: title,
    parrent_id: parrent_id,
    action_type: action_type,
    sub_type: sub_type,
    create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
    created_time: moment().tz(global.tz).format("HH:mm"),
    updated_date: moment().tz(global.tz).format("YYYY-MM-DD"),
  };

  await new DataBase().insert("skills", newSkill);

  await new DataBase().insert("client_skills", {
    id: `config_${Date.now()}_${Math.random()}`,
    skill_id: newSkill.id,
    client_id: client_id,
    active: true,
  });

  return res.status(200).send({ msg: "Added program successfully" });
};

module.exports = NewProgramClient;
