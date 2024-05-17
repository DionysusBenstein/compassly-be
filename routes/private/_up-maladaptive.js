const { ParseForm } = require("../../beans");
const { DataBase } = require("../../controllers");

const AddMaladaptive = async (req, res) => {
  const { id } = req.params,
    formData = await new ParseForm(req).parseForm(),
    keys = Object.keys(formData);

  let queryLine = "",
    key = 1;

  for (const el of keys) {
    const isNum = el === "number";
    queryLine += `"${el}" = '${
      isNum ? formData[el].replace(/[^+\d]/g, "") : formData[el]
    }'${key < keys.length ? ", " : ""}`;
    key++;
  }

  await new DataBase().update("skills", queryLine, `id = '${id}'`);

  // await new DataBase().update(
  //   "skills",
  //   `title = '${formData.title}'`,
  //   `id = '${id}'`
  // );

  return res.status(200).send({ status: "ok" });
};

module.exports = AddMaladaptive;
