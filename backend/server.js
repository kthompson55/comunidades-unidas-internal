if (process.env.RUNNING_LOCALLY) {
  require("dotenv").config();
}

const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

require("./run-database-migrations");

exports.app = app;
exports.pool = mysql.createPool({
  connectionLimit: 20,
  host: process.env.RDS_HOSTNAME || "localhost",
  user: process.env.RDS_USERNAME || "root",
  password: process.env.RDS_PASSWORD || "password",
  database: process.env.RDS_DB_NAME || "local_db",
  port: process.env.RDS_PORT || "3306",
  multipleStatements: true
});

exports.invalidRequest = function invalidRequest(res, msg) {
  res.status(400).send({ error: msg });
};

exports.notFound = function notFound(res, msg) {
  res.status(404).send({ error: msg });
};

exports.databaseError = function databaseError(req, res, err, connection) {
  if (connection) {
    connection.release();
  }
  const msg = process.env.RUNNING_LOCALLY
    ? `Database Error for backend endpoint '${req.url}'. ${err}`
    : `Database error. Run 'eb logs' for more detail`;
  console.error(err);
  res.status(500).send({ error: msg });
};

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.set("trust proxy", 1);
app.use("/static", express.static(path.join(__dirname, "../static")));
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use((err, req, res, next) => {
  console.error("ERROR: ", err);
});
app.use(morgan("tiny"));

require("./apis/login.api");
require("./apis/github-issues.api");
require("./apis/clients/add-client.api");
require("./apis/clients/client-duplicates.api");
require("./apis/clients/get-client.api");
require("./apis/clients/update-client.api");
require("./apis/services/list-services.api");
require("./apis/clients/list-clients.api");
require("./apis/clients/client-audit.api");
require("./apis/clients/client-logs/get-activity-logs.api");
require("./apis/clients/client-logs/delete-activity-logs.api");
require("./apis/clients/client-logs/create-activity-log.api");
require("./index-html.js");

process.on("uncaughtException", function(err) {
  console.error("Backend error in node server code:");
  console.error(err);
});

app.listen(port, () => {
  console.log("Node Express server listening on port", port);
});
