const express = require("express"),
  app = express(),
  cors = require("cors"),
  path = require("path"),
  swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./openapi"),
  bodyParser = require("body-parser"),
  { Public, Private } = require("./routes"),
  { GeneratePdf } = require("./routes/public/_pdf"),
  moment = require("moment-timezone");

global.tz = "America/New_York";

/** TODO - TEST SMS * */
/*eslint-disable */
// Locale token - 1979402047:AAEeErnfXUbYxEIrW0V5PG78_ozEakE-fEg
// Test server token - 1988583847:AAEIDgIXP8GmkQiO26mzOt5MwVJvIZSldhs

// const TelegramBot = require("node-telegram-bot-api"),
//   token = "1988583847:AAEIDgIXP8GmkQiO26mzOt5MwVJvIZSldhs";
// global.bot = new TelegramBot(token, { polling: true });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb" }));
// parse application/json
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(require("./cors"));
app.use(cors());
app.use(express.static(path.join(__dirname, "./assets")));

app.get("/pdf/:client_id*", async (req, res) => {
  const pdfData = await GeneratePdf(req);

  res.status(200).render("pdf.ejs", pdfData);
});

app.get("/pdf-data/:client_id*", async (req, res) => {
  const pdfData = await GeneratePdf(req);

  res.status(200).send(pdfData);
});

app.get("/", (req, res) => {
  res.render("index.ejs");
});

/* eslint-enable */
/** END TODO* */

// app.use(Deep);
app.use(Public);
app.use(Private);

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/deeplink/:token", (req, res) => {
  const { token } = req.params;

  res.render("deep.ejs", {
    fallback: "https://compassly.me/",
    android: "com.compass",
    ios: "https://apps.apple.com/us/app/compassly/id1585777645",
    url: "https://compassly.me/",
    token: token,
  });
});

module.exports = app;
