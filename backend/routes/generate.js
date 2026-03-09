const express = require("express");
const router = express.Router();
const { generateFlashcards } = require("../lib/openai");

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required." });
    }

    if (text.length > 15000) {
      return res
        .status(400)
        .json({ error: "Text is too long. Please keep it under 15,000 characters." });
    }

    const cards = await generateFlashcards(text);
    res.json({ cards });
  } catch (err) {
    console.error("Generate error:", err.message);
    res.status(500).json({ error: "Failed to generate flashcards. Please try again." });
  }
});

module.exports = router;
