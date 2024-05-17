const { ParseForm, parseValue } = require("../../beans"),
  { DataBase } = require("../../controllers"),
  moment = require("moment-timezone");

const UpdateClient = async (req, res) => {
  const { id } = req.params,
    formData = await new ParseForm(req).parseForm();

  formData.number = formData.number.replace(/[^+\d]/g, "");
  if (formData.c_phone)
    formData.c_phone = formData.c_phone.replace(/[^+\d]/g, "");

  const doctorsList = formData.doctors.split(",");

  delete formData.doctors;
  formData.updated_date = moment().format("YYYY-MM-DD");
  const keys = Object.keys(formData);

  let queryLine = "",
    key = 1;

  for (const el of keys) {
    queryLine += `"${el}" = '${parseValue(formData[el])}'${
      key < keys.length ? ", " : ""
    }`;
    key++;
  }

  await new DataBase().update("clients", queryLine, `id = '${id}'`);
  //update doctors data
  await new DataBase().delete("clients_doctors", `client_id = '${id}'`);

  for (const doctor_id of doctorsList) {
    await new DataBase().insert("clients_doctors", {
      doctor_id: doctor_id,
      client_id: id,
      create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
      created_time: moment().tz(global.tz).format("HH:mm"),
    });
  }

  return res.status(200).send({ msg: "Updated client successfully" });
};

module.exports = UpdateClient;
