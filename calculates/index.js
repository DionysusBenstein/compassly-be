const { reduceTypeDurationAndLatency } = require("./latency_duration");
const { reduceTypeFrequency } = require("./frequency");
const { reduceTypeRate } = require("./rate");
const { reduceTypeIntervals } = require("./intervals");
const { getSort } = require("./sort");

module.exports = {
  reduceTypeDurationAndLatency,
  reduceTypeFrequency,
  reduceTypeRate,
  reduceTypeIntervals,
  getSort,
};
