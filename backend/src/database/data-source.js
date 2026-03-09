require("reflect-metadata");
const { DataSource } = require("typeorm");
const config = require("../config");
const Session = require("../entities/Session");
const Explanation = require("../entities/Explanation");

const AppDataSource = new DataSource({
  type: "postgres",
  url: config.db.url,
  entities: [Session, Explanation],
  synchronize: true,
  logging: false,
});

module.exports = AppDataSource;
