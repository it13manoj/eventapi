const { Sequelize } = require("sequelize");
const config = require("../config/config");

const sequelize = new Sequelize(
  config.databaseConnection.database,
  config.databaseConnection.username?config.databaseConnection.username : "root" ,
  config.databaseConnection.password,
  {
    host: config.databaseConnection.host,
    dialect: config.databaseConnection.dialect || "mysql",
    hooks: {
      afterConnect: (connection, extendOptions) => {
        return new Promise((resolve) => {
          connection.query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))", () => {
            resolve();
          });
        });
      }
    }
  }
);

sequelize.authenticate()
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch(err => {
    console.error("Unable to connect:", err);
  });

module.exports = sequelize;
