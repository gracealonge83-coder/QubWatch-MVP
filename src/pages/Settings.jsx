import BusinessSetup from '../components/BusinessSetup.jsx'
import TeamSetup from '../components/TeamSetup.jsx'
import MonitoringRules from '../components/MonitoringRules.jsx'

// Settings groups business profile, team, and monitoring-rule administration.
// Everything stays in memory for the current session. No backend.
function Settings({ business, onSaveBusiness, users, onAddUser, onUpdateUser, ruleConfig, canEditRules, onSaveRules, onRestoreRules }) {
  return (
    <div className="grid">
      <BusinessSetup business={business} onSave={onSaveBusiness} />
      <TeamSetup users={users} onAdd={onAddUser} onUpdate={onUpdateUser} />
      <MonitoringRules config={ruleConfig} canEdit={canEditRules} onSave={onSaveRules} onRestore={onRestoreRules} />
    </div>
  )
}

export default Settings
