import { Router } from 'express'
import { getDb } from '../db.js'
import { requireAuth, requireRole } from '../auth.js'

const MANAGERS = ['Business Owner', 'Authorized Manager']

const router = Router()
router.use(requireAuth)

router.get('/audit', requireRole(...MANAGERS), (req, res) => {
  const db = getDb()
  let rows
  if (req.query.investigationId) {
    rows = db
      .prepare('SELECT * FROM audit WHERE investigation_id = ? ORDER BY rowid')
      .all(req.query.investigationId)
  } else {
    rows = db.prepare('SELECT * FROM audit ORDER BY rowid').all()
  }
  res.json(
    rows.map((r) => ({
      id: r.id,
      investigationId: r.investigation_id,
      userId: r.user_id,
      action: r.action,
      date: r.date,
    })),
  )
})

export default router
