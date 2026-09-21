// Placeholder for areas outside Stage 1.
// Shows navigation works without building future features.

function PlaceholderPage({ title, description, stageNote }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{description}</p>
      <p className="muted">{stageNote}</p>
    </div>
  )
}

export default PlaceholderPage
