# Online Exam Application

This repo has two parts:

* **`backend/`** — Node.js + Express API
* **`frontend/`** — React app (Vite)

## Backend — run & test

```bash
cd backend
npm install
npm start
```

API: `http://localhost:3000`

```bash
npm test
```

## Frontend — run

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:5173` (proxies `/exam/*` to the backend during development)

## API endpoints

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

### Read answers

```text
GET /exam/:examId/answers/:studentId
```

Example:

```bash
curl http://localhost:3000/exam/EXAM1/answers/S101
```

## Validation

* `examId`, `studentId`, and `questionId` are required
* `answer` must be a non-empty string
* `timeSpent` must be a whole number ≥ 0

Data is stored in `src/data.json`.
