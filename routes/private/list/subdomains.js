const { DataBase } = require("../../../controllers");

const getSubDomains = async (req, res) => {
  const {
    page = null,
    parrent_id = null,
    id = null,
    search = null,
    list_value = 20,
  } = req.query;

  const _domains = await new DataBase().custom(
    `SELECT * FROM sub_domains WHERE maladaptive = false ${
      parrent_id ? `AND parrent_id = '${parrent_id}'` : ""
    } ${id ? `AND id = '${id}'` : ""} ${
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
};

module.exports = { getSubDomains };
