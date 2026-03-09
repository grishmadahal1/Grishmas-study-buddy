const Database = require("better-sqlite3");
const config = require("../config");

class DatabaseConnection {
  constructor() {
    if (DatabaseConnection._instance) {
      return DatabaseConnection._instance;
    }

    this._db = new Database(config.db.path);
    this._db.pragma("journal_mode = WAL");
    this._runMigrations();

    DatabaseConnection._instance = this;
  }

  /**
   * @returns {import("better-sqlite3").Database}
   */
  get db() {
    return this._db;
  }

  /**
   * @private Creates tables and indexes if they don't exist.
   */
  _runMigrations() {
    this._db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        cards TEXT NOT NULL,
        card_count INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    this._db.exec(`
      CREATE TABLE IF NOT EXISTS explanations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        explanation TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    this._db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_explanations_qa
      ON explanations (question, answer)
    `);
  }
}

module.exports = new DatabaseConnection();
