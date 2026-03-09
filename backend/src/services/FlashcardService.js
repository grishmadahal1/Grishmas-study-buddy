const aiService = require("./AIService");
const pdfParse = require("pdf-parse");
const config = require("../config");

class FlashcardService {
  /**
   * @param {string} text
   * @returns {Promise<Array<{question: string, answer: string}>>}
   * @throws {ValidationError}
   */
  async generateFromText(text) {
    this._validateText(text);
    return aiService.generateFlashcards(text);
  }

  /**
   * @param {Buffer} fileBuffer - Uploaded PDF buffer
   * @returns {Promise<Array<{question: string, answer: string}>>}
   * @throws {ValidationError}
   */
  async generateFromPDF(fileBuffer) {
    const pdfData = await pdfParse(fileBuffer);
    const text = pdfData.text;

    if (!text || text.trim().length === 0) {
      throw new ValidationError("Could not extract text from this PDF.");
    }

    const trimmedText = text.slice(0, config.upload.maxTextLength);
    return aiService.generateFlashcards(trimmedText);
  }

  /**
   * @param {string} text
   * @throws {ValidationError}
   * @private
   */
  _validateText(text) {
    if (!text || text.trim().length === 0) {
      throw new ValidationError("Text is required.");
    }
    if (text.length > config.upload.maxTextLength) {
      throw new ValidationError(
        `Text is too long. Please keep it under ${config.upload.maxTextLength.toLocaleString()} characters.`
      );
    }
  }
}

/**
 * HTTP 400 error for invalid input. Used across all services.
 * @extends Error
 */
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

module.exports = new FlashcardService();
module.exports.ValidationError = ValidationError;
