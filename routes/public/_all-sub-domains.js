const { getSort } = require("../../calculates");
const { DataBase } = require("../../controllers"),
  { ParseForm } = require("../../beans");

const SubDomains = async (req, res) => {
  const { client_id } = await new ParseForm(req).parseForm();
  const { field, sort } = req.params;

  if (!client_id)
    return res.status(200).send({ err: true, msg: "Client id is not valide" });

  const data = await new DataBase().custom(
      `SELECT * FROM client_domain INNER JOIN domains ON domains.id = client_domain.domain_id WHERE client_id = '${client_id}'`,
      true
    ),
    result = data?.map((el) => el.domain_id) || [];

  let resDataArr = [];

  for (let element of result) {
    const subData = await new DataBase().custom(
      `SELECT * FROM sub_domains WHERE parrent_id = '${element}' ${getSort(
        field,
        sort,
        ", maladaptive ASC"
      )}`,
      true
    );
    resDataArr.push(subData);
  }

  res.status(200).send({ data: resDataArr, counts: resDataArr.length });
};

module.exports = SubDomains;
