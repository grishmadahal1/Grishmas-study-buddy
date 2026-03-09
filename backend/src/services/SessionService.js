const sessionModel = require("../models/SessionModel");
const { ValidationError } = require("./FlashcardService");

class SessionService {
  /**
   * @returns {Array<{id: number, title: string, card_count: number, created_at: string}>}
   */
  getAll() {
    return sessionModel.findAll();
  }

  /**
   * @param {number} id
   * @returns {object}
   * @throws {NotFoundError}
   */
  getById(id) {
    const session = sessionModel.findById(id);
    if (!session) {
      throw new NotFoundError("Session not found.");
    }
    return session;
  }

  /**
   * @param {string} title
   * @param {Array<{question: string, answer: string}>} cards
   * @returns {object}
   * @throws {ValidationError}
   */
  create(title, cards) {
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      throw new ValidationError("Cards are required.");
    }

    const sessionTitle = title || cards[0].question.slice(0, 60) + "...";
    return sessionModel.create(sessionTitle, cards);
  }

  /**
   * @param {number} id
   * @throws {NotFoundError}
   */
  delete(id) {
    const deleted = sessionModel.delete(id);
    if (!deleted) {
      throw new NotFoundError("Session not found.");
    }
  }
}

/**
 * HTTP 404 error for missing resources.
 * @extends Error
 */
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

module.exports = new SessionService();
module.exports.NotFoundError = NotFoundError;
