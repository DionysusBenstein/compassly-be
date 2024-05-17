require("dotenv").config();

const { API_PORT } = process.env,
  port = API_PORT || 3000,
  { Listen } = require("./listen");

const app = require("./app");

app.listen(port, Listen);
