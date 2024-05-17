const { DataBase } = require("../../controllers"),
  AdmZip = require("adm-zip"),
  fs = require("fs"),
  path = require("path");
const { API_URL } = process.env;

const GetDomainIcons = async (req, res) => {
  const _ICONS = await new DataBase().custom(
    `SELECT domains.icon FROM domains`,
    true
  );

  const _RS_ICONS = _ICONS.filter((x) => x.icon !== null).map((e) => e.icon);

  var zip = new AdmZip();

  for (let i = 0; i < _RS_ICONS.length; i++) {
    const svg = Buffer.from(
      _RS_ICONS[i].split("base64,")[1],
      "base64"
    ).toString("binary");

    zip.addFile(i + ".svg", Buffer.alloc(svg.length, svg), "dump");
  }

  zip.writeZip(path.join(__dirname, `../../assets/backups/icons.zip`));

  return res.status(200).send(`${API_URL}/backups/icons.zip`);
};

module.exports = GetDomainIcons;
