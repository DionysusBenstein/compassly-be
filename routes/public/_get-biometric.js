const { DataBase } = require("../../controllers");

const GetBiometric = async (req, res) => {
  const { device_id } = req.params;

  if (!device_id)
    return res.status(201).json({ err: true, msg: "Invalid device ID!" });

  const bio_data = await new DataBase().select(
    "*",
    "biometric",
    "device_id = $1",
    [device_id]
  );

  if (!bio_data) {
    return res.status(201).json({ err: true, msg: "Biometrics disconect!" });
  } else {
    return res
      .status(201)
      .json({ err: false, msg: "Biometrics is connected!" });
  }
};

module.exports = GetBiometric;
