# Survey Answers Frontend

This is the frontend for the Survey Answers API project.

The application allows a student to:
- View questions
- Submit an answer for a question
- Update an existing answer
- View the answers submitted for an exam

## Technologies Used

- React
- Vite
- JavaScript
- CSS

## How to Run

1. Install the dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Ensure the backend API is running at `http://localhost:3000` (from the `backend` folder: `npm install` then `npm start`). The Vite dev server proxies `/exam` requests to the backend.

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Deploy on Render (static site)

1. **New → Static Site** → connect this GitHub repo.
2. **Root Directory:** `frontend`
3. **Build Command:** `npm install && npm run build`
4. **Publish Directory:** `dist`
5. **Environment variable:** `VITE_API_URL` = your backend URL (e.g. `https://your-api.onrender.com`, no trailing slash).
6. On the **backend** service, set `CORS_ORIGIN` to your frontend URL (e.g. `https://your-frontend.onrender.com`) and redeploy.

Rewrite rule for SPA: `/*` → `/index.html` (included via `public/_redirects`).
