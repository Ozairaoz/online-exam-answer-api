import { useState } from 'react'
import { apiUrl } from './api'
import './App.css'

const initialForm = {
  examId: 'EXAM1',
  studentId: 'S101',
  questionId: 'Q25',
  answer: '',
  timeSpent: '0',
}

function App() {
  const [form, setForm] = useState(initialForm)
  const [answers, setAnswers] = useState([])
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    setStatus('')
    setLoading(true)

    const timeSpent = Number(form.timeSpent)
    if (!Number.isInteger(timeSpent) || timeSpent < 0) {
      setLoading(false)
      setError('timeSpent must be a whole number greater than or equal to 0')
      return
    }

    try {
      const res = await fetch(
        apiUrl(`/exam/${encodeURIComponent(form.examId)}/answer`),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: form.studentId.trim(),
            questionId: form.questionId.trim(),
            answer: form.answer,
            timeSpent,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save answer')
      }

      setStatus(
        res.status === 201
          ? 'Answer saved successfully.'
          : 'Answer updated successfully.'
      )
    } catch (err) {
      setError(err.message || 'Failed to save answer')
    } finally {
      setLoading(false)
    }
  }

  async function handleLoadAnswers() {
    setError('')
    setStatus('')
    setLoading(true)

    try {
      const res = await fetch(
        apiUrl(
          `/exam/${encodeURIComponent(form.examId)}/answers/${encodeURIComponent(form.studentId.trim())}`
        )
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load answers')
      }

      setAnswers(data.answers ?? [])
      setStatus(`Loaded ${data.answers?.length ?? 0} answer(s).`)
    } catch (err) {
      setAnswers([])
      setError(err.message || 'Failed to load answers')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Online Exam Answers</h1>
        <p>Save answers to the backend and retrieve them by exam and student.</p>
      </header>

      {error && <p className="message error" role="alert">{error}</p>}
      {status && !error && <p className="message success">{status}</p>}

      <form className="card" onSubmit={handleSave}>
        <h2>Save or update answer</h2>

        <div className="field-row">
          <label>
            Exam ID
            <input
              value={form.examId}
              onChange={(e) => updateField('examId', e.target.value)}
              required
            />
          </label>
          <label>
            Student ID
            <input
              value={form.studentId}
              onChange={(e) => updateField('studentId', e.target.value)}
              required
            />
          </label>
        </div>

        <div className="field-row">
          <label>
            Question ID
            <input
              value={form.questionId}
              onChange={(e) => updateField('questionId', e.target.value)}
              required
            />
          </label>
          <label>
            Time spent (seconds)
            <input
              type="number"
              min="0"
              step="1"
              value={form.timeSpent}
              onChange={(e) => updateField('timeSpent', e.target.value)}
              required
            />
          </label>
        </div>

        <label>
          Answer
          <input
            value={form.answer}
            onChange={(e) => updateField('answer', e.target.value)}
            placeholder="e.g. B"
            required
          />
        </label>

        <div className="actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Working…' : 'Save answer'}
          </button>
          <button
            type="button"
            className="secondary"
            disabled={loading}
            onClick={handleLoadAnswers}
          >
            Load my answers
          </button>
        </div>
      </form>

      <section className="card">
        <h2>Saved answers</h2>
        {answers.length === 0 ? (
          <p className="muted">No answers loaded yet. Use “Load my answers”.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Answer</th>
                <th>Time (s)</th>
              </tr>
            </thead>
            <tbody>
              {answers.map((row) => (
                <tr key={row.questionId}>
                  <td>{row.questionId}</td>
                  <td>{row.answer}</td>
                  <td>{row.timeSpent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <p className="hint">
        Local dev: run the API on port 3000 and <code>npm run dev</code> (Vite
        proxies <code>/exam</code>). On Render, set <code>VITE_API_URL</code> to
        your backend URL.
      </p>
    </div>
  )
}

export default App
