const { DataBase } = require("../../../controllers");

const getDomains = async (req, res) => {
  const { page = null, search = null, list_value = 20 } = req.query;
  const _domains = await new DataBase().custom(
    `SELECT * FROM domains WHERE maladaptive = false ${
      search ? `AND title ilike '%${search}%'` : ""
    }`,
    true
  );

  if (page) {
    const toData = list_value * page - list_value;
    const doData = list_value * page;

    const resultsArr = _domains.slice(toData, doData);

    return res.status(200).send({ list: resultsArr, counts: _domains.length });
  }

  return res.status(200).send({ list: _domains, counts: _domains.length });

  // return res.status(200).send({ list, counts: Number(counts.count) });
};

module.exports = { getDomains };
