// Dashboard foundation (PRD Section 13 — business info only).
// No monitoring rules, no alerts, no KPIs yet. Those come in Stage 2-3.

function Dashboard({ business, user, products, transactions }) {
  const today = new Date().toLocaleDateString()
  const recent = transactions.slice(-5).reverse()

  return (
    <div className="grid">
      <div className="card">
        <h2>Business information</h2>
        <p><strong>{business.name}</strong></p>
        <p>Date: {today}</p>
        <p>User: {user.name}</p>
        <p>Role: {user.role}</p>
      </div>

      <div className="card">
        <h2>Foundation summary</h2>
        <p>Products: {products.length}</p>
        <p>Sample transactions: {transactions.length}</p>
        <p className="muted">Sales totals, refunds, alerts, and inventory checks arrive in later stages.</p>
      </div>

      <div className="card">
        <h2>Demo products</h2>
        <ul>
          {products.map((p) => (
            <li key={p.id}>{p.name} — ₦{p.price.toLocaleString()} (stock {p.stock})</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>Recent activity</h2>
        <ul>
          {recent.map((t) => (
            <li key={t.id}>{t.date} — {t.type} — ₦{t.amount.toLocaleString()}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Dashboard
