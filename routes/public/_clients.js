const { DataBase } = require("../../controllers");

const Clients = async (req, res) => {
  const data = await new DataBase().custom(
      `SELECT *, clients.id as client_id FROM clients INNER JOIN clients_doctors ON clients_doctors.client_id = clients.id WHERE clients_doctors.doctor_id = '${req.user_id}' AND clients.active = true`,
      true
    ),
    result = data || [];

  res.status(200).send({ data: result, counts: result.length });
};

module.exports = Clients;
