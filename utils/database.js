const mysql = require("mysql");
require('dotenv').config();

const database_url = process.env.DATABASE_URL.match(/mysql:\/\/(.+):(.+)@(.+)\/(.+)\?reconnect=true/);

module.exports = mysql.createPool(
  {
    user: database_url[1],
    password: database_url[2],
    host: database_url[3],
    database: database_url[4],
    debug: false
  }
);