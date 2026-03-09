const { EntitySchema } = require("typeorm");

/**
 * @typedef {object} Session
 * @property {number} id
 * @property {string} title
 * @property {object[]} cards
 * @property {number} cardCount
 * @property {Date} createdAt
 */

const Session = new EntitySchema({
  name: "Session",
  tableName: "sessions",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    title: {
      type: "varchar",
      nullable: false,
    },
    cards: {
      type: "jsonb",
      nullable: false,
    },
    cardCount: {
      name: "card_count",
      type: "int",
      nullable: false,
    },
    createdAt: {
      name: "created_at",
      type: "timestamp",
      default: () => "NOW()",
    },
  },
});

module.exports = Session;
