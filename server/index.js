import express from 'express'
import { migrate } from './db.js'

// QubWatch API foundation (Stage 3): Express + SQLite only.
// Health endpoint only in this stage. Login, auth, and resource
// routes arrive in later stages. No frontend changes here.
migrate()

const app = express()
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'qubwatch-api' })
})

const port = Number(process.env.PORT) || 3001
app.listen(port, () => {
  console.log(`qubwatch-api listening on ${port}`)
})
