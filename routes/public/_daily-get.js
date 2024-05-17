const { DailyController } = require("../../controllers");

const DailyGet = async (req, res) => {
  const { status, data } = await new DailyController(req, res).getDaily();

  res.status(status).send(data);
};

module.exports = DailyGet;
