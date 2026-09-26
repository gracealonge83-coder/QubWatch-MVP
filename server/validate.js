// Shared server-side validators (Stage 5). Mirror the existing QubWatch
// client rules authoritatively; the client checks first for UX, the server
// decides. Each validator returns an error string or null when valid.
export const ROLES = [
  'Business Owner',
  'Authorized Manager',
  'Staff User',
  'Administrator',
]

export const TXN_TYPES = ['sale', 'refund', 'discount']

export const ALERT_STATUSES = ['New', 'Under Review', 'Investigating', 'Resolved', 'Dismissed']

export const INVESTIGATION_STATUSES = ['Open', 'Under Investigation', 'Resolved', 'Closed']

export const FINDINGS = [
  'No Issue Identified',
  'Legitimate Business Activity',
  'Process Error',
  'Policy Violation',
  'Further Review Required',
  'Confirmed Business Loss',
  'Other',
]

export function requiredText(value) {
  return typeof value === 'string' && value.trim() !== '' ? null : 'Required.'
}

export function positiveNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? null
    : 'Must be a number above 0.'
}

export function nonNegativeInt(value) {
  return Number.isInteger(value) && value >= 0 ? null : 'Must be a whole number of 0 or more.'
}

export function positiveInt(value) {
  return Number.isInteger(value) && value > 0 ? null : 'Must be a whole number of 1 or more.'
}

export function discountPct(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100
    ? null
    : 'Must be a percent between 0 and 100.'
}

export function inList(value, list) {
  return list.includes(value) ? null : 'Invalid value.'
}

// Collects {field: message} for an object of {field: errorOrNull}.
export function collect(entries) {
  const errors = {}
  for (const [field, error] of Object.entries(entries)) {
    if (error) errors[field] = error
  }
  return Object.keys(errors).length > 0 ? errors : null
}

export function badRequest(res, fields) {
  res.status(400).json({ error: 'Invalid request', fields })
}

// Server clock in the app's timestamp format ('YYYY-MM-DD HH:MM').
export function nowStamp() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function validateRuleConfig(body) {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { _body: 'Rule configuration object is required.' }
  }
  return collect({
    LARGE_TRANSACTION_AMOUNT:
      typeof body.LARGE_TRANSACTION_AMOUNT === 'number' &&
      Number.isFinite(body.LARGE_TRANSACTION_AMOUNT) &&
      body.LARGE_TRANSACTION_AMOUNT > 0
        ? null
        : 'Enter an amount above 0.',
    REPEATED_REFUNDS_COUNT: positiveInt(body.REPEATED_REFUNDS_COUNT),
    REPEATED_REFUNDS_WINDOW_MINUTES: positiveInt(body.REPEATED_REFUNDS_WINDOW_MINUTES),
    EXCESSIVE_DISCOUNT_PCT: discountPct(body.EXCESSIVE_DISCOUNT_PCT) === null && body.EXCESSIVE_DISCOUNT_PCT > 0
      ? null
      : 'Enter a percent above 0 and at most 100.',
    FREQUENCY_COUNT: positiveInt(body.FREQUENCY_COUNT),
    FREQUENCY_WINDOW_MINUTES: positiveInt(body.FREQUENCY_WINDOW_MINUTES),
  })
}
