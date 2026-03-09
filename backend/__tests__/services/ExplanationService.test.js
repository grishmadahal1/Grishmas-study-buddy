const explanationService = require("../../src/services/ExplanationService");
const { ValidationError } = require("../../src/services/FlashcardService");
const explanationModel = require("../../src/models/ExplanationModel");
const aiService = require("../../src/services/AIService");

jest.mock("../../src/models/ExplanationModel");
jest.mock("../../src/services/AIService");

describe("ExplanationService", () => {
  afterEach(() => jest.restoreAllMocks());

  const question = "What is closure?";
  const answer = "A function with access to its outer scope";

  describe("explain", () => {
    it("should return cached explanation if available", async () => {
      explanationModel.findByCard.mockResolvedValue("Cached explanation");

      const result = await explanationService.explain(question, answer);

      expect(result).toBe("Cached explanation");
      expect(aiService.explainCard).not.toHaveBeenCalled();
      expect(explanationModel.create).not.toHaveBeenCalled();
    });

    it("should generate and cache explanation when not cached", async () => {
      explanationModel.findByCard.mockResolvedValue(null);
      aiService.explainCard.mockResolvedValue("AI generated explanation");
      explanationModel.create.mockResolvedValue();

      const result = await explanationService.explain(question, answer);

      expect(result).toBe("AI generated explanation");
      expect(aiService.explainCard).toHaveBeenCalledWith(question, answer);
      expect(explanationModel.create).toHaveBeenCalledWith(
        question,
        answer,
        "AI generated explanation"
      );
    });

    it("should throw ValidationError when question is missing", async () => {
      await expect(explanationService.explain("", answer)).rejects.toThrow(ValidationError);
      await expect(explanationService.explain(null, answer)).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError when answer is missing", async () => {
      await expect(explanationService.explain(question, "")).rejects.toThrow(ValidationError);
      await expect(explanationService.explain(question, null)).rejects.toThrow(ValidationError);
    });
  });
});
