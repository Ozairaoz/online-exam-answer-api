const request = require("supertest");
const fs = require("fs");
const path = require("path");

const app = require("../src/server");

const DATA_FILE = path.join(__dirname, "../src/data.json");

beforeEach(() => {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify({ answers: [] }, null, 2)
    );
});

describe("Online Exam Answer API", () => {

    test("Save a new answer", async () => {
        const response = await request(app)
            .post("/exam/EXAM1/answer")
            .send({
                studentId: "S101",
                questionId: "Q25",
                answer: "B",
                timeSpent: 35
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.studentId).toBe("S101");
        expect(response.body.questionId).toBe("Q25");
        expect(response.body.answer).toBe("B");
        expect(response.body.timeSpent).toBe(35);
    });

    test("Change an answer that is already saved", async () => {
        await request(app)
            .post("/exam/EXAM1/answer")
            .send({
                studentId: "S101",
                questionId: "Q25",
                answer: "B",
                timeSpent: 35
            });

        const response = await request(app)
            .post("/exam/EXAM1/answer")
            .send({
                studentId: "S101",
                questionId: "Q25",
                answer: "C",
                timeSpent: 50
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.answer).toBe("C");
        expect(response.body.timeSpent).toBe(50);

        const data = JSON.parse(
            fs.readFileSync(DATA_FILE, "utf-8")
        );

        expect(data.answers).toHaveLength(1);
    });

    test("Sending the same request twice does not create a duplicate", async () => {
        const answer = {
            studentId: "S101",
            questionId: "Q25",
            answer: "B",
            timeSpent: 35
        };

        await request(app)
            .post("/exam/EXAM1/answer")
            .send(answer);

        await request(app)
            .post("/exam/EXAM1/answer")
            .send(answer);

        const data = JSON.parse(
            fs.readFileSync(DATA_FILE, "utf-8")
        );

        expect(data.answers).toHaveLength(1);
    });

    test("Invalid input returns an error", async () => {
        const response = await request(app)
            .post("/exam/EXAM1/answer")
            .send({
                studentId: "S101",
                questionId: "Q25",
                answer: "",
                timeSpent: -5
            });

        expect(response.statusCode).toBe(400);
    });

    test("Read answers only for the requested student and exam", async () => {
        await request(app)
            .post("/exam/EXAM1/answer")
            .send({
                studentId: "S101",
                questionId: "Q1",
                answer: "A",
                timeSpent: 10
            });

        await request(app)
            .post("/exam/EXAM1/answer")
            .send({
                studentId: "S102",
                questionId: "Q2",
                answer: "B",
                timeSpent: 20
            });

        await request(app)
            .post("/exam/EXAM2/answer")
            .send({
                studentId: "S101",
                questionId: "Q3",
                answer: "C",
                timeSpent: 30
            });

        const response = await request(app)
            .get("/exam/EXAM1/answers/S101");

        expect(response.statusCode).toBe(200);

        expect(response.body.answers).toHaveLength(1);
        expect(response.body.answers[0]).toEqual({
            questionId: "Q1",
            answer: "A",
            timeSpent: 10
        });
    });

});