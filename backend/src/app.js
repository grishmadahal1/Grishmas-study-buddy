const express = require("express");
const cors = require("cors");
const config = require("./config");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");

class App {
  constructor() {
    this._app = express();
    this._configureMiddleware();
    this._configureRoutes();
    this._configureErrorHandling();
  }

  get express() {
    return this._app;
  }

  _configureMiddleware() {
    this._app.use(cors({ origin: config.corsOrigin }));
    this._app.use(express.json({ limit: "10mb" }));
  }

  _configureRoutes() {
    this._app.use("/api", routes);
  }

  _configureErrorHandling() {
    this._app.use(errorHandler);
  }
}

module.exports = new App();
