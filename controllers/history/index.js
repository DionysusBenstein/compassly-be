const DataBase = require("../database");

const summ = (partial_sum, a) => partial_sum + a;
const format = (num) => (num < 10 ? `0${num}` : num);

class History {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  validationClient(client_id) {
    if (!client_id)
      return {
        status: 201,
        data: { err: true, msg: "Client id is not valid!" },
      };

    return false;
  }

  validationDate(year, month, day) {
    if (!year && !month && !day)
      return {
        status: 201,
        data: { err: true, msg: "Date is not valid!" },
      };

    return false;
  }

  async getClient(id) {
    return await new DataBase().select("*", "clients", "id = $1", [id], true);
  }

  async getUser(id) {
    return await new DataBase().select("*", "users", "id = $1", [id], true);
  }

  async getDCMData(client_id, day, month, year) {
    return await new DataBase().select(
      "*",
      "dcm",
      "client_id = $1 and day = $2 and month = $3 and year = $4",
      [client_id, day, month, year],
      true
    );
  }

  async formatRequest({ client, user, dcm }) {
    let skillsArr = [];
    for (let d of dcm) {
      if (skillsArr.find((x) => x.skill_id === d.skill_id)) continue;

      const skillData = await new DataBase().select("*", "skills", "id = $1", [
        d.skill_id,
      ]);

      if (skillData) {
        const {
          title = "...",
          parrent_id: sub_domain_id,
          sub_type,
          action_type,
          maladaptive,
        } = skillData;

        if (maladaptive) continue;

        const _SD = await new DataBase().select("*", "sub_domains", "id = $1", [
          sub_domain_id,
        ]);

        const { title: sub_domain_title, parrent_id: domain_id } = _SD;

        const { title: domain_title } = await new DataBase().select(
          "*",
          "domains",
          "id = $1",
          [domain_id]
        );

        const total_time = dcm
          .filter((x) => x.skill_id === d.skill_id)
          .map((x) => Number(x.time_data))
          .reduce(summ, 0);

        const list = dcm
          .filter((x) => x.skill_id === d.skill_id)
          .map((x) => {
            const startTime = (obj) => {
              let date = new Date(obj.createdate);
              date.setHours(obj.hour);
              date.setMinutes(obj.minute);

              const secondToTimeStamp = Number(obj.time_data) * 1000;

              date.setTime(date.getTime() - secondToTimeStamp);

              return { hour: date.getHours(), minute: date.getMinutes() };
            };

            const checkStartTime = startTime(x);
            return {
              id: x.id,
              total_time: Number(x.time_data),
              start: checkStartTime,
              end: { hour: Number(x.hour), minute: Number(x.minute) },
            };
          });

        skillsArr.push({
          skill_id: d.skill_id,
          domain: domain_title,
          sub_domain: sub_domain_title,
          skill: title,
          total: total_time,
          skill_type: action_type,
          sub_type: sub_type,
          list,
        });
      } else continue;
    }

    const getTimeData = () => {
      let arr = [];
      skillsArr.map((a) => {
        a.list.map((b) => {
          arr.push({
            s: b.start.hour * 60 * 60 + b.start.minute * 60,
            start: b.start,
            end: b.end,
          });
        });
      });

      arr.sort((a, b) => a.s - b.s);

      // not list data
      if (arr.length < 1)
        return {
          start_time: null,
          end_time: null,
        };

      const start = arr[0].start;
      const end = arr[arr.length - 1].end;

      return {
        start_time: `${format(start.hour)}:${format(start.minute)}`,
        end_time: `${format(end.hour)}:${format(end.minute)}`,
      };
    };

    const result = {
      doctor: user[0] || null,
      patient: client[0] || null,
      ...getTimeData(),
      skills: skillsArr,
    };

    return { status: 201, data: result };
  }

  async deleteHistory(dcm_id) {
    await new DataBase().delete("dcm", `id = '${dcm_id}'`);

    return { status: 201, data: { err: false, msg: "Deleted successfull!" } };
  }
}

module.exports = { History };
