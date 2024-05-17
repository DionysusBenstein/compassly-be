const { ParseForm } = require("./forms"),
  { Sms } = require("./sms"),
  { Email } = require("./mail"),
  { RegisterURL } = require("./register_url"),
  { Validations } = require("./validations"),
  { Percent } = require("./percent"),
  { parseValue } = require("./ecran");

module.exports = {
  Email,
  Sms,
  ParseForm,
  RegisterURL,
  Validations,
  Percent,
  parseValue,
};
