const getSort = (field, sort, custom = "") => {
  if (sort && field) {
    return `ORDER BY ${field} ${sort}${custom}`;
  } else {
    return "";
  }
};

module.exports = { getSort };
