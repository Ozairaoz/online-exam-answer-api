const answerService = require("../services/answerService");
const {
    trimParam,
    validateSaveAnswerRequest,
    validateGetAnswersParams
} = require("../utils/validation");

function saveAnswer(req, res) {
    try {
        const examId = trimParam(req.params.examId);
        const validationError = validateSaveAnswerRequest(examId, req.body);

        if (validationError) {
            return res.status(400).json(validationError);
        }

        const result = answerService.upsertAnswer(examId, req.body);

        if (result.error) {
            return res.status(result.status).json({ error: result.error });
        }

        return res.status(result.status).json(result.answer);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Database request failed" });
    }
}

function getAnswers(req, res) {
    try {
        const examId = trimParam(req.params.examId);
        const studentId = trimParam(req.params.studentId);
        const validationError = validateGetAnswersParams(examId, studentId);

        if (validationError) {
            return res.status(400).json(validationError);
        }

        const result = answerService.getAnswersForStudent(examId, studentId);

        if (result.error) {
            return res.status(result.status).json({ error: result.error });
        }

        return res.status(200).json({ answers: result.answers });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Database request failed" });
    }
}

module.exports = {
    saveAnswer,
    getAnswers
};
