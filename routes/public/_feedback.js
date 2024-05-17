const { ParseForm } = require("../../beans");
const { DataBase } = require("../../controllers");

const Feedback = async (req, res) => {
  const { email, message } = await new ParseForm(req).parseForm();

  if (!email && !message)
    return res
      .status(201)
      .json({ err: true, msg: "Error valide email or message!" });

  const newFeedback = {
    id: `feedback_${Date.now()}_${Math.random()}`,
    user_id: req.user_id,
    email,
    message,
  };

  const feed = await new DataBase().insert("feedbacks", newFeedback);

  return res
    .status(201)
    .json({ err: false, msg: "Send feedback successfull!", data: feed });
};

module.exports = Feedback;
