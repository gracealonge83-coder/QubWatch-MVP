// Browser-local persistence for business profile + team (PRD Sections 12 + 33A).
// App-level React state stays the source of truth while running; localStorage
// only makes saved data survive page refresh on the same browser/device.
// No backend, database, cloud sync, or authentication.
const BUSINESS_KEY = 'qubwatch.business.v1'
const USERS_KEY = 'qubwatch.users.v1'

function readKey(key) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw == null ? undefined : JSON.parse(raw)
  } catch {
    return undefined
  }
}

function writeKey(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage unavailable (e.g. private mode): session simply won't persist.
  }
}

function isBusiness(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.name === 'string'
  )
}

function isUserList(value) {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (u) =>
        typeof u === 'object' &&
        u !== null &&
        typeof u.id === 'string' &&
        typeof u.name === 'string' &&
        typeof u.role === 'string',
    )
  )
}

export function loadBusiness(fallback) {
  const saved = readKey(BUSINESS_KEY)
  return isBusiness(saved) ? saved : fallback
}

export function saveBusiness(business) {
  if (isBusiness(business)) writeKey(BUSINESS_KEY, business)
}

export function loadUsers(fallback) {
  const saved = readKey(USERS_KEY)
  return isUserList(saved) ? saved : fallback
}

export function saveUsers(users) {
  if (isUserList(users)) writeKey(USERS_KEY, users)
}
