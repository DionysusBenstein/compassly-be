const { DataBase, NewDoctor } = require("../../controllers"),
  { ParseForm } = require("../../beans"),
  moment = require("moment-timezone");

const ImportEmployeees = async (req, res) => {
  const { data } = await req.body;

  try {
    let err_arr = [];
    const _FD = data.filter((x) => x.length > 0);

    if (_FD.length < 1)
      return res.status(200).send({ err: true, msg: "Data is not valide" });

    const groups = await new DataBase().custom(
      `SELECT * FROM user_groups`,
      true
    );

    for (const employee of _FD) {
      const user = await new DataBase().select("*", "users", "email = $1", [
        employee[2],
      ]);

      if (!employee[0] && !employee[1] && !employee[2] && !employee[3]) {
        err_arr.push(["This user data is not valid", ...employee]);

        continue;
      }

      if (user) {
        err_arr.push(["This user is already registered", ...employee]);

        continue;
      }

      const find = groups.find((x) => x.title === employee[4]),
        _ND = {
          id: `user_${Date.now()}_${Math.random()}`,
          name: employee[0] || "null",
          surname: employee[1] || "null",
          email: employee[2] || "null",
          number: employee[3] || "null",
          group: find?.id || "null",
          register_date: Date.now(),
          verify: false,
          creator: 0,
        },
        createdUser = await new DataBase().insert("users", _ND);

      await new NewDoctor(createdUser).sendEmailOther();
      err_arr.push(["Successfull registered", ...employee]);
    }

    return res.status(200).send({ err: null, data: _FD, results: err_arr });
  } catch (e) {
    return res.status(200).send({ err: true, msg: e });
  }
};

module.exports = ImportEmployeees;
