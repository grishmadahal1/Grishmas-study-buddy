const AppDataSource = require("../database/data-source");
const Explanation = require("../entities/Explanation");

class ExplanationModel {
  /**
   * @returns {import("typeorm").Repository}
   */
  get repo() {
    return AppDataSource.getRepository(Explanation);
  }

  /**
   * @param {string} question
   * @param {string} answer
   * @returns {Promise<string|null>}
   */
  async findByCard(question, answer) {
    const row = await this.repo.findOneBy({ question, answer });
    return row ? row.explanation : null;
  }

  /**
   * @param {string} question
   * @param {string} answer
   * @param {string} explanation
   * @returns {Promise<void>}
   */
  async create(question, answer, explanation) {
    await this.repo
      .createQueryBuilder()
      .insert()
      .values({ question, answer, explanation })
      .orIgnore()
      .execute();
  }
}

module.exports = new ExplanationModel();
