import { Router } from 'express'
import { getDb } from '../db.js'
import { requireAuth, requireRole } from '../auth.js'
import { TXN_TYPES, discountPct, badRequest, collect, nowStamp } from '../validate.js'
import { newId } from '../ids.js'

const RECORDERS = ['Business Owner', 'Authorized Manager', 'Staff User']

function mapTransaction(row) {
  if (!row) return null
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

const router = Router()
router.use(requireAuth)

router.get('/transactions', (req, res) => {
  const rows = getDb().prepare('SELECT * FROM transactions ORDER BY rowid').all()
  res.json(rows.map(mapTransaction))
})

router.post('/transactions', requireRole(...RECORDERS), (req, res) => {
  const body = req.body || {}
  const quantityOk = typeof body.quantity === 'number' && Number.isFinite(body.quantity) && body.quantity > 0
    ? null
    : 'Must be a number above 0.'
  const errors = collect({
    productId: typeof body.productId === 'string' && body.productId !== '' ? null : 'Product is required.',
    type: TXN_TYPES.includes(body.type) ? null : 'Invalid transaction type.',
    quantity: quantityOk,
    discount: discountPct(body.discount),
  })
  if (errors) {
    badRequest(res, errors)
    return
  }
  const db = getDb()
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(body.productId)
  if (!product) {
    res.status(404).json({ error: 'Product not found' })
    return
  }
  const staffId = body.staffId || req.user.id
  const staff = db.prepare('SELECT id FROM users WHERE id = ?').get(staffId)
  if (!staff) {
    badRequest(res, { staffId: 'Unknown staff user.' })
    return
  }
  // Amount is always recomputed server-side; client previews are not trusted.
  const amount = Math.round(product.price * body.quantity * (1 - (body.discount || 0) / 100))
  const id = newId('txn')
  db.prepare(
    'INSERT INTO transactions (id, date, type, product_id, quantity, amount, staff_id, discount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
  ).run(id, nowStamp(), body.type, body.productId, body.quantity, amount, staffId, body.discount)
  const created = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id)
  res.status(201).json(mapTransaction(created))
})

export default router
