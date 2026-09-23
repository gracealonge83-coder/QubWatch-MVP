import { useState } from 'react'
import { formatDateTime } from '../utils/formatDateTime.js'

// Stage 2: view + record transactions, search and filtering (PRD Sections 15 + 31).
// In-memory only. No monitoring rules, no alert generation.
function Transactions({ transactions, products, users, currentUser, onAdd }) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [form, setForm] = useState({
    productId: products[0] ? products[0].id : '',
    type: 'sale',
    staffId: currentUser ? currentUser.id : '',
    quantity: '1',
    discount: '0',
  })

  const productById = Object.fromEntries(products.map((p) => [p.id, p]))
  const userById = Object.fromEntries(users.map((u) => [u.id, u]))
  const selected = productById[form.productId]

  const quantity = Number(form.quantity)
  const discountPct = Number(form.discount)
  const previewAmount = selected && quantity > 0
    ? Math.round(selected.price * quantity * (1 - (discountPct || 0) / 100))
    : 0

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!selected || !(quantity > 0)) return
    if (!(discountPct >= 0) || !(discountPct <= 100)) return
    onAdd({
      type: form.type,
      productId: form.productId,
      quantity,
      amount: previewAmount,
      staffId: form.staffId || currentUser.id,
      discount: discountPct,
    })
    setForm((prev) => ({ ...prev, quantity: '1', discount: '0' }))
  }

  const visible = [...transactions].reverse().filter((t) => {
    const q = search.trim().toLowerCase()
    const productName = (productById[t.productId] ? productById[t.productId].name : '').toLowerCase()
    if (q && !t.id.toLowerCase().includes(q) && !productName.includes(q)) return false
    if (typeFilter !== 'all' && t.type !== typeFilter) return false
    return true
  })

  return (
    <div className="grid">
      <div className="card">
        <h2>Record transaction</h2>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Product
            <select name="productId" value={form.productId} onChange={handleChange}>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — ₦{p.price.toLocaleString()}</option>
              ))}
            </select>
          </label>
          <label>
            Type
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="sale">Sale</option>
              <option value="refund">Refund</option>
              <option value="discount">Discount</option>
            </select>
          </label>
          <label>
            Recorded by
            <select name="staffId" value={form.staffId} onChange={handleChange}>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name} — {u.role}</option>
              ))}
            </select>
          </label>
          <label>
            Quantity
            <input name="quantity" value={form.quantity} onChange={handleChange} />
          </label>
          <label>
            Discount %
            <input name="discount" value={form.discount} onChange={handleChange} />
          </label>
          <p className="muted">Amount: ₦{previewAmount.toLocaleString()}</p>
          <button type="submit" className="primary-btn">Record</button>
        </form>
      </div>

      <div className="card">
        <h2>Transactions ({visible.length})</h2>
        <div className="toolbar">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search id or product" />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All types</option>
            <option value="sale">Sale</option>
            <option value="refund">Refund</option>
            <option value="discount">Discount</option>
          </select>
        </div>
        {visible.length === 0 ? (
          <p className="muted">No transactions match.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date/Time</th>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Staff</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{formatDateTime(t.date)}</td>
                    <td>{productById[t.productId] ? productById[t.productId].name : t.productId}</td>
                    <td>{t.type}</td>
                    <td>₦{t.amount.toLocaleString()}</td>
                    <td>{userById[t.staffId] ? userById[t.staffId].name : t.staffId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Transactions
