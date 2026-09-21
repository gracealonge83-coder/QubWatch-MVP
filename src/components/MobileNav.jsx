// Stage 6 mobile bottom navigation. Shown only on small screens (see CSS).
// Desktop keeps the existing top nav. No behavior change, navigation only.
const TABS = [
  'Dashboard',
  'Alerts',
  'Transactions',
  'Investigations',
  'AI Assistant',
]

function MobileNav({ currentPage, onNavigate, openAlertCount }) {
  return (
    <nav className="mobile-nav">
      {TABS.map((item) => (
        <button
          key={item}
          className={item === currentPage ? 'tab-btn active' : 'tab-btn'}
          onClick={() => onNavigate(item)}
        >
          {item === 'Alerts' && openAlertCount > 0 ? `Alerts (${openAlertCount})` : item}
        </button>
      ))}
    </nav>
  )
}

export default MobileNav
