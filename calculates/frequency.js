const repair = require("jsonrepair");

const jp = (json) => {
  try {
    return JSON.parse(repair(json));
  } catch {
    return {};
  }
};
const summ = (partial_sum, a) => partial_sum + a;

const reduceTypeFrequency = async (first, last) => {
  const a = first
      .map((e) => Number(jp(e.stats_value)?.behavior?.right?.percentage) || 0)
      .reduce(summ, 0),
    b = last
      .map((e) => Number(jp(e.stats_value)?.behavior?.right?.percentage) || 0)
      .reduce(summ, 0),
    sd = a / first.length,
    ed = b / last.length;

  return {
    change: (sd / ed) * 100 - 100,
    positive: sd >= ed,
    symbol: "%",
  };
};

module.exports = { reduceTypeFrequency };
