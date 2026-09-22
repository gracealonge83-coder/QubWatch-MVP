// Browser-local persistence for business profile + team (PRD Sections 12 + 33A)
// plus operational records (PRD Sections 12, 23, 33A: products, transactions,
// alert statuses, investigations, audit). Alerts stay derived, never stored.
// App-level React state stays the source of truth while running; localStorage
// only makes saved data survive page refresh on the same browser/device.
// No backend, database, cloud sync, or authentication.
const BUSINESS_KEY = 'qubwatch.business.v1'
const USERS_KEY = 'qubwatch.users.v1'
const PRODUCTS_KEY = 'qubwatch.products.v1'
const TRANSACTIONS_KEY = 'qubwatch.transactions.v1'
const ALERT_STATUS_KEY = 'qubwatch.alertstatus.v1'
const INVESTIGATIONS_KEY = 'qubwatch.investigations.v1'
const AUDIT_KEY = 'qubwatch.audit.v1'

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

function isProductList(value) {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (p) =>
        typeof p === 'object' &&
        p !== null &&
        typeof p.id === 'string' &&
        typeof p.name === 'string',
    )
  )
}

function isTransactionList(value) {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (t) =>
        typeof t === 'object' &&
        t !== null &&
        typeof t.id === 'string' &&
        typeof t.type === 'string',
    )
  )
}

function isStatusMap(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((s) => typeof s === 'string')
  )
}

function isInvestigationList(value) {
  return (
    Array.isArray(value) &&
    value.every(
      (i) =>
        typeof i === 'object' &&
        i !== null &&
        typeof i.id === 'string' &&
        typeof i.status === 'string' &&
        Array.isArray(i.notes),
    )
  )
}

function isAuditList(value) {
  return (
    Array.isArray(value) &&
    value.every(
      (e) =>
        typeof e === 'object' &&
        e !== null &&
        typeof e.id === 'string' &&
        typeof e.action === 'string',
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

export function loadProducts(fallback) {
  const saved = readKey(PRODUCTS_KEY)
  return isProductList(saved) ? saved : fallback
}

export function saveProducts(products) {
  if (isProductList(products)) writeKey(PRODUCTS_KEY, products)
}

export function loadTransactions(fallback) {
  const saved = readKey(TRANSACTIONS_KEY)
  return isTransactionList(saved) ? saved : fallback
}

export function saveTransactions(transactions) {
  if (isTransactionList(transactions)) writeKey(TRANSACTIONS_KEY, transactions)
}

export function loadAlertStatus(fallback) {
  const saved = readKey(ALERT_STATUS_KEY)
  return isStatusMap(saved) ? saved : fallback
}

export function saveAlertStatus(statusById) {
  if (isStatusMap(statusById)) writeKey(ALERT_STATUS_KEY, statusById)
}

export function loadInvestigations(fallback) {
  const saved = readKey(INVESTIGATIONS_KEY)
  return isInvestigationList(saved) ? saved : fallback
}

export function saveInvestigations(investigations) {
  if (isInvestigationList(investigations)) writeKey(INVESTIGATIONS_KEY, investigations)
}

export function loadAudit(fallback) {
  const saved = readKey(AUDIT_KEY)
  return isAuditList(saved) ? saved : fallback
}

export function saveAudit(auditLog) {
  if (isAuditList(auditLog)) writeKey(AUDIT_KEY, auditLog)
}
