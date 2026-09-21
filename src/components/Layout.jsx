// App shell: header, main navigation (PRD Section 11), footer.
// Responsive layout is handled in index.css.

const NAV_ITEMS = [
  'Dashboard',
  'Products',
  'Transactions',
  'Alerts',
  'Investigations',
  'AI Assistant',
  'Settings',
]

function Layout({ currentPage, onNavigate, businessName, children }) {
  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="brand">QubWatch</h1>
          <p className="tagline">Giving you smarter eyes.</p>
        </div>
        <p className="business-pill">{businessName}</p>
      </header>

      <nav className="nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item}
            className={item === currentPage ? 'nav-btn active' : 'nav-btn'}
            onClick={() => onNavigate(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      <main className="main">{children}</main>

      <footer className="footer">
        <p>QubWatch MVP — Stage 1 foundation. AI assists. Humans decide. Alerts are for review only.</p>
      </footer>
    </div>
  )
}

export default Layout
