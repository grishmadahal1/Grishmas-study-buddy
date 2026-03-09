jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => ({}));
});
jest.mock("../../src/models/SessionModel");

const sessionService = require("../../src/services/SessionService");
const { NotFoundError } = require("../../src/services/SessionService");
const { ValidationError } = require("../../src/services/FlashcardService");
const sessionModel = require("../../src/models/SessionModel");

describe("SessionService", () => {
  afterEach(() => jest.restoreAllMocks());

  const mockCards = [
    { question: "What is Node?", answer: "A JS runtime" },
    { question: "What is Express?", answer: "A web framework" },
  ];

  describe("getAll", () => {
    it("should return all sessions", async () => {
      const mockSessions = [{ id: 1, title: "Test", cardCount: 2 }];
      sessionModel.findAll.mockResolvedValue(mockSessions);

      const result = await sessionService.getAll();

      expect(result).toEqual(mockSessions);
    });
  });

  describe("getById", () => {
    it("should return session when found", async () => {
      const mockSession = { id: 1, title: "Test", cards: mockCards };
      sessionModel.findById.mockResolvedValue(mockSession);

      const result = await sessionService.getById(1);

      expect(result).toEqual(mockSession);
    });

    it("should throw NotFoundError when session does not exist", async () => {
      sessionModel.findById.mockResolvedValue(null);

      await expect(sessionService.getById(999)).rejects.toThrow(NotFoundError);
      await expect(sessionService.getById(999)).rejects.toThrow("Session not found.");
    });
  });

  describe("create", () => {
    it("should create session with provided title", async () => {
      const mockSession = { id: 1, title: "My Session", cards: mockCards, cardCount: 2 };
      sessionModel.create.mockResolvedValue(mockSession);

      const result = await sessionService.create("My Session", mockCards);

      expect(sessionModel.create).toHaveBeenCalledWith("My Session", mockCards);
      expect(result).toEqual(mockSession);
    });

    it("should auto-generate title from first card when no title provided", async () => {
      sessionModel.create.mockResolvedValue({});

      await sessionService.create("", mockCards);

      expect(sessionModel.create).toHaveBeenCalledWith(
        expect.stringContaining("What is Node?"),
        mockCards
      );
    });

    it("should throw ValidationError for empty cards", async () => {
      await expect(sessionService.create("Title", [])).rejects.toThrow(ValidationError);
      await expect(sessionService.create("Title", null)).rejects.toThrow(ValidationError);
      await expect(sessionService.create("Title", "not-array")).rejects.toThrow(ValidationError);
    });
  });

  describe("delete", () => {
    it("should delete when session exists", async () => {
      sessionModel.delete.mockResolvedValue(true);

      await expect(sessionService.delete(1)).resolves.toBeUndefined();
    });

    it("should throw NotFoundError when session does not exist", async () => {
      sessionModel.delete.mockResolvedValue(false);

      await expect(sessionService.delete(999)).rejects.toThrow(NotFoundError);
    });
  });

  describe("NotFoundError", () => {
    it("should have statusCode 404", () => {
      const err = new NotFoundError("not found");
      expect(err.statusCode).toBe(404);
      expect(err.name).toBe("NotFoundError");
    });
  });
});
