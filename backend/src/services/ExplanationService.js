const explanationModel = require("../models/ExplanationModel");
const aiService = require("./AIService");
const { ValidationError } = require("./FlashcardService");

class ExplanationService {
  /**
   * @param {string} question
   * @param {string} answer
   * @returns {Promise<string>} Cached or freshly generated explanation
   * @throws {ValidationError}
   */
  async explain(question, answer) {
    if (!question || !answer) {
      throw new ValidationError("Question and answer are required.");
    }

    // Check cache
    const cached = await explanationModel.findByCard(question, answer);
    if (cached) {
      return cached;
    }

    // Generate, cache, and return
    const explanation = await aiService.explainCard(question, answer);
    await explanationModel.create(question, answer, explanation);
    return explanation;
  }
}

module.exports = new ExplanationService();
