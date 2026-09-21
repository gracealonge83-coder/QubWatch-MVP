import { useState } from 'react'
import Layout from './components/Layout.jsx'
import BusinessSetup from './components/BusinessSetup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import PlaceholderPage from './pages/PlaceholderPage.jsx'
import { business as initialBusiness, users, products, transactions } from './data/mockData.js'

// Stage 1 foundation only: structure, navigation, business setup,
// mock data, dashboard foundation. No monitoring, alerts, AI.
function App() {
  const [page, setPage] = useState('Dashboard')
  const [biz, setBiz] = useState(initialBusiness)
  const currentUser = users[0]

  let content = null
  if (page === 'Dashboard') {
    content = <Dashboard business={biz} user={currentUser} products={products} transactions={transactions} />
  } else if (page === 'Settings') {
    content = <BusinessSetup business={biz} onSave={setBiz} />
  } else if (page === 'Products') {
    content = <PlaceholderPage title="Products" description="Six demo products are loaded in mock data." stageNote="Full product management arrives in Stage 2." />
  } else if (page === 'Transactions') {
    content = <PlaceholderPage title="Transactions" description="Sample normal and unusual transactions are loaded." stageNote="Recording and filtering arrive in Stage 2." />
  } else if (page === 'Alerts') {
    content = <PlaceholderPage title="Alerts" description="Alert review is not part of Stage 1." stageNote="Monitoring and alerts arrive in Stage 3." />
  } else if (page === 'Investigations') {
    content = <PlaceholderPage title="Investigations" description="Investigations are not part of Stage 1." stageNote="Investigations arrive in Stage 4." />
  } else if (page === 'AI Assistant') {
    content = <PlaceholderPage title="AI Assistant" description="Mock AI help is not part of Stage 1." stageNote="AI Assistant arrives in Stage 5." />
  }

  return (
    <Layout currentPage={page} onNavigate={setPage} businessName={biz.name}>
      {content}
    </Layout>
  )
}

export default App
