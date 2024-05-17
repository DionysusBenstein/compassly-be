const { ParseForm } = require("../../beans");
const { GraphCalc } = require("../../calculates/graph-calc");
const { GraphController, DataBase } = require("../../controllers");

const parseDoctors = async (doctor) => {
    if (doctor) {
      return doctor.split(",");
    } else {
      const queryDoctors = await new DataBase().custom(
        `SELECT users.id, users.name, users.surname
      FROM users
      INNER JOIN user_groups ON user_groups.id = users.group
      WHERE user_groups.level = 1 OR user_groups.level = 2`,
        true
      );

      return queryDoctors.map((x) => x.id);
    }
  },
  getStaticData = async (client, skill, subdomain) => {
    if (subdomain) {
      const skills = await new DataBase().custom(
        `SELECT skills.*, 
        COALESCE (
          NULLIF (skill_custom_type.custom_type, ''),
          LEFT (skills.action_type, 40)
        ) as action_type 
        FROM skills 
        LEFT JOIN skill_custom_type ON skill_custom_type.skill_id = skills.id 
        WHERE skills.id = '${skill}' AND skill_custom_type.user_id = '${client}'`,
        false
      );

      const subdomainData = await new DataBase().custom(
        `SELECT * FROM sub_domains WHERE id = '${skills.parrent_id || 0}'`,
        false
      );

      const domainData = await new DataBase().custom(
        `SELECT * FROM domains WHERE id = '${subdomainData.parrent_id || 0}'`,
        false
      );

      const clientData = await new DataBase().custom(
        `SELECT * FROM clients WHERE id = '${client}'`,
        false
      );

      return {
        client: clientData,
        domain: domainData,
        subdomain: subdomainData,
        skill: skills,
      };
    } else {
      const skills = await new DataBase().custom(
        `SELECT * FROM skills WHERE id = '${skill}'`,
        false
      );

      const domainData = await new DataBase().custom(
        `SELECT * FROM domains WHERE id = '${skills.parrent_id || 0}'`,
        false
      );

      const clientData = await new DataBase().custom(
        `SELECT * FROM clients WHERE id = '${client}'`,
        false
      );

      return {
        client: clientData,
        domain: domainData,
        subdomain: null,
        skill: skills,
      };
    }
  },
  unique = (arr) => {
    let result = [];

    for (let str of arr) {
      if (!result.includes(str)) {
        result.push(str);
      }
    }

    return result;
  },
  getKeysFromArray = (arr) => {
    let keys = [];

    for (const a of arr) {
      const ok = Object.keys(a);
      for (const i of ok) {
        if (i !== "name" && i !== "Time" && i !== "Doctor") keys.push(i);
      }
    }

    return unique(keys);
  },
  GetNewGraph = async (req, res) => {
    const { start, end, doctor, client, domain, subdomain, skill, report } =
      await new ParseForm(req).parseForm();

    /** get doctors list */
    const doctorsList = await parseDoctors(doctor);

    let doctorsData = [];
    let key = 0;

    for (const d of doctorsList) {
      const { data } = await new GraphController(skill, client, "24h").getGraph(
        {
          start: start,
          end: end,
        },
        d
      );

      data.doctor = await new DataBase().custom(
        `SELECT users.name, users.surname, users.id FROM users WHERE id = '${d}'`
      );
      data.tab_id = data.doctor.id;

      const datesArr = Object.keys(data?.result);

      data.isGraph = datesArr.length > 0;

      const docDataRes = new GraphCalc(
        data?.action_type,
        data?.result,
        datesArr
      ).getGrapgFullData();

      data.graphData = {
        list: docDataRes,
        keys: getKeysFromArray(docDataRes),
      };

      data.counts = datesArr.length;
      doctorsData.push(data);
      key++;
    }

    const resultData = await new GraphController(skill, client, "24h").getGraph(
      {
        start: start,
        end: end,
      }
    );

    function sortfunction(cur, nex) {
      return nex.counts - cur.counts;
    }

    let _R = {
      report: resultData?.data,
      ...(await getStaticData(client, skill, !!subdomain)),
      action_type: doctorsData[0]?.action_type || null,
      doctorsData: doctorsData.sort(sortfunction),
    };

    const testArr = Object.keys(_R?.report?.result);

    const sss = new GraphCalc(
      _R?.action_type,
      _R?.report?.result,
      testArr
    ).getGrapgFullData();

    _R.fullRangeGraph = sss;
    _R.allDoctorsGraph = {
      list: sss,
      keys: getKeysFromArray(sss),
    };

    return res.status(200).send(_R);
  };

module.exports = GetNewGraph;
