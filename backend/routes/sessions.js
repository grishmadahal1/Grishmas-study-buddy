const express = require("express");
const router = express.Router();
const db = require("../db");

// List all sessions (without full card data)
router.get("/", (req, res) => {
  const sessions = db
    .prepare("SELECT id, title, card_count, created_at FROM sessions ORDER BY created_at DESC")
    .all();
  res.json({ sessions });
});

// Get a single session with cards
router.get("/:id", (req, res) => {
  const session = db
    .prepare("SELECT * FROM sessions WHERE id = ?")
    .get(req.params.id);

  if (!session) {
    return res.status(404).json({ error: "Session not found." });
  }

  session.cards = JSON.parse(session.cards);
  res.json({ session });
});

// Save a new session
router.post("/", (req, res) => {
  const { title, cards } = req.body;

  if (!cards || !Array.isArray(cards) || cards.length === 0) {
    return res.status(400).json({ error: "Cards are required." });
  }

  const sessionTitle = title || cards[0].question.slice(0, 60) + "...";

  const result = db
    .prepare("INSERT INTO sessions (title, cards, card_count) VALUES (?, ?, ?)")
    .run(sessionTitle, JSON.stringify(cards), cards.length);

  const session = db.prepare("SELECT * FROM sessions WHERE id = ?").get(result.lastInsertRowid);
  session.cards = JSON.parse(session.cards);

  res.status(201).json({ session });
});

// Delete a session
router.delete("/:id", (req, res) => {
  const result = db.prepare("DELETE FROM sessions WHERE id = ?").run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Session not found." });
  }

  res.json({ success: true });
});

module.exports = router;
