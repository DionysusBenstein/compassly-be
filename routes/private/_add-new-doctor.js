const { DataBase, NewDoctor } = require("../../controllers"),
  { ParseForm } = require("../../beans");

const messages = {
  errorValideData: "Data is not valide!",
  userError: "This phone number/email is already registered",
  alreadySent: "Registration sheet has already been sent!",
  errorRole: "Role unselected",
};

const SendLink = async (req, res) => {
  const { email, name, surname, group, number } = await new ParseForm(
    req
  ).parseForm();

  if (!group)
    return res.status(200).send({ err: true, msg: messages.errorRole });

  if (!email && !name && !surname)
    return res.status(200).send({ err: true, msg: messages.errorValideData });

  const user = await new DataBase().custom(
    `SELECT * FROM users WHERE email = '${email}' OR number = '${number.replace(
      /[^+\d]/g,
      ""
    )}'`
  );

  if (user) return res.status(201).send({ err: true, msg: messages.userError });

  const link = await new DataBase().select(
    "*",
    "registers_url",
    "email = $1 and active = true",
    [email]
  );

  if (link)
    return res.status(302).send({ err: true, msg: messages.alreadySent });

  const newUserData = {
      id: Date.now(),
      register_date: Date.now(),
      verify: false,
      creator: req.user_id,
      email: email.trim(),
      name,
      surname,
      group,
      number: number.replace(/[^+\d]/g, ""),
    },
    createdUser = await new DataBase().insert("users", newUserData);

  // const { title } = await new DataBase().select("*", "user_groups", "id = $1", [
  //   group,
  // ]);

  /** TO DO */

  // if (title === "Clinician") {
  //   const { status, message } = await new NewDoctor(
  //     createdUser
  //   ).sendEmailClinician();
  //   res.status(status).send({ err: false, message });
  // } else {
  const { status, message } = await new NewDoctor(createdUser).sendEmailOther();
  res.status(status).send({ err: false, message });
  // }
};

module.exports = SendLink;
