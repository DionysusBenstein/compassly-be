const { History } = require("../../controllers");

const HistoryData = async (req, res) => {
  const { client_id, year, month, day } = req.params,
    {
      validationClient,
      validationDate,
      getClient,
      getUser,
      getDCMData,
      formatRequest,
    } = new History(req, res);

  const a = await validationClient(client_id),
    b = await validationDate(client_id);

  if (a) res.status(a.status).send(a.data);
  if (b) res.status(b.status).send(b.data);

  const dcm = await getDCMData(client_id, day, month, year);
  
  const { status, data } = await formatRequest({
    client: await getClient(client_id),
    user: await getUser(req.user_id),
    dcm,
  });

  res.status(status).json(data);
};

module.exports = HistoryData;
