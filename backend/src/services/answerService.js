const { readData, writeData } = require("./storage");

function upsertAnswer(examId, payload) {
    const { studentId, questionId, answer, timeSpent } = payload;

    const trimmedStudentId = studentId.trim();
    const trimmedQuestionId = questionId.trim();
    const trimmedAnswer = answer.trim();

    const data = readData();

    if (!Array.isArray(data.answers)) {
        return { error: "Database request failed", status: 500 };
    }

    const existingAnswer = data.answers.find(
        (item) =>
            item.examId === examId &&
            item.studentId === trimmedStudentId &&
            item.questionId === trimmedQuestionId
    );

    if (existingAnswer) {
        existingAnswer.answer = trimmedAnswer;
        existingAnswer.timeSpent = timeSpent;
        writeData(data);
        return { answer: existingAnswer, status: 200 };
    }

    const newAnswer = {
        id: Date.now().toString(),
        examId,
        studentId: trimmedStudentId,
        questionId: trimmedQuestionId,
        answer: trimmedAnswer,
        timeSpent
    };

    data.answers.push(newAnswer);
    writeData(data);

    return { answer: newAnswer, status: 201 };
}

function getAnswersForStudent(examId, studentId) {
    const data = readData();

    if (!Array.isArray(data.answers)) {
        return { error: "Database request failed", status: 500 };
    }

    const answers = data.answers
        .filter(
            (item) =>
                item.examId === examId && item.studentId === studentId
        )
        .map((item) => ({
            questionId: item.questionId,
            answer: item.answer,
            timeSpent: item.timeSpent
        }));

    return { answers, status: 200 };
}

module.exports = {
    upsertAnswer,
    getAnswersForStudent
};
