const { CreateMessage } = require("./createmessage"),
  DataBase = require("./database"),
  Migrations = require("./migration"),
  { Session } = require("./session"),
  { NewDoctor } = require("./new-doctor"),
  { GetDCM, AddDCM } = require("./dcm"),
  { DailyController } = require("./daily"),
  { GraphController } = require("./graph"),
  { SkillsGraph } = require("./skills-graph"),
  { History } = require("./history");

module.exports = {
  NewDoctor,
  CreateMessage,
  DataBase,
  Migrations,
  Session,
  GetDCM,
  AddDCM,
  GraphController,
  DailyController,
  SkillsGraph,
  History,
};
