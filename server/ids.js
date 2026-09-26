// Centralized server-side ID generation (Stage 3).
// Preserves the existing QubWatch ID shapes: '<prefix>-<milliseconds>'.
// Single-threaded Node + millisecond resolution keeps these unique in MVP use.
export function newId(prefix) {
  return `${prefix}-${Date.now()}`
}
