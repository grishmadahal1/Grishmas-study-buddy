const explanationService = require("../services/ExplanationService");

class ExplanationController {
  /**
   * POST /api/explain
   */
  async explain(req, res, next) {
    try {
      const { question, answer } = req.body;
      const explanation = await explanationService.explain(question, answer);
      res.json({ explanation });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ExplanationController();
