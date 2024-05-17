const { DataBase } = require("../../controllers");

const SetBiometric = async (req, res) => {
  const { device_id } = req.params;

  if (!device_id)
    return res.status(201).json({ err: true, msg: "Invalid device ID!" });

  const bio_data = await new DataBase().select(
    "*",
    "biometric",
    "user_id = $1",
    [req.user_id]
  );

  if (!bio_data) {
    await new DataBase().insert("biometric", {
      user_id: req.user_id,
      device_id: device_id,
      enabled: true,
    });

    res.status(201).json({
      err: false,
      msg: "Biometric successfully connected!",
    });
  } else {
    await new DataBase().update(
      "biometric",
      `device_id = '${device_id}'`,
      `user_id = '${req.user_id}'`
    );
    return res.status(201).json({
      err: false,
      msg: "Biometric successfully updated!",
    });
  }
};

module.exports = SetBiometric;
