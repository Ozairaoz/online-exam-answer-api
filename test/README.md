# Online Exam Answer API

A simple Node.js and Express backend for saving and reading student answers during an online exam.

## Technologies

* Node.js
* Express
* Local JSON file for data storage
* Jest
* Supertest

## Project Structure

```text
assignment/
├── src/
│   ├── server.js
│   └── data.json
├── test/
│   └── answers.test.js
├── package.json
├── package-lock.json
└── README.md
```

## How to Run

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

The API runs at:

```text
http://localhost:3000
```

## How to Run Tests

Run:

```bash
npm test
```

The automated tests cover:

1. Saving a new answer
2. Changing an existing answer
3. Sending the same request twice without creating a duplicate
4. Invalid input
5. Reading answers only for the requested student and exam

## API Endpoints

### Save or update an answer

```text
POST /exam/:examId/answer
```

Example:

```bash
curl -X POST http://localhost:3000/exam/EXAM1/answer \
-H "Content-Type: application/json" \
-d "{\"studentId\":\"S101\",\"questionId\":\"Q25\",\"answer\":\"B\",\"timeSpent\":35}"
```

The combination of `examId`, `studentId`, and `questionId` identifies one saved answer.

If the answer already exists, it is updated instead of creating a duplicate.

### Read answers

```text
GET /exam/:examId/answers/:studentId
```

Example:

```bash
curl http://localhost:3000/exam/EXAM1/answers/S101
```

The response contains only answers belonging to the requested exam and student.

## Validation

The API validates:

* `examId` must be present
* `studentId` must be present
* `questionId` must be present
* `answer` must be a non-empty string
* `timeSpent` must be a whole number greater than or equal to zero

When an existing answer is updated, the new `answer` and `timeSpent` replace the previous values.

## Data Storage

For this assignment, answers are stored in `src/data.json`.

A local JSON file was chosen to keep the project simple and easy to run without requiring a separate database installation or cloud configuration.

For a production system, DynamoDB would be a better choice because it provides persistent database storage and can enforce/query records using appropriate keys.

## Assumptions

* Sample IDs such as `EXAM1`, `S101`, and `Q25` are used.
* Authentication and authorization are outside the scope of the assignment.
* The application is intended to run locally.
* The JSON file acts as a simple database for this assignment.

## AI Usage

ChatGPT was used as a coding assistant to help design the API structure, write initial code, create automated tests, and explain the implementation.

The generated code was checked by running the application manually with cURL and by running the automated Jest tests. The implementation was also reviewed to verify the assignment requirements, including validation, answer updates, duplicate prevention, and filtering by student and exam.

## Known Limitation

The current implementation uses a local JSON file instead of DynamoDB. This keeps the assignment easy to run locally but does not provide the concurrency, durability, or database-level uniqueness guarantees of a production database.
