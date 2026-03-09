const { db } = require("../database/connection");

class ExplanationModel {
  /**
   * @param {string} question
   * @param {string} answer
   * @returns {string|null} Cached explanation or null
   */
  findByCard(question, answer) {
    const row = db
      .prepare("SELECT explanation FROM explanations WHERE question = ? AND answer = ?")
      .get(question, answer);
    return row ? row.explanation : null;
  }

  /**
   * @param {string} question
   * @param {string} answer
   * @param {string} explanation
   */
  create(question, answer, explanation) {
    db.prepare("INSERT OR IGNORE INTO explanations (question, answer, explanation) VALUES (?, ?, ?)")
      .run(question, answer, explanation);
  }
}

module.exports = new ExplanationModel();
