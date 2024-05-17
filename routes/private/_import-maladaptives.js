const { DataBase } = require("../../controllers"),
  { ParseForm } = require("../../beans"),
  moment = require("moment-timezone");

const parseType = (type) => {
  if (type === "Latency") return 1;
  if (type === "Duration") return 2;
  if (type === "Frequency") return 3;
  if (type === "Rate") return 4;
  if (type === "Interval") return 5;
};

const ImportMaladaptives = async (req, res) => {
  const { data } = req.body;
  const _dom = await new DataBase().custom(
    `SELECT * FROM domains WHERE maladaptive = true`
  );

  try {
    const _FD = data.filter((x) => x.length > 0);

    let err_arr = [];
    if (_FD.length < 1)
      return res.status(200).send({ err: true, msg: "Data is not valide" });

    for (const mal of _FD) {
      const newSkill = {
        id: `maladaptive_${Date.now()}_${Math.random()}`,
        parrent_id: _dom.id,
        action_type: parseType(mal[1]),
        sub_type: mal[2],
        title: mal[0],
        maladaptive: true,
        updated_date: moment().tz(global.tz).format("YYYY-MM-DD"),
        create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
        created_time: moment().tz(global.tz).format("HH:mm"),
      };
      await new DataBase().insert("skills", newSkill);

      err_arr.push(["Add successfull", ...mal]);
    }

    return res.status(200).send({ err: null, data: _FD, results: err_arr });
  } catch (e) {
    return res.status(200).send({ err: true, msg: e });
  }
};

module.exports = ImportMaladaptives;
