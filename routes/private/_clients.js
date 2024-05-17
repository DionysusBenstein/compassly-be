const { DataBase } = require("../../controllers");

const parseDoctors = async (doctor) => {
    if (doctor) {
      return doctor.split(",");
    } else {
      const queryDoctors = await new DataBase().custom(
        `SELECT users.id, users.name, users.surname
          FROM users
          INNER JOIN user_groups ON user_groups.id = users.group
          WHERE user_groups.level = 1 OR user_groups.level = 2`,
        true
      );

      return queryDoctors.map((x) => x.id);
    }
  },
  GetClients = async (req, res) => {
    const { doctor_id } = req.params;

    const doctorsList = await parseDoctors(doctor_id);

    let inQuery = ``;
    let key = 1;

    for (const d of doctorsList) {
      inQuery += `'${d}'${key < doctorsList.length ? ", " : ""}`;
      key++;
    }

    //set clients
    const clients = await new DataBase().custom(
      `SELECT DISTINCT ON (clients.id) *, clients.* FROM clients_doctors INNER JOIN clients ON clients.id = clients_doctors.client_id WHERE clients_doctors.doctor_id IN (${inQuery})`,
      true
    );

    return res.status(200).send(clients);
  };

module.exports = GetClients;
