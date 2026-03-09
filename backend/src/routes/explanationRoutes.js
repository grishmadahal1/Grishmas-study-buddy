const express = require("express");
const router = express.Router();
const explanationController = require("../controllers/ExplanationController");

router.post("/", (req, res, next) => explanationController.explain(req, res, next));

module.exports = router;
