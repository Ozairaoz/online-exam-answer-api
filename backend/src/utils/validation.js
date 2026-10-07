function trimParam(value) {
    return typeof value === "string" ? value.trim() : "";
}

function validateSaveAnswerRequest(examId, body) {
    const { studentId, questionId, answer, timeSpent } = body;

    if (!examId) {
        return { error: "examId is required" };
    }

    if (typeof studentId !== "string" || studentId.trim() === "") {
        return { error: "studentId must be a non-empty string" };
    }

    if (typeof questionId !== "string" || questionId.trim() === "") {
        return { error: "questionId must be a non-empty string" };
    }

    if (typeof answer !== "string" || answer.trim() === "") {
        return { error: "answer must be a non-empty string" };
    }

    if (
        timeSpent === undefined ||
        timeSpent === null ||
        !Number.isInteger(timeSpent) ||
        timeSpent < 0
    ) {
        return {
            error:
                "timeSpent must be a whole number greater than or equal to 0"
        };
    }

    return null;
}

function validateGetAnswersParams(examId, studentId) {
    if (!examId) {
        return { error: "examId is required" };
    }

    if (!studentId) {
        return { error: "studentId is required" };
    }

    return null;
}

module.exports = {
    trimParam,
    validateSaveAnswerRequest,
    validateGetAnswersParams
};
