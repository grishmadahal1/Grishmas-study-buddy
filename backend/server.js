/**
 * @fileoverview Application entry point.
 * Initializes TypeORM and boots the Express server.
 */

const AppDataSource = require("./src/database/data-source");
const config = require("./src/config");
const app = require("./src/app");

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected.");
    app.express.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
