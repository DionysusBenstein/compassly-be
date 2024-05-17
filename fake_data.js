require("dotenv").config();
const faker = require("faker"),
  { CreateMessage, DataBase } = require("./controllers"),
  { parseValue } = require("./beans"),
  moment = require("moment-timezone");

const user = async (groupID) => {
  let doctorsIDS = [];

  const _TEST_DOCTORS = [
    {
      number: `+111111111111`,
      email: `rruud@compassly.me`,
      password: "Crimson@348100",
    },
    {
      number: `+222222222222`,
      email: `tester@compassly.me`,
      password: "Tester@123456",
    },
  ];
  for (let i = 0; i < _TEST_DOCTORS.length; i++) {
    const newId = `${Date.now()}`;
    const fakeDoctor = {
      ..._TEST_DOCTORS[i],
      id: newId,
      group: groupID.toString(),
      name: parseValue(faker.name.firstName()),
      surname: parseValue(faker.name.lastName()),
      verify: true,
      register_date: `${Date.now()}`,
    };
    doctorsIDS.push(newId);
    await new DataBase().insert("users", fakeDoctor);
    new CreateMessage().success(`Create fake doctor: ${fakeDoctor.name}`);
  }

  return doctorsIDS;
};

const groups = async () => {
  const groupsArr = [
    {
      title: "Admin",
      program_library: true,
      maladaptive: true,
      employees: true,
      clients: true,
      reports: true,
    },
    {
      title: "Clinician",
      program_library: true,
      maladaptive: true,
      employees: false,
      clients: true,
      reports: false,
    },
    {
      title: "Basic",
      program_library: false,
      maladaptive: false,
      employees: false,
      clients: false,
      reports: true,
    },
    {
      title: "Supervisor",
      program_library: false,
      maladaptive: false,
      employees: false,
      clients: true,
      reports: true,
    },
  ];
  let groupArrData = [];
  let i = 1;
  for (const group of groupsArr) {
    const fakeGroup = {
      id: `group_${Date.now()}_${Math.random()}`,
      level: i,
      ...group,
    };
    await new DataBase().insert("user_groups", fakeGroup);
    groupArrData.push(fakeGroup);
    new CreateMessage().success(`Create fake group`);
    i++;
  }

  return groupArrData[0].id;
};

const domains = async () => {
  const newDomain = {
    id: `domain_${Date.now()}_${Math.random()}`,
    title: "Maladaptive behavior",
    maladaptive: true,
    updated_date: moment().format("YYYY-MM-DD"),
    create_date: moment().format("YYYY-MM-DD"),
    created_time: moment().format("HH:mm"),
  };

  await new DataBase().insert("domains", newDomain);
};

const init = async () => {
  const groupAdmin = await groups();
  await user(groupAdmin);
  await domains();

  process.exit(1);
};

init();
