import BusinessSetup from '../components/BusinessSetup.jsx'
import TeamSetup from '../components/TeamSetup.jsx'

// Settings groups business profile and team administration in one place.
// Both stay in memory for the current session. No backend.
function Settings({ business, onSaveBusiness, users, onAddUser, onUpdateUser }) {
  return (
    <div className="grid">
      <BusinessSetup business={business} onSave={onSaveBusiness} />
      <TeamSetup users={users} onAdd={onAddUser} onUpdate={onUpdateUser} />
    </div>
  )
}

export default Settings
