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

    describe("POST /exam/:examId/answer — success scenarios", () => {

        test("saves a new answer with 201", async () => {
            const response = await request(app)
                .post("/exam/EXAM1/answer")
                .send({
                    studentId: "S101",
                    questionId: "Q25",
                    answer: "B",
                    timeSpent: 35
                });

            expect(response.statusCode).toBe(201);
            expect(response.body).toMatchObject({
                examId: "EXAM1",
                studentId: "S101",
                questionId: "Q25",
                answer: "B",
                timeSpent: 35
            });
            expect(response.body.id).toBeDefined();
        });

        test("updates an existing answer with 200", async () => {
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

        test("identical POST twice does not create a duplicate", async () => {
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

        test("trims whitespace from string fields", async () => {
            const response = await request(app)
                .post("/exam/EXAM1/answer")
                .send({
                    studentId: "  S101  ",
                    questionId: "  Q25  ",
                    answer: "  B  ",
                    timeSpent: 10
                });

            expect(response.statusCode).toBe(201);
            expect(response.body).toMatchObject({
                studentId: "S101",
                questionId: "Q25",
                answer: "B"
            });
        });

        test("allows timeSpent of 0", async () => {
            const response = await request(app)
                .post("/exam/EXAM1/answer")
                .send({
                    studentId: "S101",
                    questionId: "Q1",
                    answer: "A",
                    timeSpent: 0
                });

            expect(response.statusCode).toBe(201);
            expect(response.body.timeSpent).toBe(0);
        });
    });

    describe("POST /exam/:examId/answer — validation", () => {

        test("rejects missing studentId", async () => {
            const response = await request(app)
                .post("/exam/EXAM1/answer")
                .send({
                    questionId: "Q25",
                    answer: "B",
                    timeSpent: 35
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe(
                "studentId must be a non-empty string"
            );
        });

        test("rejects empty studentId", async () => {
            const response = await request(app)
                .post("/exam/EXAM1/answer")
                .send({
                    studentId: "   ",
                    questionId: "Q25",
                    answer: "B",
                    timeSpent: 35
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe(
                "studentId must be a non-empty string"
            );
        });

        test("rejects missing questionId", async () => {
            const response = await request(app)
                .post("/exam/EXAM1/answer")
                .send({
                    studentId: "S101",
                    answer: "B",
                    timeSpent: 35
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe(
                "questionId must be a non-empty string"
            );
        });

        test("rejects empty answer", async () => {
            const response = await request(app)
                .post("/exam/EXAM1/answer")
                .send({
                    studentId: "S101",
                    questionId: "Q25",
                    answer: "",
                    timeSpent: 35
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe(
                "answer must be a non-empty string"
            );
        });

        test("rejects whitespace-only answer", async () => {
            const response = await request(app)
                .post("/exam/EXAM1/answer")
                .send({
                    studentId: "S101",
                    questionId: "Q25",
                    answer: "   ",
                    timeSpent: 35
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe(
                "answer must be a non-empty string"
            );
        });

        test("rejects non-string answer", async () => {
            const response = await request(app)
                .post("/exam/EXAM1/answer")
                .send({
                    studentId: "S101",
                    questionId: "Q25",
                    answer: 42,
                    timeSpent: 35
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe(
                "answer must be a non-empty string"
            );
        });

        test("rejects missing timeSpent", async () => {
            const response = await request(app)
                .post("/exam/EXAM1/answer")
                .send({
                    studentId: "S101",
                    questionId: "Q25",
                    answer: "B"
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe(
                "timeSpent must be a whole number greater than or equal to 0"
            );
        });

        test("rejects negative timeSpent", async () => {
            const response = await request(app)
                .post("/exam/EXAM1/answer")
                .send({
                    studentId: "S101",
                    questionId: "Q25",
                    answer: "B",
                    timeSpent: -5
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe(
                "timeSpent must be a whole number greater than or equal to 0"
            );
        });

        test("rejects non-integer timeSpent", async () => {
            const response = await request(app)
                .post("/exam/EXAM1/answer")
                .send({
                    studentId: "S101",
                    questionId: "Q25",
                    answer: "B",
                    timeSpent: 12.5
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe(
                "timeSpent must be a whole number greater than or equal to 0"
            );
        });

        test("rejects string timeSpent", async () => {
            const response = await request(app)
                .post("/exam/EXAM1/answer")
                .send({
                    studentId: "S101",
                    questionId: "Q25",
                    answer: "B",
                    timeSpent: "35"
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe(
                "timeSpent must be a whole number greater than or equal to 0"
            );
        });

        test("rejects invalid JSON body", async () => {
            const response = await request(app)
                .post("/exam/EXAM1/answer")
                .set("Content-Type", "application/json")
                .send("{ not valid json");

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe(
                "Request body must be valid JSON"
            );
        });
    });

    describe("GET /exam/:examId/answers/:studentId", () => {

        test("returns only answers for the requested exam and student", async () => {
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

        test("returns empty array when student has no answers", async () => {
            const response = await request(app)
                .get("/exam/EXAM1/answers/S999");

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ answers: [] });
        });

        test("returns multiple answers for the same student on one exam", async () => {
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
                    studentId: "S101",
                    questionId: "Q2",
                    answer: "B",
                    timeSpent: 20
                });

            const response = await request(app)
                .get("/exam/EXAM1/answers/S101");

            expect(response.statusCode).toBe(200);
            expect(response.body.answers).toHaveLength(2);
        });
    });

    describe("error handling — data file", () => {

        test("returns 500 when data file contains invalid JSON", async () => {
            fs.writeFileSync(DATA_FILE, "not-json");

            const response = await request(app)
                .post("/exam/EXAM1/answer")
                .send({
                    studentId: "S101",
                    questionId: "Q25",
                    answer: "B",
                    timeSpent: 35
                });

            expect(response.statusCode).toBe(500);
            expect(response.body.error).toBe("Database request failed");
        });

        test("returns 500 when answers array is missing from data file", async () => {
            fs.writeFileSync(DATA_FILE, JSON.stringify({}));

            const response = await request(app)
                .get("/exam/EXAM1/answers/S101");

            expect(response.statusCode).toBe(500);
            expect(response.body.error).toBe("Database request failed");
        });
    });

    describe("GET / — health check", () => {

        test("reports API is running", async () => {
            const response = await request(app).get("/");

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe(
                "Online Exam Answer API is running"
            );
        });
    });
});
