const request = require("supertest");

// Mock TypeORM data source before requiring app
jest.mock("../../src/database/data-source", () => ({
  getRepository: jest.fn(),
  initialize: jest.fn().mockResolvedValue(true),
  isInitialized: true,
}));

jest.mock("../../src/models/SessionModel");
jest.mock("../../src/models/ExplanationModel");
jest.mock("../../src/services/AIService");

const app = require("../../src/app").express;
const sessionModel = require("../../src/models/SessionModel");
const aiService = require("../../src/services/AIService");

describe("API Integration", () => {
  afterEach(() => jest.restoreAllMocks());

  describe("GET /api/health", () => {
    it("should return status ok", async () => {
      const res = await request(app).get("/api/health");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: "ok" });
    });
  });

  describe("GET /api/sessions", () => {
    it("should return list of sessions", async () => {
      sessionModel.findAll.mockResolvedValue([
        { id: 1, title: "Test", cardCount: 3, createdAt: "2026-01-01" },
      ]);

      const res = await request(app).get("/api/sessions");

      expect(res.status).toBe(200);
      expect(res.body.sessions).toHaveLength(1);
      expect(res.body.sessions[0].title).toBe("Test");
    });
  });

  describe("GET /api/sessions/:id", () => {
    it("should return session by id", async () => {
      sessionModel.findById.mockResolvedValue({
        id: 1,
        title: "Test",
        cards: [{ question: "Q", answer: "A" }],
      });

      const res = await request(app).get("/api/sessions/1");

      expect(res.status).toBe(200);
      expect(res.body.session.cards).toHaveLength(1);
    });

    it("should return 404 for non-existent session", async () => {
      sessionModel.findById.mockResolvedValue(null);

      const res = await request(app).get("/api/sessions/999");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Session not found.");
    });
  });

  describe("POST /api/sessions", () => {
    it("should create a session", async () => {
      const cards = [{ question: "Q1", answer: "A1" }];
      sessionModel.create.mockResolvedValue({
        id: 1,
        title: "Q1...",
        cards,
        cardCount: 1,
      });

      const res = await request(app)
        .post("/api/sessions")
        .send({ title: "", cards });

      expect(res.status).toBe(201);
      expect(res.body.session.cardCount).toBe(1);
    });

    it("should return 400 for empty cards", async () => {
      const res = await request(app)
        .post("/api/sessions")
        .send({ title: "Test", cards: [] });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Cards are required.");
    });
  });

  describe("DELETE /api/sessions/:id", () => {
    it("should delete a session", async () => {
      sessionModel.delete.mockResolvedValue(true);

      const res = await request(app).delete("/api/sessions/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should return 404 for non-existent session", async () => {
      sessionModel.delete.mockResolvedValue(false);

      const res = await request(app).delete("/api/sessions/999");

      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/generate", () => {
    it("should generate flashcards from text", async () => {
      const mockCards = [{ question: "Q", answer: "A" }];
      aiService.generateFlashcards.mockResolvedValue(mockCards);

      const res = await request(app)
        .post("/api/generate")
        .send({ text: "Some study notes about JavaScript" });

      expect(res.status).toBe(200);
      expect(res.body.cards).toEqual(mockCards);
    });

    it("should return 400 for empty text", async () => {
      const res = await request(app)
        .post("/api/generate")
        .send({ text: "" });

      expect(res.status).toBe(400);
    });
  });
});
