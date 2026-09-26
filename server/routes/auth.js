import { Router } from 'express'
import { getDb } from '../db.js'
import {
  verifyPassword,
  safeUser,
  findUserByIdentifier,
  createSession,
  destroySession,
  setSessionCookie,
  clearSessionCookie,
  parseCookies,
  requireAuth,
  SESSION_COOKIE,
} from '../auth.js'

// Stage 4 auth endpoints. Safe user objects only: password hashes and
// raw session tokens never appear in JSON responses.
const router = Router()

router.post('/login', (req, res) => {
  const { identifier, password } = req.body || {}
  if (typeof identifier !== 'string' || identifier === '' || typeof password !== 'string' || password === '') {
    res.status(400).json({ error: 'Identifier and password are required' })
    return
  }
  const db = getDb()
  const user = findUserByIdentifier(db, identifier)
  if (!user || !verifyPassword(password, user.password_hash)) {
    res.status(401).json({ error: 'Invalid login credentials' })
    return
  }
  const token = createSession(db, user.id)
  setSessionCookie(res, token)
  res.json({ user: safeUser(user) })
})

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user })
})

router.post('/logout', (req, res) => {
  const cookies = parseCookies(req)
  destroySession(getDb(), cookies[SESSION_COOKIE])
  clearSessionCookie(res)
  res.json({ ok: true })
})

export default router
