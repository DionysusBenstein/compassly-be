const parseValue = (value) => {
  if (typeof value !== "string") return value;

  return value.replace(/[']/g, "''").replace(/["]/g, "");
};

module.exports = { parseValue };
