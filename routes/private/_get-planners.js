const { DataBase } = require("../../controllers");

const GetPlanners = async (req, res) => {
  const { page = null, list_value = 5 } = req.query,
    { client_id } = req.params;

  const _QUERY = `SELECT daily.* 
  FROM (SELECT daily_planner.*, row_to_json(users.*) as doctor_data 
  FROM daily_planner 
  LEFT JOIN users ON users.id = daily_planner.doctor_id 
  WHERE client_id = '${client_id}') AS daily`;

  const _planners = await new DataBase().custom(_QUERY, true),
    counts = _planners.length;

  if (page) {
    const toData = list_value * page - list_value;
    const doData = list_value * page;

    const resultsArr = _planners.slice(toData, doData);

    return res.status(200).send({ list: resultsArr, counts: Number(counts) });
  }

  return res.status(200).send({ list: _planners, counts: Number(counts) });
};

module.exports = GetPlanners;
