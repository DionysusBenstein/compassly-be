const { ParseForm } = require("../../beans");
const DataBase = require("../database");
const moment = require("moment");
/*
 1 - 24h
 2 - 7 days
 3 - 1 month
 4 - 3 month
 5 - 6 month
 6 - 1 year
 7 - all
*/

class DailyController {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }
  parseDate() {
    const date = new Date();

    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
    };
  }
  async getDaily() {
    const { client_id = null, day, month, year } = this.req.body;

    if (!client_id)
      return {
        status: 200,
        data: { err: true, msg: "Client id is not valid!" },
      };

    const daily = await new DataBase().select(
      "*",
      "daily_planner",
      "client_id = $1 and day = $2 and month = $3 and year = $4",
      [client_id, day, month, year]
    );

    if (!daily)
      return {
        status: 200,
        data: null,
      };

    const _FL = await new DataBase().select(
      "daily_feeling.value",
      "daily_feeling",
      "daily_id = $1",
      [daily.id],
      true
    );
    daily.feeling = _FL.map((x) => x.value);

    return {
      status: 200,
      data: daily,
    };
  }
  async setDaily() {
    const data = this.req.body;

    console.log(data);

    const { client_id = null } = data,
      { year, month, day } = this.parseDate();

    const checkDaily = await new DataBase().select(
      "*",
      "daily_planner",
      "client_id = $1 and day = $2 and month = $3 and year = $4",
      [client_id, day, month, year]
    );

    if (checkDaily) {
      let pData = data,
        _feeling = data.feeling;

      delete pData.client_id;
      delete pData.feeling;
      const keys = Object.keys(pData);

      let queryLine = "",
        key = 1;

      for (const el of keys) {
        queryLine += `"${el}" = '${pData[el]}' ${
          key < keys.length ? ", " : ""
        }`;
        key++;
      }

      await new DataBase().update(
        "daily_planner",
        queryLine,
        `client_id = '${client_id}' and day = '${day}' and month = '${month}' and year = '${year}'`
      );

      await new DataBase().delete(
        "daily_feeling",
        `daily_id = '${checkDaily.id}'`
      );

      for (const fel of _feeling) {
        await new DataBase().insert("daily_feeling", {
          daily_id: checkDaily.id,
          value: fel,
        });
      }
    } else {
      const _DID = `daily_${Date.now()}_${Math.random()}`;
      await new DataBase().delete("daily_feeling", `daily_id = '${_DID}'`);

      for (const fel of data?.feeling) {
        await new DataBase().insert("daily_feeling", {
          daily_id: _DID,
          value: fel,
        });
      }
      //insert
      const newDaily = {
        ...data,
        id: _DID,
        doctor_id: this.req.user_id,
        create_date: moment().format("YYYY-MM-DD"),
        year: Number(year),
        month: Number(month),
        day: Number(day),
      };

      delete newDaily?.feeling;

      await new DataBase().insert("daily_planner", newDaily);
    }

    return {
      status: 201,
      data: {
        msg: "Save successfull",
      },
    };
  }
}

module.exports = { DailyController };
