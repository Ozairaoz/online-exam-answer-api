const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, "data.json");

app.use(express.json());

function readData() {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get("/", (req, res) => {
    res.json({
        message: "Online Exam Answer API is running"
    });
});

app.post("/exam/:examId/answer", (req, res) => {
    try {
        const examId =
            typeof req.params.examId === "string"
                ? req.params.examId.trim()
                : "";
        const { studentId, questionId, answer, timeSpent } = req.body;

        if (!examId) {
            return res.status(400).json({
                error: "examId is required"
            });
        }

        if (
            typeof studentId !== "string" ||
            studentId.trim() === ""
        ) {
            return res.status(400).json({
                error: "studentId must be a non-empty string"
            });
        }

        if (
            typeof questionId !== "string" ||
            questionId.trim() === ""
        ) {
            return res.status(400).json({
                error: "questionId must be a non-empty string"
            });
        }

        if (
            typeof answer !== "string" ||
            answer.trim() === ""
        ) {
            return res.status(400).json({
                error: "answer must be a non-empty string"
            });
        }

        if (
            timeSpent === undefined ||
            timeSpent === null ||
            !Number.isInteger(timeSpent) ||
            timeSpent < 0
        ) {
            return res.status(400).json({
                error: "timeSpent must be a whole number greater than or equal to 0"
            });
        }

        const trimmedStudentId = studentId.trim();
        const trimmedQuestionId = questionId.trim();
        const trimmedAnswer = answer.trim();

        const data = readData();

        if (!Array.isArray(data.answers)) {
            return res.status(500).json({
                error: "Database request failed"
            });
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

            return res.status(200).json(existingAnswer);
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

        return res.status(201).json(newAnswer);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Database request failed"
        });
    }
});

app.get("/exam/:examId/answers/:studentId", (req, res) => {
    try {
        const examId =
            typeof req.params.examId === "string"
                ? req.params.examId.trim()
                : "";
        const studentId =
            typeof req.params.studentId === "string"
                ? req.params.studentId.trim()
                : "";

        if (!examId) {
            return res.status(400).json({
                error: "examId is required"
            });
        }

        if (!studentId) {
            return res.status(400).json({
                error: "studentId is required"
            });
        }

        const data = readData();

        if (!Array.isArray(data.answers)) {
            return res.status(500).json({
                error: "Database request failed"
            });
        }

        const answers = data.answers
            .filter(
                (item) =>
                    item.examId === examId &&
                    item.studentId === studentId
            )
            .map((item) => ({
                questionId: item.questionId,
                answer: item.answer,
                timeSpent: item.timeSpent
            }));

        return res.status(200).json({
            answers
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Database request failed"
        });
    }
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            error: "Request body must be valid JSON"
        });
    }

    console.error(err);
    return res.status(500).json({
        error: "Database request failed"
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;