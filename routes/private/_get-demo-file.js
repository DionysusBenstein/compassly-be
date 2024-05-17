const fs = require("fs"),
  path = require("path");

const GetDemoFile = async (req, res) => {
  const { type } = req.params;

  const fileURL = path.join(__dirname, "../../", `assets/demo/${type}.xlsx`);

  return res.sendFile(fileURL);
};

module.exports = GetDemoFile;
