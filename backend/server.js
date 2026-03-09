/**
 * @fileoverview Application entry point.
 * Boots the Express server on the configured port.
 */

const config = require("./src/config");
const app = require("./src/app");

app.express.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
