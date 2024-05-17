// UpMalIcon
const { ParseForm } = require("../../beans"),
  { DataBase } = require("../../controllers");

const checkValideIcon = (base) => {
  if (base === "null") return false;

  return base.indexOf("image/svg+xml") === -1;
};

const UpdateIcon = async (req, res) => {
  const formData = await new ParseForm(req).parseForm();

  const _dom = await new DataBase().custom(
    `SELECT * FROM domains WHERE maladaptive = true`
  );

  if (checkValideIcon(formData.icon))
    return res.status(200).json({
      err: true,
      msg: "Error image validation, please upload SVG image!",
    });

  await new DataBase().update(
    "domains",
    `icon = ${formData.icon !== "null" ? `'${formData.icon}'` : null}`,
    `id = '${_dom.id}'`
  );

  return res.status(200).send({ msg: "Added successfully" });
};

module.exports = UpdateIcon;
