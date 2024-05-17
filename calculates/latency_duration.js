const summ = (partial_sum, a) => partial_sum + a;

const reduceTypeDurationAndLatency = async (first, last) => {
  const a = first.map((e) => Number(e.time_data) || 0).reduce(summ, 0), //Первый промежуток
    b = last.map((e) => Number(e.time_data) || 0).reduce(summ, 0), //Последний промежуток
    sd = a / first.length,
    ed = b / last.length;

  return {
    change: (sd / ed) * 100 - 100, //Среднее время
    positive: sd >= ed,
    symbol: "%",
  };
};

module.exports = { reduceTypeDurationAndLatency };
