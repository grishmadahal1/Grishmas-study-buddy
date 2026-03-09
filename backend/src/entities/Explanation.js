const { EntitySchema } = require("typeorm");

/**
 * @typedef {object} Explanation
 * @property {number} id
 * @property {string} question
 * @property {string} answer
 * @property {string} explanation
 * @property {Date} createdAt
 */

const Explanation = new EntitySchema({
  name: "Explanation",
  tableName: "explanations",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    question: {
      type: "text",
      nullable: false,
    },
    answer: {
      type: "text",
      nullable: false,
    },
    explanation: {
      type: "text",
      nullable: false,
    },
    createdAt: {
      name: "created_at",
      type: "timestamp",
      default: () => "NOW()",
    },
  },
  indices: [
    {
      name: "idx_explanations_qa",
      unique: true,
      columns: ["question", "answer"],
    },
  ],
});

module.exports = Explanation;
