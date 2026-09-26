import { Router } from 'express'
import { getDb } from '../db.js'
import { requireAuth, requireRole } from '../auth.js'
import { ALERT_STATUSES, badRequest, collect, nowStamp } from '../validate.js'
import { evaluateRules, DEMO_THRESHOLDS } from '../../shared/rules.js'

const MANAGERS = ['Business Owner', 'Authorized Manager']

function mapProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    stock: row.stock,
    expectedStock: row.expected_stock,
  }
}

function mapTransaction(row) {
  return {
    id: row.id,
    date: row.date,
    type: row.type,
    productId: row.product_id,
    quantity: row.quantity,
    amount: row.amount,
    staffId: row.staff_id,
    discount: row.discount,
  }
}

function loadThresholds(db) {
  const row = db.prepare('SELECT * FROM rule_config WHERE id = 1').get()
  const source = row || {}
  const defaults = DEMO_THRESHOLDS
  return {
    LARGE_TRANSACTION_AMOUNT: source.large_amount ?? defaults.LARGE_TRANSACTION_AMOUNT,
    REPEATED_REFUNDS_COUNT: source.refund_count ?? defaults.REPEATED_REFUNDS_COUNT,
    REPEATED_REFUNDS_WINDOW_MINUTES:
      source.refund_window_minutes ?? defaults.REPEATED_REFUNDS_WINDOW_MINUTES,
    EXCESSIVE_DISCOUNT_PCT: source.discount_pct ?? defaults.EXCESSIVE_DISCOUNT_PCT,
    FREQUENCY_COUNT: source.freq_count ?? defaults.FREQUENCY_COUNT,
    FREQUENCY_WINDOW_MINUTES: source.freq_window_minutes ?? defaults.FREQUENCY_WINDOW_MINUTES,
  }
}

// Alerts stay derived: re-evaluated from stored transactions on every read,
// with persisted statuses joined in. Exported for the investigations routes.
export function deriveAlerts(db) {
  const products = db.prepare('SELECT * FROM products ORDER BY rowid').all().map(mapProduct)
  const transactions = db.prepare('SELECT * FROM transactions ORDER BY rowid').all().map(mapTransaction)
  const base = evaluateRules(products, transactions, loadThresholds(db))
  const statuses = Object.fromEntries(
    db.prepare('SELECT alert_id, status FROM alert_statuses').all().map((r) => [r.alert_id, r.status]),
  )
  return base.map((a) => ({ ...a, status: statuses[a.id] || 'New' }))
}

const router = Router()
router.use(requireAuth)

router.get('/alerts', (req, res) => {
  res.json(deriveAlerts(getDb()))
})

router.patch('/alerts/:id/status', requireRole(...MANAGERS), (req, res) => {
  const body = req.body || {}
  const errors = collect({
    status: ALERT_STATUSES.includes(body.status) ? null : 'Invalid alert status.',
  })
  if (errors) {
    badRequest(res, errors)
    return
  }
  const db = getDb()
  const alert = deriveAlerts(db).find((a) => a.id === req.params.id)
  if (!alert) {
    res.status(404).json({ error: 'Alert not found' })
    return
  }
  db.prepare(
    `INSERT INTO alert_statuses (alert_id, status, updated_by, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(alert_id) DO UPDATE SET status = excluded.status, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
  ).run(req.params.id, body.status, req.user.id, nowStamp())
  const updated = deriveAlerts(db).find((a) => a.id === req.params.id)
  res.json(updated)
})

export default router
