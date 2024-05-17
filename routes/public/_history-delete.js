const { History } = require("../../controllers");

const HistoryDelete = async (req, res) => {
  const { dcm_id } = req.params,
    { deleteHistory } = new History(req, res);

  const { status, data } = await deleteHistory(dcm_id);

  res.status(status).json(data);
};

module.exports = HistoryDelete;
