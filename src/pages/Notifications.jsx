// Stage 6 in-app notifications (PRD Section 30: in-app only for the MVP).
// Derived read-only from existing alerts + investigations. No push, no backend.
function Notifications({ alerts, investigations, onOpenAlert, onOpenInvestigation }) {
  const needsReview = alerts.filter((a) => a.status === 'New' || a.status === 'Under Review')
  const openInv = investigations.filter((i) => i.status === 'Open' || i.status === 'Under Investigation')
  const resolvedInv = investigations.filter((i) => i.status === 'Resolved' || i.status === 'Closed')

  return (
    <div className="grid">
      <div className="card">
        <h2>Needs review ({needsReview.length})</h2>
        {needsReview.length === 0 ? (
          <p className="muted">No alerts need review right now.</p>
        ) : (
          <ul className="alert-list">
            {needsReview.map((a) => (
              <li key={a.id}>
                <button className="alert-item" onClick={() => onOpenAlert(a.id)}>
                  <span className={`badge badge-${a.severity.toLowerCase()}`}>{a.severity}</span>
                  <span> {a.type} — {a.status}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h2>Investigations ({openInv.length} open)</h2>
        {openInv.length === 0 && resolvedInv.length === 0 ? (
          <p className="muted">No investigation activity yet.</p>
        ) : (
          <div>
            {openInv.length > 0 && (
              <ul className="alert-list">
                {openInv.map((i) => (
                  <li key={i.id}>
                    <button className="alert-item" onClick={() => onOpenInvestigation(i.id)}>
                      <span className="pill">{i.status}</span>
                      <span> Investigation opened — {i.id}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {resolvedInv.length > 0 && (
              <ul className="alert-list">
                {resolvedInv.map((i) => (
                  <li key={i.id}>
                    <button className="alert-item" onClick={() => onOpenInvestigation(i.id)}>
                      <span className="pill">{i.status}</span>
                      <span> Investigation {i.status.toLowerCase()} — {i.id}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications
