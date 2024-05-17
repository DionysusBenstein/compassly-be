const { DataBase } = require("../../controllers");

const parseDate = () => {
  const date = new Date();

  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
};

const GeneratePdf = async (req, res) => {
  const { client_id = null } = req.params,
    { year: YYYY, month: MM, day: DD } = parseDate(),
    { daily_id = null, year = YYYY, month = MM, day = DD } = req.query;

  if (!client_id) return null;

  if (daily_id) {
    const checkDaily = await new DataBase().custom(
      `SELECT * FROM daily_planner WHERE id = '${daily_id}'`
    );

    const _FL = await new DataBase().select(
      "daily_feeling.value",
      "daily_feeling",
      "daily_id = $1",
      [daily_id],
      true
    );
    // checkDaily.feeling = _FL.map((x) => x.value.replace(/\s/g, ""));

    checkDaily.feeling = _FL.map((x) => {
      return {
        value: x.value.replace(/\s/g, ""),
        title: x.value,
      };
    });

    return {
      pdf_name: client_id,
      ...checkDaily,
    };
  } else {
    const checkDaily = await new DataBase().select(
      "*",
      "daily_planner",
      "client_id = $1 and day = $2 and month = $3 and year = $4",
      [client_id, day, month, year]
    );

    const _FL = await new DataBase().select(
      "daily_feeling.value",
      "daily_feeling",
      "daily_id = $1",
      [checkDaily.id],
      true
    );
    // checkDaily.feeling = _FL.map((x) => x.value.replace(/\s/g, ""));

    checkDaily.feeling = _FL.map((x) => {
      return {
        value: x.value.replace(/\s/g, ""),
        title: x.value,
      };
    });

    return {
      pdf_name: client_id,
      ...checkDaily,
    };
  }
};

module.exports = { GeneratePdf };
