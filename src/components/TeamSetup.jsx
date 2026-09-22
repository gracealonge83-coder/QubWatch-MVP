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

function TeamSetup({ users, onAdd, onUpdate }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('Staff User')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editRole, setEditRole] = useState('Staff User')

  function handleAdd(event) {
    event.preventDefault()
    if (!name.trim()) return
    onAdd({ name: name.trim(), role })
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

  function handleSaveEdit(event) {
    event.preventDefault()
    if (!editName.trim()) return
    onUpdate(editingId, { name: editName.trim(), role: editRole })
    cancelEdit()
  }

  return (
    <div className="card">
      <h2>Team</h2>
      <p className="muted">PRD roles only. Changes stay in memory for this session.</p>
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
