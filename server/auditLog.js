import { newId } from './ids.js'
import { nowStamp } from './validate.js'

// Shared audit writer. investigationId is null for non-investigation actions
// (transaction creation, alert review); the subject is embedded in the action
// string. Callers must invoke this only after the business write succeeds,
// ideally inside the same db.transaction() so the two stay atomic.
export function addAudit(db, investigationId, userId, action) {
  db.prepare('INSERT INTO audit (id, investigation_id, user_id, action, date) VALUES (?, ?, ?, ?, ?)').run(
    newId('audit'),
    investigationId,
    userId,
    action,
    nowStamp(),
  )
}
