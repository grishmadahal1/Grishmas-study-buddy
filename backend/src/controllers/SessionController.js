const sessionService = require("../services/SessionService");

class SessionController {
  /**
   * GET /api/sessions
   */
  async getAll(req, res, next) {
    try {
      const sessions = await sessionService.getAll();
      res.json({ sessions });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/sessions/:id
   */
  async getById(req, res, next) {
    try {
      const session = await sessionService.getById(req.params.id);
      res.json({ session });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/sessions
   */
  async create(req, res, next) {
    try {
      const { title, cards } = req.body;
      const session = await sessionService.create(title, cards);
      res.status(201).json({ session });
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /api/sessions/:id
   */
  async delete(req, res, next) {
    try {
      await sessionService.delete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SessionController();
