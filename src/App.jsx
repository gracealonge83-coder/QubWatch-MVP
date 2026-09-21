import { useMemo, useState } from 'react'
import Layout from './components/Layout.jsx'
import BusinessSetup from './components/BusinessSetup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Products from './pages/Products.jsx'
import Transactions from './pages/Transactions.jsx'
import Alerts from './pages/Alerts.jsx'
import Investigations from './pages/Investigations.jsx'
import AiAssistant from './pages/AiAssistant.jsx'
import Notifications from './pages/Notifications.jsx'
import { evaluateRules } from './monitoring/rules.js'
import { business as initialBusiness, users, products as seedProducts, transactions as seedTransactions } from './data/mockData.js'

// Stage 4 investigations: alert -> review -> investigation -> evidence ->
// finding -> resolution. Human decides everything. In-memory only.
// No ML, no AI, no autonomous decisions.
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
  const [investigations, setInvestigations] = useState([])
  const [selectedInvestigationId, setSelectedInvestigationId] = useState(null)
  const [auditLog, setAuditLog] = useState([])
  const [aiContext, setAiContext] = useState({ type: 'overview', id: null })
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

  function logAudit(investigationId, action) {
    const entry = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      investigationId,
      userId: currentUser.id,
      action,
      date: formatNow(),
    }
    setAuditLog((prev) => [...prev, entry])
  }

  function startInvestigation(alertId) {
    const existing = investigations.find((i) => i.alertId === alertId && i.status !== 'Closed')
    if (existing) {
      setSelectedInvestigationId(existing.id)
      setPage('Investigations')
      return
    }
    const alert = alerts.find((a) => a.id === alertId)
    if (!alert || (alert.status !== 'New' && alert.status !== 'Under Review')) return
    const id = `inv-${Date.now()}`
    const investigation = {
      id,
      alertId,
      alertType: alert.type,
      alertSeverity: alert.severity,
      investigatorId: currentUser.id,
      status: 'Open',
      relatedTransactionIds: [...alert.relatedTransactionIds],
      relatedProductIds: [...alert.relatedProductIds],
      notes: [],
      finding: '',
      findingOther: '',
      resolutionNotes: '',
      resolvedById: '',
      createdAt: formatNow(),
      resolvedAt: '',
    }
    setInvestigations((prev) => [...prev, investigation])
    updateAlertStatus(alertId, 'Investigating')
    logAudit(id, 'Investigation opened')
    setSelectedInvestigationId(id)
    setPage('Investigations')
  }

  function openInvestigation(id) {
    setSelectedInvestigationId(id)
    setPage('Investigations')
  }

  function askAiAboutAlert(id) {
    setAiContext({ type: 'alert', id })
    setPage('AI Assistant')
  }

  function askAiAboutInvestigation(id) {
    setAiContext({ type: 'investigation', id })
    setPage('AI Assistant')
  }

  function addNote(invId, content) {
    setInvestigations((prev) => prev.map((inv) => {
      if (inv.id !== invId) return inv
      const note = {
        id: `note-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
        authorId: currentUser.id,
        content,
        date: formatNow(),
      }
      return {
        ...inv,
        notes: [...inv.notes, note],
        status: inv.status === 'Open' ? 'Under Investigation' : inv.status,
      }
    }))
    logAudit(invId, 'Note added')
  }

  function assignInvestigator(invId, userId) {
    setInvestigations((prev) => prev.map((inv) => (
      inv.id === invId ? { ...inv, investigatorId: userId } : inv
    )))
  }

  function recordFinding(invId, finding, findingOther) {
    setInvestigations((prev) => prev.map((inv) => (
      inv.id === invId ? { ...inv, finding, findingOther } : inv
    )))
    logAudit(invId, 'Finding recorded')
  }

  function resolveInvestigation(invId, resolutionNotes) {
    const inv = investigations.find((i) => i.id === invId)
    if (!inv || !inv.finding || !resolutionNotes.trim()) return
    const date = formatNow()
    setInvestigations((prev) => prev.map((i) => (
      i.id === invId
        ? { ...i, status: 'Resolved', resolutionNotes: resolutionNotes.trim(), resolvedById: currentUser.id, resolvedAt: date }
        : i
    )))
    updateAlertStatus(inv.alertId, 'Resolved')
    logAudit(invId, 'Investigation resolved')
  }

  function closeInvestigation(invId) {
    setInvestigations((prev) => prev.map((i) => (
      i.id === invId && i.status === 'Resolved' ? { ...i, status: 'Closed' } : i
    )))
    logAudit(invId, 'Investigation closed')
  }

  const openInvestigationCount = investigations.filter(
    (i) => i.status === 'Open' || i.status === 'Under Investigation',
  ).length

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
        openInvestigationCount={openInvestigationCount}
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
        investigations={investigations}
        onStartInvestigation={startInvestigation}
        onOpenInvestigation={openInvestigation}
        onAskAiAboutAlert={askAiAboutAlert}
      />
    )
  } else if (page === 'Investigations') {
    content = (
      <Investigations
        investigations={investigations}
        alerts={alerts}
        products={productList}
        transactions={txnList}
        users={users}
        currentUser={currentUser}
        selectedId={selectedInvestigationId}
        onSelect={setSelectedInvestigationId}
        onAddNote={addNote}
        onAssignInvestigator={assignInvestigator}
        onRecordFinding={recordFinding}
        onResolve={resolveInvestigation}
        onClose={closeInvestigation}
        onOpenAlert={openAlert}
        onAskAiAboutInvestigation={askAiAboutInvestigation}
        auditLog={auditLog}
      />
    )
  } else if (page === 'AI Assistant') {
    content = (
      <AiAssistant
        key={`${aiContext.type}-${aiContext.id || 'none'}`}
        business={biz}
        alerts={alerts}
        investigations={investigations}
        products={productList}
        transactions={txnList}
        users={users}
        initialContext={aiContext}
        onOpenAlert={openAlert}
        onOpenInvestigation={openInvestigation}
      />
    )
  } else if (page === 'Notifications') {
    content = (
      <Notifications
        alerts={alerts}
        investigations={investigations}
        onOpenAlert={openAlert}
        onOpenInvestigation={openInvestigation}
      />
    )
  }

  return (
    <Layout
      currentPage={page}
      onNavigate={setPage}
      businessName={biz.name}
      notificationCount={alerts.filter((a) => a.status === 'New' || a.status === 'Under Review').length}
      onOpenNotifications={() => setPage('Notifications')}
    >
      {content}
    </Layout>
  )
}

export default App
