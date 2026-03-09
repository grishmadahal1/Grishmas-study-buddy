const express = require("express");
const router = express.Router();
const flashcardController = require("../controllers/FlashcardController");
const upload = require("../middleware/upload");

router.post(
  "/generate",
  (req, res, next) => flashcardController.generateFromText(req, res, next)
);

router.post(
  "/upload",
  upload.single("file"),
  (req, res, next) => flashcardController.generateFromPDF(req, res, next)
);

module.exports = router;
