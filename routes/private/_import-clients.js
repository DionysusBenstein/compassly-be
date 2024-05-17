const { DataBase } = require("../../controllers"),
  { ParseForm } = require("../../beans"),
  moment = require("moment-timezone");

const ImportClients = async (req, res) => {
  const { data } = req.body,
    _dom = await new DataBase().custom(
      `SELECT * FROM domains WHERE maladaptive = true`
    );

  try {
    const _FD = data.filter((x) => x.length > 0);
    let err_arr = [];
    if (_FD.length < 1)
      return res.status(200).send({ err: true, msg: "Data is not valide" });

    for (const client of _FD) {
      const newClientId = `client_${Date.now()}_${Math.random()}`;

      await new DataBase().insert("clients", {
        id: newClientId,
        name: client[0] || "null",
        surname: client[1] || "null",
        sex: client[2] || "null",
        birthday: client[3] ? moment(client[3]).format("YYYY-MM-DD") : "null",
        email: client[4] || "null",
        number: client[5] ? `+${client[5]}` : "null",

        c_firstname: client[6] || "null",
        c_lastname: client[7] || "null",
        c_email: client[8] || "null",
        c_phone: client[9] ? `+${client[9]}` : "null",

        serevice_location: client[10] || "null",
        street_address: client[11] || "null",
        city: client[12] || "null",
        state: client[13] || "null",
        zip_code: client[14] || "null",

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

      err_arr.push(["Add successfull", ...client]);
    }

    return res.status(200).send({ err: null, data: _FD, results: err_arr });
  } catch (e) {
    return res.status(200).send({ err: true, msg: e });
  }
};

module.exports = ImportClients;
