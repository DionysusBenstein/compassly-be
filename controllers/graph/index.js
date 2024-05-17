const DataBase = require("../database"),
  { Percent } = require("../../beans"),
  moment = require("moment-timezone"),
  repair = require("jsonrepair");

const jp = (json) => {
  return JSON.parse(repair(json));
};

class GraphController {
  constructor(skill_id, client_id, filter) {
    this.skill_id = skill_id;
    this.client_id = client_id;
    this.filter = filter;
  }
  parseDate() {
    const date = new Date();

    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
    };
  }
  getMaxValues(arr, type) {
    //latency - duration
    if (type === 1 || type === 2) {
      const resArray = Object.values(arr).map((date) => {
        return date.original.map((el) => el.time_data);
      });

      return {
        time: Math.max.apply(null, resArray.flat()),
      };
    }

    // Frequency / Rate
    if (type === 3 || type === 4) {
      const resArray = Object.values(arr).map((date) => {
        return date.original.map((el) => jp(el.stats_value));
      });

      const a = resArray.flat().map((el) => el.behavior);

      return {
        right: Math.max.apply(
          null,
          a.map((el) =>
            type === 3
              ? Number(el?.right?.percentage || 0)
              : Number(el?.right?.rate || 0)
          )
        ),
        neutral: Math.max.apply(
          null,
          a.map((el) =>
            type === 3
              ? Number(el.neutral.percentage || 0)
              : Number(el.neutral.rate || 0)
          )
        ),
        wrong: Math.max.apply(
          null,
          a.map((el) =>
            type === 3
              ? Number(el.wrong.percentage || 0)
              : Number(el.wrong.rate || 0)
          )
        ),
      };
    }

    // Intervals
    if (type === 5) {
      const resArray = Object.values(arr).map((date) => {
          return date.original.map((el) => jp(el.stats_value));
        }),
        a = resArray.flat().map((el) => el.intervals);

      return {
        resArray: a,
        percent: 0,
      };
    }

    return {};
  }
  async filterGraph() {
    //24h / 7d / 14d / 1m / 3m / 6m / all
    const { year, month, day, hour, minute } = this.parseDate();

    let parseDate, date_pp;

    switch (this.filter) {
      case "24h":
        parseDate = moment().tz(global.tz).format("YYYY-MM-DD");
        break;
      case "7d":
        parseDate = moment()
          .tz(global.tz)
          .subtract(7, "days")
          .format("YYYY-MM-DD");
        break;
      case "14d":
        parseDate = moment()
          .tz(global.tz)
          .subtract(14, "days")
          .format("YYYY-MM-DD");
        break;
      case "1m":
        parseDate = moment()
          .tz(global.tz)
          .subtract(1, "months")
          .format("YYYY-MM-DD");
        break;
      case "3m":
        parseDate = moment()
          .tz(global.tz)
          .subtract(3, "months")
          .format("YYYY-MM-DD");
        break;
      case "6m":
        parseDate = moment()
          .tz(global.tz)
          .subtract(6, "months")
          .format("YYYY-MM-DD");
        break;
    }

    if (this.filter !== "24h") {
      date_pp = new Date(parseDate);
    }

    const currentDate = `'${year}-${month < 10 ? `0${month}` : month}-${day}'`;

    const parseDateDays = () => {
      const d_y = date_pp.getFullYear();
      const d_m = date_pp.getMonth() + 1;
      const d_d = date_pp.getDate();

      return `'${d_y}-${d_m < 10 ? `0${d_m}` : d_m}-${d_d}'`;
    };

    switch (this.filter) {
      case "24h":
        return `and createdate = ${currentDate}`;
      case "7d":
        return `and createdate between ${parseDateDays()} and ${currentDate}`;
      case "14d":
        return `and createdate between ${parseDateDays()} and ${currentDate}`;
      case "1m":
        return `and createdate between ${parseDateDays()} and ${currentDate}`;
      case "3m":
        return `and createdate between ${parseDateDays()} and ${currentDate}`;
      case "6m":
        return `and createdate between ${parseDateDays()} and ${currentDate}`;
      default:
        return "";
    }
  }
  async getGraph(a = null, doctor_id = null) {
    if (!this.skill_id && !this.client_id)
      return {
        status: 200,
        data: {
          err: true,
          msg: "Skill od Client id is not valid!",
          result: 0,
        },
      };

    let parseFilter = null;

    if (a) {
      parseFilter = `and createdate between '${a.start}' and '${a.end}'`;
    } else {
      parseFilter = await this.filterGraph();
    }
    const skill = await new DataBase().custom(
      `SELECT skills.*, 
        COALESCE (
          NULLIF (skill_custom_type.custom_type, ''),
          LEFT (skills.action_type, 40)
        ) as action_type 
        FROM skills 
        LEFT JOIN skill_custom_type ON skill_custom_type.skill_id = skills.id 
        WHERE skills.id = '${this.skill_id}' AND skill_custom_type.user_id = '${this.client_id}' `,
      false
    );
    const query = `SELECT * FROM dcm WHERE skill_id = '${
      this.skill_id
    }' AND client_id = '${this.client_id}' ${
      doctor_id ? `AND doctor_id = '${doctor_id}'` : ""
    } ${parseFilter} ORDER BY createdate ASC`;

    const data = await new DataBase().custom(query, true),
      actionType = Number(skill?.action_type);
    //Check data counts
    if (data.length === 0)
      return {
        status: 200,
        data: {
          skill_test: skill,
          action_type: actionType,
          result: 0,
        },
      };

    // Var data array from requst
    let dataArray = {};

    for (let d of data) {
      const date = `${d.day}.${d.month}.${d.year}`;

      if (!dataArray[date]) dataArray[date] = { original: [], center_time: 0 };

      dataArray[date].original.push(d);
    }

    const dateArr = Object.keys(dataArray);

    if (dateArr.length > 0) {
      for (const d of dateArr) {
        const center_time = await new Percent().getCenterData(
          dataArray[dateArr[0]]?.original, //first array
          dataArray[d]?.original, //last array dateArr[dateArr.length - 1]
          actionType
        );

        const average_time = await new Percent().getAverageTime(
          dataArray[d].original
        );

        const center_time_data = await new Percent().getCenterTime(
          dataArray[d]?.original
        );

        const center_data_dcm = await new Percent().centerDataDCM(
          dataArray[d]?.original
        );

        dataArray[d].center_time = center_time;
        dataArray[d].average_time = average_time;

        dataArray[d].center_time_data = center_time_data;
        dataArray[d].center_data_dcm = center_data_dcm;
      }
    }

    const percentsData = Object.values(dataArray)[0]?.original.map((a) =>
      Number(a?.time_data)
    );

    const max_data = this.getMaxValues(dataArray, actionType);

    return {
      status: 200,
      data: {
        skill_test: skill,
        action_type: actionType,
        max: max_data,
        max_value: Math.max.apply(null, percentsData),
        min_value: Math.min.apply(null, percentsData),
        result: dataArray,
      },
    };
  }
}

module.exports = { GraphController };
