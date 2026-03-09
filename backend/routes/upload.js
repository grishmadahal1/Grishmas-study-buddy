const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { generateFlashcards } = require("../lib/openai");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed."));
    }
  },
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded." });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Could not extract text from this PDF." });
    }

    const trimmedText = text.slice(0, 15000);
    const cards = await generateFlashcards(trimmedText);
    res.json({ cards });
  } catch (err) {
    console.error("Upload error:", err.message);

    if (err.message === "Only PDF files are allowed.") {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: "Failed to process PDF. Please try again." });
  }
});

module.exports = router;
