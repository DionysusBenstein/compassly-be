const DataBase = require("../database"),
  { Percent } = require("../../beans");

class SkillsGraph {
  async getSkillsGraph(skill_id, client_id) {
    if (!skill_id && !client_id)
      return {
        result: 0,
      };

    const skill = await new DataBase().custom(
        `SELECT * FROM skills WHERE id = '${skill_id}'`,
        false
      ),
      data = await new DataBase().custom(
        `SELECT * FROM dcm WHERE skill_id = '${skill_id}' and client_id = '${client_id}'`,
        true
      ),
      result = data || [];

    let dataArray = { original: null, percent: null, symbol: null };

    // if (result.length >= 10) {
    const attempts_count = await new DataBase().counts(
      "dcm",
      `skill_id = '${skill_id}' and client_id = '${client_id}'`
    );

    const { value, symbol } = await new Percent().getPercentTargetSkill(
      result,
      skill.action_type,
      skill_id,
      client_id,
      attempts_count
    );

    dataArray.original = result;
    dataArray.percent = Number(value.toFixed(4)) || 0;
    dataArray.symbol = symbol;
    dataArray.positive = value > 0;
    // }

    return dataArray;
  }
}

module.exports = { SkillsGraph };
