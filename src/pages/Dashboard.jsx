// Dashboard with Stage 2 KPIs (PRD Section 13, without alert monitoring).
// KPIs are plain totals from transaction data. No monitoring rules here.

function Dashboard({ business, user, users, products, transactions, onNavigate }) {
  const today = new Date().toLocaleDateString()
  const productById = Object.fromEntries(products.map((p) => [p.id, p]))
  const userById = Object.fromEntries(users.map((u) => [u.id, u]))

  const sales = transactions.filter((t) => t.type === 'sale')
  const refunds = transactions.filter((t) => t.type === 'refund')
  const discounts = transactions.filter((t) => t.type === 'discount')
  const salesTotal = sales.reduce((sum, t) => sum + t.amount, 0)
  const refundTotal = refunds.reduce((sum, t) => sum + t.amount, 0)
  const discountTotal = discounts.reduce((sum, t) => sum + t.amount, 0)
  const inventoryIssues = products.filter((p) => p.stock !== p.expectedStock).length

  const recent = [...transactions].slice(-6).reverse()

  return (
    <div>
      <div className="kpi-grid">
        <div className="card kpi">
          <h3>Sales</h3>
          <p className="kpi-value">₦{salesTotal.toLocaleString()}</p>
          <p className="muted">{sales.length} sales</p>
        </div>
        <div className="card kpi">
          <h3>Refunds</h3>
          <p className="kpi-value">₦{refundTotal.toLocaleString()}</p>
          <p className="muted">{refunds.length} refunds</p>
        </div>
        <div className="card kpi">
          <h3>Discounts</h3>
          <p className="kpi-value">₦{discountTotal.toLocaleString()}</p>
          <p className="muted">{discounts.length} discounted</p>
        </div>
        <div className="card kpi">
          <h3>Inventory</h3>
          <p className="kpi-value">{inventoryIssues}</p>
          <p className="muted">mismatches</p>
        </div>
      </div>

      <div className="grid" style={{ marginTop: '1rem' }}>
        <div className="card">
          <h2>Business information</h2>
          <p><strong>{business.name}</strong></p>
          <p>Date: {today}</p>
          <p>User: {user.name}</p>
          <p>Role: {user.role}</p>
          <div className="form-row">
            <button className="secondary-btn" onClick={() => onNavigate('Products')}>View products</button>
            <button className="secondary-btn" onClick={() => onNavigate('Transactions')}>View transactions</button>
          </div>
        </div>

        <div className="card">
          <h2>Recent activity</h2>
          <ul>
            {recent.map((t) => (
              <li key={t.id}>
                {t.date} — {t.type} — {productById[t.productId] ? productById[t.productId].name : t.productId} — ₦{t.amount.toLocaleString()} ({userById[t.staffId] ? userById[t.staffId].name : t.staffId})
              </li>
            ))}
          </ul>
          <p className="muted">Alert monitoring arrives in Stage 3.</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
