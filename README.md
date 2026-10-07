# Online Examination - Survey Answers

A simple full-stack application for submitting and viewing answers in an online examination system.

## Features

- View exam questions
- Submit answers for questions
- Update an existing answer
- View answers submitted by a student for an exam
- Prevent duplicate answers for the same student, exam, and question

## Technologies Used

### Backend
- Node.js
- Express.js
- JavaScript
- JSON file for data storage

### Frontend
- React
- Vite
- JavaScript
- CSS

## Project Structure

```text
online-exam-answer-api/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   ├── server.js
│   │   └── data.json
│   ├── test/
│   └── package.json
│
└── frontend/
    ├── src/
    └── package.json
```

## How to Run

### Backend

```bash
cd backend
npm install
npm start
```

API runs at `http://localhost:3000`.

Run tests:

```bash
npm test
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`). Start the backend first; the Vite dev server proxies `/exam` requests to the API.

## API Overview

- `POST /exam/:examId/answer` — save or update an answer
- `GET /exam/:examId/answers/:studentId` — list answers for a student on an exam

More detail: [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md).
