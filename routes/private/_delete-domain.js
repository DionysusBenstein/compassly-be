const { DataBase } = require("../../controllers");

const DeleteClient = async (req, res) => {
  const { id } = req.params;

  await new DataBase().delete("domains", `id = '${id}'`);

  const sub_domains = await new DataBase().custom(
    `SELECT id FROM sub_domains WHERE parrent_id = '${id}'`,
    true
  );

  if (sub_domains.length > 0) {
    let inQuery = ``,
      key = 1;

    for (const sd of sub_domains) {
      inQuery += `'${sd.id}'${key < sub_domains.length ? ", " : ""}`;
      key++;
    }

    await new DataBase().delete("sub_domains", `parrent_id = '${id}'`);
    await new DataBase().delete("skills", `parrent_id IN (${inQuery})`);
  }

  /** TO DO */
  //   await new DataBase().delete("dcm", `skill_id = '${id}'`);
  await new DataBase().delete("client_domain", `domain_id = '${id}'`);

  return res.status(200).send({ status: "ok" });
};

module.exports = DeleteClient;
