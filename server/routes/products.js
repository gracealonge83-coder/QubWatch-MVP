import { Router } from 'express'
import { getDb } from '../db.js'
import { requireAuth, requireRole } from '../auth.js'
import { requiredText, positiveNumber, nonNegativeInt, badRequest, collect } from '../validate.js'
import { newId } from '../ids.js'

const MANAGERS = ['Business Owner', 'Authorized Manager']

function mapProduct(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    stock: row.stock,
    expectedStock: row.expected_stock,
  }
}

const router = Router()
router.use(requireAuth)

router.get('/products', (req, res) => {
  const rows = getDb().prepare('SELECT * FROM products ORDER BY rowid').all()
  res.json(rows.map(mapProduct))
})

router.post('/products', requireRole(...MANAGERS), (req, res) => {
  const body = req.body || {}
  const errors = collect({
    name: requiredText(body.name),
    category: requiredText(body.category),
    price: positiveNumber(body.price),
    stock: nonNegativeInt(body.stock),
  })
  if (errors) {
    badRequest(res, errors)
    return
  }
  const db = getDb()
  const id = newId('prod')
  // New products start with expected stock equal to recorded stock,
  // exactly like the current frontend behavior.
  db.prepare(
    'INSERT INTO products (id, name, category, price, stock, expected_stock) VALUES (?, ?, ?, ?, ?, ?)',
  ).run(id, body.name.trim(), body.category.trim(), body.price, body.stock, body.stock)
  const created = db.prepare('SELECT * FROM products WHERE id = ?').get(id)
  res.status(201).json(mapProduct(created))
})

router.patch('/products/:id', requireRole(...MANAGERS), (req, res) => {
  const body = req.body || {}
  const updates = {}
  for (const key of ['name', 'category', 'price', 'stock']) {
    if (body[key] !== undefined) updates[key] = body[key]
  }
  const errors = collect({
    ...('name' in updates ? { name: requiredText(updates.name) } : {}),
    ...('category' in updates ? { category: requiredText(updates.category) } : {}),
    ...('price' in updates ? { price: positiveNumber(updates.price) } : {}),
    ...('stock' in updates ? { stock: nonNegativeInt(updates.stock) } : {}),
  })
  if (errors) {
    badRequest(res, errors)
    return
  }
  if (Object.keys(updates).length === 0) {
    badRequest(res, { _body: 'Provide fields to update.' })
    return
  }
  const db = getDb()
  const current = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
  if (!current) {
    res.status(404).json({ error: 'Product not found' })
    return
  }
  const merged = { ...mapProduct(current), ...updates }
  if (merged.name) merged.name = merged.name.trim()
  if (merged.category) merged.category = merged.category.trim()
  // expectedStock intentionally untouched: editing stock can create an
  // inventory discrepancy, exactly like the current frontend behavior.
  db.prepare('UPDATE products SET name = ?, category = ?, price = ?, stock = ? WHERE id = ?').run(
    merged.name,
    merged.category,
    merged.price,
    merged.stock,
    current.id,
  )
  res.json(mapProduct(db.prepare('SELECT * FROM products WHERE id = ?').get(current.id)))
})

export default router
