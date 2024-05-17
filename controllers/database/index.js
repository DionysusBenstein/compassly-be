const { parseValue } = require("../../beans");

const { Pool } = require("pg"),
  { DB_HOST, DB_PORT, DB_NAME, DB_USER, db_PASSWORD } = process.env,
  { CreateMessage } = require("../createmessage"),
  pool = new Pool({
    user: DB_USER,
    password: db_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
  });

class DataBase {
  constructor() {
    this.url = `postgres://${DB_USER}:${db_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    // this.systemMsg = new CreateMessage();
  }
  async connect() {
    if (!this.url) {
      // this.systemMsg.error("Error database URL");
      return false;
    }
    const client = await pool.connect();
    try {
      await client.query("SELECT NOW()");
      await client.end();

      return true;
    } catch (e) {
      // this.systemMsg.error(`Error connect to Database: ${DB_NAME}`);

      return false;
    }
  }
  //Get count by table
  async counts(table, where) {
    const client = await pool.connect();
    try {
      const res = await client.query(
        `SELECT COUNT(*) FROM ${table} WHERE ${where}`
      );

      return (res.rows[0] && Number(res.rows[0].count)) || 0;
    } finally {
      client.release();
    }
  }
  //Get data from DB
  async select(select, table, where, properties, all = false) {
    const client = await pool.connect();
    try {
      const res = await client.query(
        `SELECT ${select} FROM ${table} WHERE ${where}`,
        properties
      );

      if (all) {
        return res.rows;
      } else {
        return res.rows[0];
      }
    } finally {
      client.release();
    }
  }
  // Cteate USER to DB
  async insert(table, data) {
    const client = await pool.connect();
    try {
      const columns = Object.keys(data).map((el) => `"${el}"`.trim()),
        values = Object.values(data).map((el) => parseValue(el)),
        keys = Object.values(data).map((el, key) => `$${key + 1}`);

      const _Q = `INSERT INTO ${table} (${columns.toString()}) VALUES(${keys.toString()}) RETURNING *`;
      // console.log(_Q)
      const res = await client.query(_Q, values);

      return res.rows[0];
    } catch (e) {
      // console.log(`Table: ${table} - is error`);
      client.release();
    } finally {
      client.release();
    }
  }
  //Update table row
  async update(table, value, where) {
    const client = await pool.connect();
    try {
      const res = await client.query(
        `UPDATE ${table} SET ${value} WHERE ${where};`
      );

      return res.rows[0];
    } finally {
      client.release();
    }
  }
  async delete(table, where) {
    const client = await pool.connect();
    try {
      const res = await client.query(`DELETE FROM ${table} WHERE ${where};`);

      return res.rows;
    } finally {
      client.release();
    }
  }
  //Custom query
  async custom(query, all = false) {
    const client = await pool.connect();
    try {
      const res = await client.query(query);

      if (all) {
        return res.rows;
      } else {
        return res.rows[0];
      }
    } finally {
      client.release();
    }
  }
  //DropTable
  async dropTable(names) {
    const client = await pool.connect();
    try {
      const res = await client.query(`DROP TABLE ${names}`);

      return res;
    } catch (e) {
      // console.log(`Table: ${names} - is not defined`);
    } finally {
      client.release();
    }
  }
  //create table
  async createTable(name, createSring) {
    const client = await pool.connect();
    try {
      const res = await client.query(createSring);

      // this.systemMsg.success(`Created Table: ${name}`);
      return res;
    } catch (e) {
      // console.log(`Table: ${name} - is not defined`);
    } finally {
      client.release();
    }
  }
}

module.exports = DataBase;
