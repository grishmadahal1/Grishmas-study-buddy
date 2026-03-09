const sessionModel = require("../models/SessionModel");
const { ValidationError } = require("./FlashcardService");

class SessionService {
  /**
   * @returns {Promise<Array<{id: number, title: string, cardCount: number, createdAt: Date}>>}
   */
  async getAll() {
    return sessionModel.findAll();
  }

  /**
   * @param {number} id
   * @returns {Promise<object>}
   * @throws {NotFoundError}
   */
  async getById(id) {
    const session = await sessionModel.findById(id);
    if (!session) {
      throw new NotFoundError("Session not found.");
    }
    return session;
  }

  /**
   * @param {string} title
   * @param {Array<{question: string, answer: string}>} cards
   * @returns {Promise<object>}
   * @throws {ValidationError}
   */
  async create(title, cards) {
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      throw new ValidationError("Cards are required.");
    }

    const sessionTitle = title || cards[0].question.slice(0, 60) + "...";
    return sessionModel.create(sessionTitle, cards);
  }

  /**
   * @param {number} id
   * @returns {Promise<void>}
   * @throws {NotFoundError}
   */
  async delete(id) {
    const deleted = await sessionModel.delete(id);
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
