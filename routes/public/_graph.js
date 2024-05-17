const { GraphController } = require("../../controllers"),
  { ParseForm } = require("../../beans");

const Graph = async (req, res) => {
  const {
    skill_id = null,
    client_id = null,
    filter = null,
  } = await new ParseForm(req).parseForm();

  const { status, data } = await new GraphController(
    skill_id,
    client_id,
    filter
  ).getGraph();

  res.status(200).send(data);
};

module.exports = Graph;
