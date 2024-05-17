const {
  reduceTypeDurationAndLatency,
  reduceTypeFrequency,
  reduceTypeRate,
  reduceTypeIntervals,
} = require("../calculates");
const summ = (partial_sum, a) => Number(partial_sum) + Number(a);
const repair = require("jsonrepair");

const jp = (json) => {
  return JSON.parse(repair(json));
};
//1 - Latency
//2 - Duration
//3 - Freacuncy
//4 - Rate
//5 - Intervals

class Percent {
  async getPercentTargetSkill(
    result = [],
    action_type,
    skill_id,
    client_id,
    attempts_count
  ) {
    const firstData = result.slice(0, 5);
    const lastData = result.slice(-5);
    //Duration and Latency
    if (Number(action_type) === 1 || Number(action_type) === 2) {
      const a = firstData.map((e) => Number(e.time_data) || 0).reduce(summ, 0),
        b = lastData.map((e) => Number(e.time_data) || 0).reduce(summ, 0),
        sd = a,
        ed = b;

      return { value: (ed / sd) * 100 - 100, symbol: "%" };
    }

    //3 - Freacuncy
    if (Number(action_type) === 3) {
      const start = firstData
        .map((e) => Number(jp(e.stats_value)?.behavior?.right?.percentage) || 0)
        .reduce(summ, 0);

      const end = lastData
        .map((e) => Number(jp(e.stats_value)?.behavior?.right?.percentage) || 0)
        .reduce(summ, 0);

      return { value: (end / start) * 100 - 100, symbol: "%" };
    }
    // Rate
    if (Number(action_type) === 4) {
      const start = firstData
        .map((e) => Number(jp(e.stats_value)?.behavior?.right?.rate) || 0)
        .reduce(summ, 0);

      const end = lastData
        .map((e) => Number(jp(e.stats_value)?.behavior?.right?.rate) || 0)
        .reduce(summ, 0);

      return { value: (end / start) * 100 - 100, symbol: "%" };
    }
    //Intervals
    if (Number(action_type) === 5) {
      const startData = firstData
        .map((e) => Number(jp(e.stats_value)?.intervals?.positive) || 0)
        .reduce(summ, 0);

      const endData = lastData
        .map((e) => Number(jp(e.stats_value)?.intervals?.positive) || 0)
        .reduce(summ, 0);

      const start = startData / attempts_count;
      const end = endData / attempts_count;

      return { value: (end / start) * 100 - 100, symbol: "%" };
    }

    return { value: 0, symbol: "" };
  }
  async getCenterData(first, last, type) {
    //Duration And Latency
    if (Number(type) === 1 || Number(type) === 2) {
      const result = await reduceTypeDurationAndLatency(first, last);
      return result;
    }
    //Frequency
    if (Number(type) === 3) {
      const result = await reduceTypeFrequency(first, last);
      return result;
    }
    //Rate
    if (Number(type) === 4) {
      const result = await reduceTypeRate(first, last);
      return result;
    }
    //Intervals
    if (Number(type) === 5) {
      const result = await reduceTypeIntervals(first, last);
      return result;
    }

    // return error data
    return { err: true, msg: "Graph error from not valide skill type aviable" };
  }
  async getAverageTime(data) {
    return data.map((e) => Number(e.time_data) || 0).reduce(summ, 0);
  }
  async getCenterTime(data) {
    return (
      data.map((e) => Number(e.time_data) || 0).reduce(summ, 0) / data.length
    );
  }

  async centerDataDCM(data) {
    if (
      Number(data[0].action_type) === 3 ||
      Number(data[0].action_type) === 4
    ) {
      const neutral = data.map((d) => {
          const { behavior = null } = jp(d?.stats_value || "{}");

          return behavior?.neutral?.value || 0;
        }),
        wrong = data.map((d) => {
          const { behavior = null } = jp(d?.stats_value || "{}");

          return behavior?.wrong?.value || 0;
        }),
        right = data.map((d) => {
          const { behavior = null } = jp(d?.stats_value || "{}");

          return behavior?.right?.value || 0;
        });

      return {
        neutral: neutral.reduce(summ, 0) || 0,
        wrong: wrong.reduce(summ, 0) || 0,
        right: right.reduce(summ, 0) || 0,
      };
    }
    if (Number(data[0].action_type) === 5) {
      const positive = data.map((d) => {
        const { intervals = null } = jp(d?.stats_value || "{}");

        return intervals?.positive;
      });

      const negative = data.map((d) => {
        const { intervals = null } = jp(d?.stats_value || "{}");

        return intervals?.negative;
      });

      const currents = data
        .map((d) => {
          const { intervals = null } = jp(d?.stats_value || "{}");

          return intervals?.current;
        })
        .filter((x) => x === true);

      return {
        positive: positive,
        negative: negative,
        currents: currents.length,
      };
    }
  }
}

module.exports = { Percent };
