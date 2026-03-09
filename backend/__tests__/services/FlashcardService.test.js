jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => ({}));
});
jest.mock("../../src/services/AIService");

const flashcardService = require("../../src/services/FlashcardService");
const { ValidationError } = require("../../src/services/FlashcardService");
const aiService = require("../../src/services/AIService");

describe("FlashcardService", () => {
  afterEach(() => jest.restoreAllMocks());

  describe("generateFromText", () => {
    it("should call AI service with valid text", async () => {
      const mockCards = [{ question: "Q1", answer: "A1" }];
      aiService.generateFlashcards.mockResolvedValue(mockCards);

      const result = await flashcardService.generateFromText("Some study notes");

      expect(aiService.generateFlashcards).toHaveBeenCalledWith("Some study notes");
      expect(result).toEqual(mockCards);
    });

    it("should throw ValidationError for empty text", async () => {
      await expect(flashcardService.generateFromText("")).rejects.toThrow(ValidationError);
      await expect(flashcardService.generateFromText("   ")).rejects.toThrow("Text is required.");
    });

    it("should throw ValidationError for null/undefined text", async () => {
      await expect(flashcardService.generateFromText(null)).rejects.toThrow(ValidationError);
      await expect(flashcardService.generateFromText(undefined)).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError for text exceeding max length", async () => {
      const longText = "a".repeat(15001);
      await expect(flashcardService.generateFromText(longText)).rejects.toThrow(
        "Text is too long"
      );
    });

    it("should accept text at exactly max length", async () => {
      const text = "a".repeat(15000);
      aiService.generateFlashcards.mockResolvedValue([]);

      await flashcardService.generateFromText(text);

      expect(aiService.generateFlashcards).toHaveBeenCalledWith(text);
    });
  });

  describe("ValidationError", () => {
    it("should have statusCode 400", () => {
      const err = new ValidationError("bad input");
      expect(err.statusCode).toBe(400);
      expect(err.name).toBe("ValidationError");
      expect(err.message).toBe("bad input");
    });
  });
});
