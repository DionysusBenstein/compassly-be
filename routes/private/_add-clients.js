const { ParseForm } = require("../../beans"),
  moment = require("moment-timezone"),
  { DataBase } = require("../../controllers");

const CreateClient = async (req, res) => {
  const formData = await new ParseForm(req).parseForm(),
    doctorsList = formData.doctors.split(","),
    _dom = await new DataBase().custom(
      `SELECT * FROM domains WHERE maladaptive = true`
    );

  formData.number = formData.number.replace(/[^+\d]/g, "");
  if (formData.c_phone)
    formData.c_phone = formData.c_phone.replace(/[^+\d]/g, "");

  delete formData.doctors;

  const newClientId = `client_${Date.now()}_${Math.random()}`;

  await new DataBase().insert("clients", {
    ...formData,
    id: newClientId,
    updated_date: moment().tz(global.tz).format("YYYY-MM-DD"),
    create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
    created_time: moment().tz(global.tz).format("HH:mm"),
  });

  const _DATA = {
    id: `${Date.now()}_${Math.random()}`,
    client_id: newClientId,
    domain_id: _dom.id,
    create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
    created_time: moment().tz(global.tz).format("HH:mm"),
    updated_date: moment().tz(global.tz).format("YYYY-MM-DD"),
  };

  await new DataBase().insert("client_domain", _DATA);

  for (const doctor_id of doctorsList) {
    await new DataBase().insert("clients_doctors", {
      doctor_id: doctor_id,
      client_id: newClientId,
      create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
      created_time: moment().tz(global.tz).format("HH:mm"),
    });
  }

  return res.status(200).send({ msg: "Added client successfully" });
};

module.exports = CreateClient;
