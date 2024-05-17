require("dotenv").config();
const Migrations = require("./controllers/migration");

const Migration = async () => {
  await new Migrations().init(() => process.exit(1));
};

Migration();
