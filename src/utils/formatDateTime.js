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
