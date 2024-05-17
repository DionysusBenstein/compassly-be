const { DataBase } = require("../../controllers");
const moment = require("moment");

const ListDaily = async (req, res) => {
  const { client_id } = req.params,
    { start_date, end_date } = req.query;

  let _DATE = "";

  if (start_date && end_date)
    _DATE = `AND create_date between ${start_date} AND ${end_date}`;

  const dailys = await new DataBase().custom(
    ` SELECT * FROM daily_planner WHERE client_id = '${client_id}' ${_DATE}`,
    true
  );

  return res.status(200).json(dailys);
};

module.exports = ListDaily;
