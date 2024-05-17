const summ = (partial_sum, a) => Number(partial_sum) + Number(a);
const formatAMPM = (hours, minutes) => {
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};
const startTime = (obj) => {
  let date = new Date(obj.createdate);
  date.setHours(obj.hour);
  date.setMinutes(obj.minute);

  const secondToTimeStamp = Number(obj.time_data) * 1000;

  date.setTime(date.getTime() - secondToTimeStamp);

  return {
    hours: Number(date.getHours()),
    minutes: Number(date.getMinutes()),
  };
};
const repair = require("jsonrepair");

const jp = (json) => {
  return JSON.parse(repair(json));
};

class GraphCalc {
  constructor(action_type, result, array) {
    this.action_type = action_type;
    this.result = result;
    this.array = array;
  }
  checkView(defData) {
    const check = defData.find((x) => x === Number(this.action_type));

    if (check) return true;
    else return false;
  }

  parseJsonData = (res, k) => {
    const json = jp(res?.stats_value),
      result = json?.behavior[k]?.percentage,
      resData = Number(result) * 100;

    return resData || 0;
  };

  parseRateData = (res, k) => {
    const json = jp(res?.stats_value),
      result = json?.behavior[k]?.rate,
      mnog = Number(result),
      resData = mnog;

    return resData || 0;
  };

  getGrapgFullData = () => {
    if (this.array) {
      let allArray = [];
      for (const date of this.array) {
        const resDay = this.getGraphData(date);

        if (this.checkView([1, 2])) {
          const calcArr = resDay.map((x) => x.Duration || 0);
          const calcSumm = calcArr.reduce(summ, 0) / calcArr.length;

          allArray = allArray.concat({
            name: "Page A",
            Duration: Number(calcSumm),
            Time: date,
          });
        }

        if (this.checkView([3])) {
          const neutralValue = resDay.map((x) => x.NeutralValue || 0);
          const correctValue = resDay.map((x) => x.CorrectValue || 0);
          const incorrectValue = resDay.map((x) => x.IncorrectValue || 0);

          const valueSumm =
            neutralValue.reduce(summ, 0) +
            correctValue.reduce(summ, 0) +
            incorrectValue.reduce(summ, 0);

          const calcNeutral = neutralValue.reduce(summ, 0) / valueSumm;
          const calcCorrect = correctValue.reduce(summ, 0) / valueSumm;
          const calcIncorrect = incorrectValue.reduce(summ, 0) / valueSumm;

          allArray = allArray.concat({
            name: "Page A",
            Neutral: calcNeutral * 100,
            Correct: calcCorrect * 100,
            Incorrect: calcIncorrect * 100,
            Time: date,
          });
        }

        if (this.checkView([4])) {
          const neutralValue = resDay.map((x) => x.NeutralValue || 0);
          const correctValue = resDay.map((x) => x.CorrectValue || 0);
          const incorrectValue = resDay.map((x) => x.IncorrectValue || 0);

          const arrDuration = resDay.map((x) => x.Duration || 0);
          const vs = arrDuration.reduce(summ, 0);

          const calcNeutral = neutralValue.reduce(summ, 0) / (vs / 60);
          const calcCorrect = correctValue.reduce(summ, 0) / (vs / 60);
          const calcIncorrect = incorrectValue.reduce(summ, 0) / (vs / 60);

          allArray = allArray.concat({
            name: "Page A",
            Neutral: calcNeutral,
            Correct: calcCorrect,
            Incorrect: calcIncorrect,
            Time: date,
          });
        }

        if (this.checkView([5])) {
          const percent = resDay.map((x) => x.Percent || 0);

          const result = percent.reduce(summ, 0) / percent.length;

          allArray = allArray.concat({
            name: "Page A",
            Positive: result,
            Time: date,
          });
        }
      }

      return allArray;
    }
  };

  getGraphData = (el) => {
    const parseData = this.getData(el);

    let testArr = [];
    for (const attempt of parseData) {
      let newObj = {
        name: "Page A",
        Duration: Number(attempt.time_data),
        Time: formatAMPM(startTime(attempt).hours, startTime(attempt).minutes),
      };

      // Freaquncie
      if (this.checkView([3])) {
        const stats_value = jp(attempt?.stats_value);

        newObj.NeutralValue = stats_value.behavior["neutral"]?.value;
        newObj.CorrectValue = stats_value.behavior["right"]?.value;
        newObj.IncorrectValue = stats_value.behavior["wrong"]?.value;

        newObj.Neutral = Number(
          this.parseJsonData(attempt, "neutral").toFixed(2)
        );
        newObj.Correct = Number(
          this.parseJsonData(attempt, "right").toFixed(2)
        );
        newObj.Incorrect = Number(
          this.parseJsonData(attempt, "wrong").toFixed(2)
        );

        if (!newObj.Neutral && !newObj.Correct && !newObj.Incorrect) continue;
      }

      //Rate
      if (this.checkView([4])) {
        const stats_value = jp(attempt?.stats_value);

        newObj.NeutralValue = stats_value.behavior["neutral"]?.value;
        newObj.CorrectValue = stats_value.behavior["right"]?.value;
        newObj.IncorrectValue = stats_value.behavior["wrong"]?.value;

        newObj.Neutral = this.parseRateData(attempt, "neutral") || 0;
        newObj.Correct = this.parseRateData(attempt, "right") || 0;
        newObj.Incorrect = this.parseRateData(attempt, "wrong") || 0;

        // if (!newObj.Neutral && !newObj.Correct && !newObj.Incorrect) continue;
      }

      //Interval
      if (this.checkView([5])) {
        const dataEl = this.result[el].center_data_dcm;
        const positive = dataEl.currents;
        const negative = dataEl.negative.length - dataEl.currents;

        const summ = Number(negative) + Number(positive);
        const percent = 100 / summ;
        const result = percent * Number(positive);

        const current = jp(attempt?.stats_value).intervals.current;

        newObj.Positive = current ? 100 : 0;
        newObj.Percent = result;
      }

      testArr.push(newObj);
    }
    return testArr;
  };

  getData(el) {
    const res = this.result[el].original;

    return res;
  }
}

module.exports = { GraphCalc };
