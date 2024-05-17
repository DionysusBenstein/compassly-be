const { DataBase } = require("../../controllers");

const GetCalendar = async (req, res) => {
  const { date, client_id } = req.params;

  const calendar = await new DataBase().custom(
    `SELECT * FROM calendar WHERE client_id = '${client_id}' and CAST(startdate AS DATE) = '${date}'`,
    true
  );

  return res.status(200).send({ err: false, data: calendar });
};

module.exports = GetCalendar;
