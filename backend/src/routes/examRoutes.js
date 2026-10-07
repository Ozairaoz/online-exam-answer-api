const express = require("express");
const examController = require("../controllers/examController");

const router = express.Router();

router.post("/:examId/answer", examController.saveAnswer);
router.get("/:examId/answers/:studentId", examController.getAnswers);

module.exports = router;
