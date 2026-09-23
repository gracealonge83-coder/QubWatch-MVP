// Display-only date/time formatting for QubWatch.
// Internal storage stays as 'YYYY-MM-DD HH:MM' strings; this only changes
// what the user sees: DD/MM/YYYY plus a 12-hour clock, e.g. 21/09/2026 6:26 AM.
// Values that are not timestamps (e.g. 'Current stock') pass through unchanged.
export function formatDateTime(value) {
  if (value == null || value === '') return ''
  let year
  let month
  let day
  let hours
  let minutes
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return ''
    year = value.getFullYear()
    month = value.getMonth() + 1
    day = value.getDate()
    hours = value.getHours()
    minutes = value.getMinutes()
  } else {
    const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/.exec(String(value).trim())
    if (!match) return String(value)
    year = Number(match[1])
    month = Number(match[2])
    day = Number(match[3])
    hours = Number(match[4])
    minutes = Number(match[5])
  }
  const pad = (n) => String(n).padStart(2, '0')
  const period = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  return `${pad(day)}/${pad(month)}/${year} ${hour12}:${pad(minutes)} ${period}`
}

// Human-readable transaction display number derived from the stored date,
// e.g. '2026-09-22 06:11' becomes 'TXN-22092026-0611'.
// Display only: never saved, never used as a key. Same-minute transactions
// share a number; the internal ID stays the unique reference.
export function txnDisplayNumber(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/.exec(String(value == null ? '' : value).trim())
  if (!match) return String(value == null ? '' : value)
  return `txn-${match[3]}${match[2]}${match[1]}-${match[4]}${match[5]}`
}
