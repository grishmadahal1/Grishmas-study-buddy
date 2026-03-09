const sessionService = require("../services/SessionService");

class SessionController {
  /**
   * GET /api/sessions
   */
  getAll(req, res, next) {
    try {
      const sessions = sessionService.getAll();
      res.json({ sessions });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/sessions/:id
   */
  getById(req, res, next) {
    try {
      const session = sessionService.getById(req.params.id);
      res.json({ session });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/sessions
   */
  create(req, res, next) {
    try {
      const { title, cards } = req.body;
      const session = sessionService.create(title, cards);
      res.status(201).json({ session });
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /api/sessions/:id
   */
  delete(req, res, next) {
    try {
      sessionService.delete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SessionController();
