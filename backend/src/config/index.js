const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

/** @type {Readonly<{port: number, db: {path: string}, openai: {apiKey: string, model: string, temperature: number}, upload: {maxFileSize: number, maxTextLength: number, allowedMimeTypes: string[]}}>} */
const config = Object.freeze({
  port: parseInt(process.env.PORT, 10) || 5000,
  db: {
    path: path.join(__dirname, "../../flashcards.db"),
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-3.5-turbo",
    temperature: 0.7,
  },
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxTextLength: 15000,
    allowedMimeTypes: ["application/pdf"],
  },
});

module.exports = config;
