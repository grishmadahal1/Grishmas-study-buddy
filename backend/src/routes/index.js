const express = require("express");
const router = express.Router();

const flashcardRoutes = require("./flashcardRoutes");
const sessionRoutes = require("./sessionRoutes");
const explanationRoutes = require("./explanationRoutes");

router.use("/", flashcardRoutes);
router.use("/sessions", sessionRoutes);
router.use("/explain", explanationRoutes);

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = router;
