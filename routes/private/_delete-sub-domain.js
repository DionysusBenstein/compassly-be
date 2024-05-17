const { DataBase } = require("../../controllers");

const DeleteSubDomain = async (req, res) => {
  const { id } = req.params;

  await new DataBase().delete("sub_domains", `id = '${id}'`);

  const skills = await new DataBase().custom(
    `SELECT id FROM skills WHERE parrent_id = '${id}'`,
    true
  );

  if (skills.length > 0) {
    let inQuery = ``,
      key = 1;

    for (const s of skills) {
      inQuery += `'${s.id}'${key < skills.length ? ", " : ""}`;
      key++;
    }
    await new DataBase().delete("dcm", `skill_id IN (${inQuery})`);
  }

  await new DataBase().delete("skills", `parrent_id = '${id}'`);

  return res.status(200).send({ status: "ok" });
};

module.exports = DeleteSubDomain;
