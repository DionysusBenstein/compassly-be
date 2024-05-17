const { DataBase, NewDoctor } = require("../../controllers");
const { FRONT_URL } = process.env;

const messages = {
  errorValideData: "Token is not valide!",
  userError: "This user is already registered",
  alreadySent: "Registration sheet has already been sent!",
};

const Activation = async (req, res) => {
  const { token } = req.params;

  if (!token)
    return res.status(300).send({ err: true, msg: messages.errorValideData });

  const checkToken = await new DataBase().select(
    "*",
    "registers_url",
    "token = $1",
    [token]
  );

  if (!checkToken)
    return res.status(201).json({ err: true, msg: "Token is not defined!" });

  const randomstring = Math.random().toString(36).slice(-8);

  await new DataBase().update(
    "users",
    `verify = true, password = '${randomstring}'`,
    `id = '${checkToken.user_id}'`
  );

  const user = await new DataBase().select("*", "users", "id = $1", [
    checkToken.user_id,
  ]);

  if (!user)
    return res.status(201).send({ err: true, msg: "User is not defined!" });

  await new NewDoctor(user).sendEmailNewPasswd(randomstring, async () => {});

  await new DataBase().update(
    "registers_url",
    "active = false",
    `token = '${token}'`
  );

  res.send(
    `<html><script>window.location.href = "${FRONT_URL}/active/${checkToken.user_id}"</script></html>`
  );
  // res.redirect(200, `${FRONT_URL}/active/${checkToken.user_id}`);
  // res.status(status).send({ err: false, message });
};

module.exports = Activation;
