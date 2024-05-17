const csvToJson = require("convert-csv-to-json"),
  formidable = require("formidable"),
  path = require("path"),
  fs = require("fs"),
  xlsx = require("node-xlsx"),
  moment = require("moment-timezone"),
  { DataBase } = require("../../controllers");

function unique(arr) {
  let result = [];

  for (let str of arr) {
    if (!result.includes(str)) {
      result.push(str);
    }
  }

  return result;
}

const parseType = (type) => {
  if (type === "Latency") return 1;
  if (type === "Duration") return 2;
  if (type === "Frequency") return 3;
  if (type === "Rate") return 4;
  if (type === "Interval") return 5;
};

// const createMaladaptiveBehavior = async (id) => {
//   await new DataBase().insert("sub_domains", {
//     id: `sub_domain_${Date.now()}_${Math.random()}`,
//     maladaptive: true,
//     parrent_id: id,
//     title: "Maladaptive behavior",
//     rate: 0,
//     updated_date: moment().tz(global.tz).format("YYYY-MM-DD"),
//     create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
//     created_time: moment().tz(global.tz).format("HH:mm"),
//   });
// };

const createSkills = async (parrent_id, list) => {
  for (const s of list) {
    const newSkill = {
      id: `skill_${Date.now()}_${Math.random()}`,
      parrent_id: parrent_id,
      action_type: parseType(s.action_type),
      sub_type: s.sub_type,
      title: s.title,
      updated_date: moment().tz(global.tz).format("YYYY-MM-DD"),
      create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
      created_time: moment().tz(global.tz).format("HH:mm"),
    };

    await new DataBase().insert("skills", newSkill);
  }
};

const createSubDomains = async (parrent_id, list) => {
  for (const s of list) {
    const newSubdomain = {
      id: `sub_domain_${Date.now()}_${Math.random()}`,
      rate: 0,
      title: `${s.title}`,
      parrent_id: parrent_id,
      maladaptive: false,
      updated_date: moment().tz(global.tz).format("YYYY-MM-DD"),
      create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
      created_time: moment().tz(global.tz).format("HH:mm"),
    };

    await new DataBase().insert("sub_domains", newSubdomain);
    await createSkills(newSubdomain.id, s.skills);
  }
};

const ImportDomainsByFile = async (req, res) => {
  const newForm = new formidable.IncomingForm(),
    formfields = await new Promise((resolve, reject) => {
      newForm
        .parse(req)
        .on("fileBegin", (name, file) => {
          file.path = path.join(__dirname, `../../assets`) + `/${file.name}`;
        })
        .on("file", (name, file) => {
          resolve(file);
        });
    });

  const pathData = path.join(__dirname, `../../assets`) + `/${formfields.name}`;

  const obj = await xlsx.parse(pathData); // parses a file
  const data = obj[0].data;
  const resData = [];
  const getSkills = (a, b) => {
    const r = data.filter((x) => x[0] === a && x[1] === b);
    const skills = unique(r.map((x) => x[2]));

    return skills.map((x) => {
      const s_data = r.find((s) => s[0] === a && s[1] === b && s[2] === x);
      return {
        title: x,
        action_type: s_data[3],
        sub_type: s_data[4],
      };
    });
  };
  const getSubDomains = (a) => {
    const r = data.filter((x) => x[0] === a);
    const subdomains = unique(r.map((x) => x[1]));

    return subdomains.map((x) => {
      return {
        title: x,
        skills: getSkills(a, x),
      };
    });
  };

  const domains = unique(data.map((x) => x[0]));

  for (const domain of domains) {
    resData.push({
      title: domain,
      subdomains: getSubDomains(domain),
    });
  }

  for (const domain of resData) {
    const newDomain = {
      id: `domain_${Date.now()}_${Math.random()}`,
      title: domain.title,
      updated_date: moment().tz(global.tz).format("YYYY-MM-DD"),
      create_date: moment().tz(global.tz).format("YYYY-MM-DD"),
      created_time: moment().tz(global.tz).format("HH:mm"),
    };

    await new DataBase().insert("domains", newDomain);

    await createSubDomains(newDomain.id, domain.subdomains);
  }
  fs.unlinkSync(pathData);

  return res.status(200).send({ msg: "Import cuccessfull!", data: resData }); // data: result, length: result.length
};

module.exports = ImportDomainsByFile;
