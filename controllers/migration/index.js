const DataBase = require("../database");
const Tables = require("./tables");

class Migrations {
  constructor() {
    this.tables = Tables();
  }
  async createAllTables() {
    for (const table of Object.keys(this.tables)) {
      // await new DataBase().dropTable(table);
      await new DataBase().createTable(table, this.tables[table].createSring);
    }
  }

  async init(callback) {
    await this.createAllTables();
    callback();
  }
}

module.exports = Migrations;
