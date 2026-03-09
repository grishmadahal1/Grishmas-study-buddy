const { db } = require("../database/connection");

class SessionModel {
  /**
   * @returns {Array<{id: number, title: string, card_count: number, created_at: string}>}
   */
  findAll() {
    return db
      .prepare("SELECT id, title, card_count, created_at FROM sessions ORDER BY created_at DESC")
      .all();
  }

  /**
   * @param {number} id
   * @returns {object | undefined} Session with parsed cards, or undefined
   */
  findById(id) {
    const session = db.prepare("SELECT * FROM sessions WHERE id = ?").get(id);
    if (session) {
      session.cards = JSON.parse(session.cards);
    }
    return session;
  }

  /**
   * @param {string} title
   * @param {Array<{question: string, answer: string}>} cards
   * @returns {object}
   */
  create(title, cards) {
    const result = db
      .prepare("INSERT INTO sessions (title, cards, card_count) VALUES (?, ?, ?)")
      .run(title, JSON.stringify(cards), cards.length);

    return this.findById(result.lastInsertRowid);
  }

  /**
   * @param {number} id
   * @returns {boolean} True if deleted
   */
  delete(id) {
    const result = db.prepare("DELETE FROM sessions WHERE id = ?").run(id);
    return result.changes > 0;
  }
}

module.exports = new SessionModel();
