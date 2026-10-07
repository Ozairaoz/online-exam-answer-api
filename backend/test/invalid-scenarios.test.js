/**
 * Table-driven cross-check: invalid inputs must return 4xx/5xx with clear errors.
 */
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

const validPayload = {
    studentId: "S101",
    questionId: "Q1",
    answer: "A",
    timeSpent: 10
};

describe("Invalid input cross-check (POST)", () => {
    const cases = [
        {
            name: "empty JSON body",
            path: "/exam/EXAM1/answer",
            body: {},
            status: 400,
            error: "studentId must be a non-empty string"
        },
        {
            name: "null studentId",
            path: "/exam/EXAM1/answer",
            body: { ...validPayload, studentId: null },
            status: 400,
            error: "studentId must be a non-empty string"
        },
        {
            name: "numeric studentId",
            path: "/exam/EXAM1/answer",
            body: { ...validPayload, studentId: 101 },
            status: 400,
            error: "studentId must be a non-empty string"
        },
        {
            name: "empty questionId",
            path: "/exam/EXAM1/answer",
            body: { ...validPayload, questionId: "" },
            status: 400,
            error: "questionId must be a non-empty string"
        },
        {
            name: "whitespace questionId",
            path: "/exam/EXAM1/answer",
            body: { ...validPayload, questionId: "  \t  " },
            status: 400,
            error: "questionId must be a non-empty string"
        },
        {
            name: "missing answer field",
            path: "/exam/EXAM1/answer",
            body: {
                studentId: "S101",
                questionId: "Q1",
                timeSpent: 5
            },
            status: 400,
            error: "answer must be a non-empty string"
        },
        {
            name: "null answer",
            path: "/exam/EXAM1/answer",
            body: { ...validPayload, answer: null },
            status: 400,
            error: "answer must be a non-empty string"
        },
        {
            name: "boolean answer",
            path: "/exam/EXAM1/answer",
            body: { ...validPayload, answer: true },
            status: 400,
            error: "answer must be a non-empty string"
        },
        {
            name: "null timeSpent",
            path: "/exam/EXAM1/answer",
            body: { ...validPayload, timeSpent: null },
            status: 400,
            error: "timeSpent must be a whole number greater than or equal to 0"
        },
        {
            name: "boolean timeSpent",
            path: "/exam/EXAM1/answer",
            body: { ...validPayload, timeSpent: true },
            status: 400,
            error: "timeSpent must be a whole number greater than or equal to 0"
        },
        {
            name: "NaN timeSpent (invalid JSON number edge)",
            path: "/exam/EXAM1/answer",
            body: { ...validPayload, timeSpent: Number.NaN },
            status: 400,
            error: "timeSpent must be a whole number greater than or equal to 0"
        },
        {
            name: "whitespace-only examId in URL",
            path: "/exam/%20%20/answer",
            body: validPayload,
            status: 400,
            error: "examId is required"
        }
    ];

    test.each(cases)("$name → $status", async ({ path, body, status, error }) => {
        const response = await request(app).post(path).send(body);

        expect(response.statusCode).toBe(status);
        expect(response.body.error).toBe(error);
    });
});

describe("Invalid input cross-check (GET / storage)", () => {
    test("corrupt JSON on read returns 500", async () => {
        fs.writeFileSync(DATA_FILE, "{ broken");

        const response = await request(app).get("/exam/EXAM1/answers/S101");

        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe("Database request failed");
    });
});

describe("Valid input still succeeds after validation tightened", () => {
    test("baseline save works", async () => {
        const response = await request(app)
            .post("/exam/EXAM1/answer")
            .send(validPayload);

        expect(response.statusCode).toBe(201);
    });
});
