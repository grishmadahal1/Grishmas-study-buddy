const AppDataSource = require("../database/data-source");
const Session = require("../entities/Session");

class SessionModel {
  /**
   * @returns {import("typeorm").Repository}
   */
  get repo() {
    return AppDataSource.getRepository(Session);
  }

  /**
   * @returns {Promise<Array<{id: number, title: string, cardCount: number, createdAt: Date}>>}
   */
  async findAll() {
    return this.repo.find({
      select: ["id", "title", "cardCount", "createdAt"],
      order: { createdAt: "DESC" },
    });
  }

  /**
   * @param {number} id
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    return this.repo.findOneBy({ id });
  }

  /**
   * @param {string} title
   * @param {Array<{question: string, answer: string}>} cards
   * @returns {Promise<object>}
   */
  async create(title, cards) {
    const session = this.repo.create({
      title,
      cards,
      cardCount: cards.length,
    });
    return this.repo.save(session);
  }

  /**
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const result = await this.repo.delete(id);
    return result.affected > 0;
  }
}

module.exports = new SessionModel();
