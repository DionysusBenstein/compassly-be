const { DataBase } = require("../../controllers");

const DeleteBiometric = async (req, res) => {
  const { device_id } = req.params;

  if (!device_id)
    return res.status(201).json({ err: true, msg: "Invalid device ID!" });

  const bio_data = await new DataBase().select(
    "*",
    "biometric",
    "user_id = $1",
    [req.user_id]
  );

  if (bio_data) {
    await new DataBase().delete("biometric", `device_id = '${device_id}'`);

    res.status(201).json({
      err: false,
      msg: "Biometric successfully connected!",
    });
  } else
    return res.status(201).json({
      err: true,
      msg: "Biometric input is already connected on this device!",
    });
};

module.exports = DeleteBiometric;
