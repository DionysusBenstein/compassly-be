const { API_PORT } = process.env;

const Listen = async () => {
  /*eslint-disable */
  console.log(`Example app listening at http://localhost:${API_PORT}`);
  /* eslint-enable */
};

module.exports = { Listen };
