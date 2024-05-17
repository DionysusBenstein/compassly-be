const e = require("express");
const { DataBase } = require("../../controllers");

const getOrder = (table) => {
    switch (table) {
      case "users":
        return "name";
      case "clients":
        return "name";
      case "client_domain":
        return "id";
      default:
        return "title";
    }
  },
  GetData = async (req, res) => {
    const { table, page, where, search, filter, list_value = 20 } = req.query,
      order = where ? "" : ` ORDER BY ${getOrder(table)} ASC`,
      wh = where ? ` WHERE ${where}` : "",
      srch = search
        ? ` ${wh} ${wh !== "" ? "and" : "WHERE"} ${getOrder(
            table
          )} ilike '%${search}%'`
        : null,
      counts = await new DataBase().custom(
        `SELECT COUNT(*) FROM ${table}${search ? srch : wh}`
      ),
      checkLimit =
        list_value + Number(counts.count) - list_value * Number(page || 1),
      pageDataParse = page ? Number(page) - 1 : 0,
      parseTwo = pageDataParse <= 0 ? 0 : pageDataParse,
      limit = ` LIMIT ${
        page
          ? checkLimit < list_value && checkLimit > 0
            ? checkLimit
            : list_value
          : list_value
      } OFFSET ${list_value * parseTwo}`;

    let byFilter = ``;
    if (table === "clients") {
      if (filter === "all") byFilter = ``;
      if (filter === "active") byFilter = ` WHERE active = true `;
      if (filter === "disactive") byFilter = ` WHERE active = false `;
    }
    const query = `SELECT  * FROM ${table}${
      search ? srch : wh
    }${byFilter}${order}${limit}`;

    const list = await new DataBase().custom(query, true);

    if (table === "materials") {
      for (const material of list) {
        const clientsRes = await new DataBase().custom(
          `SELECT clients.* FROM materials_users INNER JOIN clients ON clients.id = materials_users.client_id WHERE materials_users.material_id = '${material.id}'`,
          true
        );

        material.clients =
          clientsRes.map((el) => {
            return {
              value: el.id,
              label: el.title || `${el.name} ${el.surname}`,
            };
          }) || [];
      }
    }

    if (table === "company_materials") {
      for (const material of list) {
        const usersList = await new DataBase().custom(
          `SELECT * FROM company_materials_users LEFT JOIN users ON users.id = company_materials_users.user_id WHERE company_material_id = '${material.id}'`,
          true
        );

        material.test = usersList;

        material.users = usersList.map((el) => {
          return {
            value: el.user_id === "all" ? 0 : el.id,
            label:
              el.title ||
              `${
                el.user_id === "all" ? "All users" : el.name + " " + el.surname
              }`,
          };
        });
      }
    }

    return res.status(200).send({ list, counts: Number(counts.count) });
  };

module.exports = GetData;
