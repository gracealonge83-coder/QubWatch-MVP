import { useState } from 'react'
import Layout from './components/Layout.jsx'
import BusinessSetup from './components/BusinessSetup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Products from './pages/Products.jsx'
import Transactions from './pages/Transactions.jsx'
import PlaceholderPage from './pages/PlaceholderPage.jsx'
import { business as initialBusiness, users, products as seedProducts, transactions as seedTransactions } from './data/mockData.js'

// Stage 2 core business: products, transactions, dashboard KPIs, search/filter.
// In-memory only. No monitoring rules, no alert generation, no AI.
function formatNow() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function App() {
  const [page, setPage] = useState('Dashboard')
  const [biz, setBiz] = useState(initialBusiness)
  const [productList, setProductList] = useState(seedProducts)
  const [txnList, setTxnList] = useState(seedTransactions)
  const currentUser = users[0]

  function addProduct(data) {
    const product = { id: `prod-${Date.now()}`, expectedStock: data.stock, ...data }
    setProductList((prev) => [...prev, product])
  }

  function updateProduct(id, updates) {
    setProductList((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  function addTransaction(data) {
    const txn = { id: `txn-${Date.now()}`, date: formatNow(), ...data }
    setTxnList((prev) => [...prev, txn])
  }

  let content = null
  if (page === 'Dashboard') {
    content = (
      <Dashboard
        business={biz}
        user={currentUser}
        users={users}
        products={productList}
        transactions={txnList}
        onNavigate={setPage}
      />
    )
  } else if (page === 'Settings') {
    content = <BusinessSetup business={biz} onSave={setBiz} />
  } else if (page === 'Products') {
    content = <Products products={productList} onAdd={addProduct} onUpdate={updateProduct} />
  } else if (page === 'Transactions') {
    content = (
      <Transactions
        transactions={txnList}
        products={productList}
        users={users}
        currentUser={currentUser}
        onAdd={addTransaction}
      />
    )
  } else if (page === 'Alerts') {
    content = <PlaceholderPage title="Alerts" description="Alert review is not part of Stage 2." stageNote="Monitoring and alerts arrive in Stage 3." />
  } else if (page === 'Investigations') {
    content = <PlaceholderPage title="Investigations" description="Investigations are not part of Stage 2." stageNote="Investigations arrive in Stage 4." />
  } else if (page === 'AI Assistant') {
    content = <PlaceholderPage title="AI Assistant" description="Mock AI help is not part of Stage 2." stageNote="AI Assistant arrives in Stage 5." />
  }

  return (
    <Layout currentPage={page} onNavigate={setPage} businessName={biz.name}>
      {content}
    </Layout>
  )
}

export default App
