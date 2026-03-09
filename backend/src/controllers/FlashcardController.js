const flashcardService = require("../services/FlashcardService");

class FlashcardController {
  /**
   * POST /api/generate — Create flashcards from raw text.
   */
  async generateFromText(req, res, next) {
    try {
      const cards = await flashcardService.generateFromText(req.body.text);
      res.json({ cards });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/upload — Create flashcards from an uploaded PDF.
   */
  async generateFromPDF(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No PDF file uploaded." });
      }

      const cards = await flashcardService.generateFromPDF(req.file.buffer);
      res.json({ cards });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new FlashcardController();
