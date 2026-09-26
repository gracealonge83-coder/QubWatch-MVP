// App shell: header, main navigation (PRD Section 11), footer.
// Responsive layout is handled in index.css.
import MobileNav from './MobileNav.jsx'

const NAV_ITEMS = [
  'Dashboard',
  'Products',
  'Transactions',
  'Alerts',
  'Investigations',
  'AI Assistant',
  'Settings',
]

function Layout({ currentPage, onNavigate, businessName, notificationCount, onOpenNotifications, user, onLogout, children }) {
  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="brand">QubWatch</h1>
          <p className="tagline">Giving you smarter eyes.</p>
        </div>
        <div className="header-side">
          <button
            className={currentPage === 'Notifications' ? 'bell-btn active' : 'bell-btn'}
            onClick={onOpenNotifications}
            aria-label="Notifications"
          >
            Notifications{notificationCount > 0 ? ` (${notificationCount})` : ''}
          </button>
          <p className="business-pill">{businessName}</p>
          {user && (
            <button className="bell-btn" onClick={onLogout} aria-label="Logout">
              Logout ({user.name})
            </button>
          )}
        </div>
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
        <p>QubWatch — Giving you smarter eyes.</p>
      </footer>

      <MobileNav
        currentPage={currentPage}
        onNavigate={onNavigate}
        openAlertCount={notificationCount}
      />
    </div>
  )
}

export default Layout
