import express from 'express'
import { migrate, getDb } from './db.js'
import { attachUser } from './auth.js'
import authRoutes from './routes/auth.js'

// QubWatch API (Stage 4): Express + SQLite with session authentication.
// Auth endpoints are live; resource routes arrive in later stages.
// No frontend changes here.
migrate()

const app = express()
app.use(express.json())
app.use(attachUser(getDb()))

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'qubwatch-api' })
})

app.use('/api/auth', authRoutes)

const port = Number(process.env.PORT) || 3001
app.listen(port, () => {
  console.log(`qubwatch-api listening on ${port}`)
})
