const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/SessionController");

router.get("/", (req, res, next) => sessionController.getAll(req, res, next));
router.get("/:id", (req, res, next) => sessionController.getById(req, res, next));
router.post("/", (req, res, next) => sessionController.create(req, res, next));
router.delete("/:id", (req, res, next) => sessionController.delete(req, res, next));

module.exports = router;
