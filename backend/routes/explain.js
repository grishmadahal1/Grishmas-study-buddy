const express = require("express");
const router = express.Router();
const db = require("../db");
const { explainCard } = require("../lib/openai");

router.post("/", async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: "Question and answer are required." });
    }

    // Check cache first
    const cached = db
      .prepare("SELECT explanation FROM explanations WHERE question = ? AND answer = ?")
      .get(question, answer);

    if (cached) {
      return res.json({ explanation: cached.explanation });
    }

    // Generate and cache
    const explanation = await explainCard(question, answer);

    db.prepare("INSERT OR IGNORE INTO explanations (question, answer, explanation) VALUES (?, ?, ?)")
      .run(question, answer, explanation);

    res.json({ explanation });
  } catch (err) {
    console.error("Explain error:", err.message);
    res.status(500).json({ error: "Failed to generate explanation." });
  }
});

module.exports = router;
