import { useMemo, useState } from 'react'
import Layout from './components/Layout.jsx'
import BusinessSetup from './components/BusinessSetup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Products from './pages/Products.jsx'
import Transactions from './pages/Transactions.jsx'
import Alerts from './pages/Alerts.jsx'
import PlaceholderPage from './pages/PlaceholderPage.jsx'
import { evaluateRules } from './monitoring/rules.js'
import { business as initialBusiness, users, products as seedProducts, transactions as seedTransactions } from './data/mockData.js'

// Stage 3 monitoring: rule-based alerts + review. In-memory only.
// No ML, no autonomous investigations or decisions.
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
  const [statusById, setStatusById] = useState({})
  const [selectedAlertId, setSelectedAlertId] = useState(null)
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

  const alerts = useMemo(() => {
    const base = evaluateRules(productList, txnList)
    return base.map((a) => ({ ...a, status: statusById[a.id] || 'New' }))
  }, [productList, txnList, statusById])

  function updateAlertStatus(id, status) {
    setStatusById((prev) => ({ ...prev, [id]: status }))
  }

  function openAlert(id) {
    setSelectedAlertId(id)
    setPage('Alerts')
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
        alerts={alerts}
        onNavigate={setPage}
        onReviewAlert={openAlert}
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
    content = (
      <Alerts
        alerts={alerts}
        products={productList}
        transactions={txnList}
        users={users}
        selectedId={selectedAlertId}
        onSelect={setSelectedAlertId}
        onStatusChange={updateAlertStatus}
      />
    )
  } else if (page === 'Investigations') {
    content = <PlaceholderPage title="Investigations" description="Investigations are not part of Stage 3." stageNote="Investigations arrive in Stage 4." />
  } else if (page === 'AI Assistant') {
    content = <PlaceholderPage title="AI Assistant" description="Mock AI help is not part of Stage 3." stageNote="AI Assistant arrives in Stage 5." />
  }

  return (
    <Layout currentPage={page} onNavigate={setPage} businessName={biz.name}>
      {content}
    </Layout>
  )
}

export default App
