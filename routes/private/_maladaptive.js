const { DataBase } = require("../../controllers");

const GetData = async (req, res) => {
  const { page = null, list_value = 20 } = req.query;

  const _dom = await new DataBase().custom(
    `SELECT * FROM domains WHERE maladaptive = true`
  );

  const list = await new DataBase().custom(
    `SELECT * FROM skills WHERE parrent_id = '${_dom.id}'`,
    true
  );

  if (page) {
    const toData = list_value * page - list_value;
    const doData = list_value * page;

    const resultsArr = list.slice(toData, doData);

    return res
      .status(200)
      .send({ list: resultsArr, counts: list.length, maladaptive_data: _dom });
  }

  return res
    .status(200)
    .send({ list, counts: list.length, maladaptive_data: _dom });
};

module.exports = GetData;
