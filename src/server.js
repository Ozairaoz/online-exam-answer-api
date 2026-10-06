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
        const examId = req.params.examId;
        const { studentId, questionId, answer, timeSpent } = req.body;

        if (!examId || !studentId || !questionId) {
            return res.status(400).json({
                error: "examId, studentId and questionId are required"
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
            !Number.isInteger(timeSpent) ||
            timeSpent < 0
        ) {
            return res.status(400).json({
                error: "timeSpent must be a whole number greater than or equal to 0"
            });
        }

        const data = readData();

        const existingAnswer = data.answers.find(
            (item) =>
                item.examId === examId &&
                item.studentId === studentId &&
                item.questionId === questionId
        );

        if (existingAnswer) {
            existingAnswer.answer = answer;
            existingAnswer.timeSpent = timeSpent;

            writeData(data);

            return res.status(200).json(existingAnswer);
        }

        const newAnswer = {
            id: Date.now().toString(),
            examId,
            studentId,
            questionId,
            answer,
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
        const { examId, studentId } = req.params;

        if (!examId || !studentId) {
            return res.status(400).json({
                error: "examId and studentId are required"
            });
        }

        const data = readData();

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

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;