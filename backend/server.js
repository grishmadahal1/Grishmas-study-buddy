const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const generateRoutes = require("./routes/generate");
const uploadRoutes = require("./routes/upload");
const sessionRoutes = require("./routes/sessions");
const explainRoutes = require("./routes/explain");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/generate", generateRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/explain", explainRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
