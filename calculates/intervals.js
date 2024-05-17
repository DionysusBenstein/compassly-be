const repair = require("jsonrepair");

const jp = (json) => {
  return JSON.parse(repair(json));
};
const summ = (partial_sum, a) => partial_sum + a;

const reduceTypeIntervals = async (first, last) => {
  const a = first
      .map((e) => Number(jp(e.stats_value)?.intervals?.positive) || 0)
      .reduce(summ, 0),
    b = last
      .map((e) => Number(jp(e.stats_value)?.intervals?.positive) || 0)
      .reduce(summ, 0),
    sd = a / first.length,
    ed = b / last.length;

  return { change: (sd / ed) * 100 - 100, positive: sd >= ed, symbol: "" };
};

module.exports = { reduceTypeIntervals };
