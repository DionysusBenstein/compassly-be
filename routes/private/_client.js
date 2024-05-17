const { DataBase } = require("../../controllers"),
  moment = require("moment");

const GetClient = async (req, res) => {
  const { id } = req.params;

  const clients = await new DataBase().custom(
    `SELECT *
    FROM clients
    WHERE id = '${id}'`,
    false
  );

  if (!clients) return res.status(200).send(null);

  clients.birthday = moment(clients.birthday).format("YYYY-MM-DD");

  const clients_doctors = await new DataBase().custom(
    `SELECT *
    FROM clients_doctors
    WHERE client_id = '${id}'`,
    true
  );

  clients.doctors = clients_doctors.map((x) => x.doctor_id);

  return res.status(200).send(clients);
};

module.exports = GetClient;
