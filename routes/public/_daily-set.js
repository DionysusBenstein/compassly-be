const { DailyController } = require("../../controllers");

const DailySet = async (req, res) => {
  const { status, data } = await new DailyController(req, res).setDaily();

  return res.status(status).send(data);
};

module.exports = DailySet;
