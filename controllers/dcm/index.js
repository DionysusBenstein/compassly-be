const DataBase = require("../database"),
  repair = require("jsonrepair"),
  moment = require("moment-timezone");

const jp = (json) => {
  return JSON.parse(repair(json));
};

const getCurrentDate = () => {
  const date = new Date(),
    year = date.getFullYear(),
    month = date.getMonth(),
    day = date.getDate(),
    hour = moment().tz(global.tz).format("HH"),
    minute = moment().tz(global.tz).format("mm");

  return {
    day,
    month,
    year,
    hour,
    minute,
  };
};

class GetDCM {
  constructor(data) {
    this.data = data;
  }
  getSumByCurrentDay(arr) {
    let result = 0;
    const d = new Date();

    const filterArr = arr.filter(
      (x) =>
        x.year === d.getFullYear() &&
        x.month === d.getMonth() &&
        x.day === d.getDate()
    );

    for (const el of filterArr) {
      result += Number(el.time_data) || 0;
    }

    return { time: result, counts: filterArr.length, arr: filterArr };
  }
  async getDcmData(user_id) {
    const { client_id, skill_id } = this.data;

    if (!client_id && !skill_id && !action_type)
      return { code: 201, err: "not varid form data" };

    let dataValues = this.data;
    /** TO DO */
    dataValues.doctor_id = user_id;

    let queryLine = "",
      queryArray = [];

    let key = 1;

    const keys = Object.keys(this.data);

    const checkWeek = keys.find((x) => x === "week");

    if (checkWeek) {
      let weekDate = new Date();
      weekDate.setDate(weekDate.getDate() - Number(this.data["week"]));

      const startDay = weekDate.getDate();
      const endDay = new Date().getDate();

      const startMonth = weekDate.getMonth();
      const endMonth = new Date().getMonth();

      queryLine = `client_id = $1 and skill_id = $2 month >= $3 and month <= $4 and day >= $5 and day <= $6`;

      queryArray = [
        client_id,
        skill_id,
        startMonth,
        endMonth,
        startDay,
        endDay,
      ];
    } else {
      for (const el of keys) {
        queryLine += `${el} = $${key} ${
          key < Object.keys(this.data).length ? "AND " : ""
        }`;

        queryArray.push(this.data[el]);
        key++;
      }
    }

    const dataDcm = await new DataBase().select(
      "*",
      "dcm",
      queryLine + " ORDER BY createdate ASC",
      queryArray,
      true
    );

    if (!dataDcm) return { code: 201, err: "no data aviable" };

    const { time, counts, arr } = this.getSumByCurrentDay(dataDcm);

    let parseData = {
      center_time: time / counts,
      all_time: time,
      dcm_count: counts,
      dcm_array: dataDcm,
      dcm_current: arr,
    };

    if (dataDcm[0]) {
      const summ = (partial_sum, a) => Number(partial_sum) + Number(a);
      if (
        Number(dataDcm[0].action_type) === 3 ||
        Number(dataDcm[0].action_type) === 4
      ) {
        const neutral = dataDcm.map((d) => {
            const { behavior } = jp(d?.stats_value);

            return behavior.neutral.value || 0;
          }),
          wrong = dataDcm.map((d) => {
            const { behavior } = jp(d?.stats_value);

            return behavior.wrong.value || 0;
          }),
          right = dataDcm.map((d) => {
            const { behavior } = jp(d?.stats_value);

            return behavior.right.value || 0;
          });

        parseData.summ = {
          neutral: neutral.reduce(summ, 0),
          wrong: wrong.reduce(summ, 0),
          right: right.reduce(summ, 0),
        };
      }
      if (Number(dataDcm[0].action_type) === 5) {
        const positive = dataDcm.map((d) => {
          const { intervals } = jp(d?.stats_value);

          return intervals?.positive;
        });

        const negative = dataDcm.map((d) => {
          const { intervals } = jp(d?.stats_value);

          return intervals?.negative;
        });

        const currents = dataDcm
          .map((d) => {
            const { intervals } = jp(d?.stats_value);

            return intervals?.current;
          })
          .filter((x) => x === true);

        parseData.summ = {
          positive: positive,
          negative: negative,
          currents: currents.length,
        };
      }
    }

    return {
      status: 200,
      data: parseData,
    };
  }
}

class AddDCM {
  constructor(data) {
    this.data = data;
  }
  async addDcmData(user_id) {
    const {
      client_id,
      skill_id,
      action_type,
      time_data,
      stats_value = "",
    } = this.data;

    if (!client_id && !skill_id && !action_type && !time_data)
      return { status: 201, msg: "Error create DCM - not valide data" };

    const newDCM = {
      id: `dcm_${Date.now()}`,
      doctor_id: user_id,
      client_id,
      skill_id,
      time_data,
      action_type,
      stats_value: stats_value.toString(),
      ...getCurrentDate(),
    };

    const skill = await new DataBase().select(
      "*",
      "skills",
      "id = $1",
      [skill_id],
      false
    );

    const subdomain = await new DataBase().select(
      "*",
      "sub_domains",
      "id = $1",
      [skill?.parrent_id],
      false
    );

    await new DataBase().insert("dcm", newDCM);

    if (subdomain) {
      const newRate = subdomain.rate + 1;
      await new DataBase().update(
        "sub_domains",
        `rate = ${newRate}`,
        `id = '${skill?.parrent_id}'`
      );
    }

    return { status: 200, msg: "create DCM successfull" };
  }
}

module.exports = { GetDCM, AddDCM };
