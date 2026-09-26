import { useState } from 'react'

// Simple team management (PRD Sections 4 + 33: basic roles only).
// Add users and edit name/role. In-memory only. No delete: seeded
// transactions, notes, and audit entries reference these user IDs.
const ROLES = [
  'Business Owner',
  'Authorized Manager',
  'Staff User',
  'Administrator',
]

function TeamSetup({ users, onAdd, onUpdate, newCredentials, onClearCredentials }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('Staff User')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editRole, setEditRole] = useState('Staff User')

  async function handleAdd(event) {
    event.preventDefault()
    if (!name.trim()) return
    const ok = await onAdd({ name: name.trim(), role })
    if (!ok) return
    setName('')
    setRole('Staff User')
  }

  function startEdit(user) {
    setEditingId(user.id)
    setEditName(user.name)
    setEditRole(user.role)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditName('')
    setEditRole('Staff User')
  }

  async function handleSaveEdit(event) {
    event.preventDefault()
    if (!editName.trim()) return
    const ok = await onUpdate(editingId, { name: editName.trim(), role: editRole })
    if (!ok) return
    cancelEdit()
  }

  return (
    <div className="card">
      <h2>Team</h2>
      <p className="muted">PRD roles only. Changes save to the QubWatch backend.</p>
      {newCredentials && (
        <div className="card">
          <p><strong>Login password for {newCredentials.name}:</strong></p>
          <p>{newCredentials.temporaryPassword}</p>
          <p className="muted">Shown once. Share it securely, then dismiss.</p>
          <div className="form-row">
            <button type="button" className="secondary-btn" onClick={onClearCredentials}>Dismiss</button>
          </div>
        </div>
      )}
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {editingId === u.id ? (
              <form onSubmit={handleSaveEdit} className="form">
                <label>
                  Name
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                </label>
                <label>
                  Role
                  <select value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </label>
                <div className="form-row">
                  <button type="submit" className="primary-btn">Save</button>
                  <button type="button" className="secondary-btn" onClick={cancelEdit}>Cancel</button>
                </div>
              </form>
            ) : (
              <span>
                {u.name} — {u.role}{' '}
                <button className="secondary-btn" onClick={() => startEdit(u)}>Edit</button>
              </span>
            )}
          </li>
        ))}
      </ul>
      <h3>Add staff/user</h3>
      <form onSubmit={handleAdd} className="form">
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ngozi Ade" />
        </label>
        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="primary-btn">Add user</button>
      </form>
    </div>
  )
}

export default TeamSetup
