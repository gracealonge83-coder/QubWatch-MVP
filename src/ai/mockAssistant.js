// Stage 5 controlled mock AI responses (PRD Sections 28-29).
// Deterministic templates filled with live record values only.
// No external API, SDK, backend, or database. Nothing here records findings,
// resolves investigations, or judges staff.
import { DEMO_THRESHOLDS } from '../monitoring/rules.js'
import { formatDateTime } from '../utils/formatDateTime.js'

export const FAIRNESS_NOTE =
  'An alert is a signal for review. It does not prove fraud, theft, wrongdoing, or business loss.'

// Fixed neutral questions the assistant may suggest (PRD Section 28).
export const STARTER_QUESTIONS = [
  'Who recorded the related transactions, and were they on duty at the time?',
  'Do source documents (receipts, till records) match the recorded amounts?',
  'Has this pattern happened before on other days?',
  'Is there a business reason, such as a promotion, event, or bulk order?',
  'What should be checked on the next visit or stock count?',
]

function txnLine(t, productById, userById) {
  const product = productById[t.productId]
  const staff = userById[t.staffId]
  return `${formatDateTime(t.date)} — ${t.type} — ${product ? product.name : t.productId} — qty ${t.quantity} — ₦${t.amount.toLocaleString()} — discount ${t.discount}% — ${staff ? staff.name : t.staffId}`
}

function ruleLine(alert) {
  if (alert.type === 'Large transaction') {
    return `Rule: flag transactions above ₦${DEMO_THRESHOLDS.LARGE_TRANSACTION_AMOUNT.toLocaleString()}.`
  }
  if (alert.type === 'Repeated refunds') {
    return `Rule: flag more than ${DEMO_THRESHOLDS.REPEATED_REFUNDS_COUNT} refunds within ${DEMO_THRESHOLDS.REPEATED_REFUNDS_WINDOW_MINUTES / 60} hours.`
  }
  if (alert.type === 'High discount') {
    return `Rule: flag discounts at or above ${DEMO_THRESHOLDS.EXCESSIVE_DISCOUNT_PCT}% (business threshold).`
  }
  if (alert.type === 'Unusual frequency') {
    return `Rule: flag more than ${DEMO_THRESHOLDS.FREQUENCY_COUNT} transactions within ${DEMO_THRESHOLDS.FREQUENCY_WINDOW_MINUTES} minutes (business threshold).`
  }
  return 'Rule: flag products whose recorded stock differs from expected stock.'
}

function relatedTxns(alert, txnById) {
  return alert.relatedTransactionIds.map((id) => txnById[id]).filter(Boolean)
}

function summarizeAlert(alert, ctx) {
  const txns = relatedTxns(alert, ctx.txnById)
  const products = [...new Set(txns.map((t) => t.productId))].map((id) => ctx.productById[id]).filter(Boolean)
  return {
    title: `Summary: ${alert.type}`,
    knownInformation: [
      `Alert: ${alert.type} — severity ${alert.severity} — status ${alert.status} — ${formatDateTime(alert.date)}.`,
      `Reason recorded by the monitor: ${alert.message}`,
      ...txns.map((t) => txnLine(t, ctx.productById, ctx.userById)),
      ...(products.length > 0 ? [`Products involved: ${products.map((p) => `${p.name} (₦${p.price.toLocaleString()}, stock ${p.stock})`).join('; ')}.`] : []),
    ],
    analysis: [
      `${txns.length} related transaction(s) and ${products.length} product(s) are attached to this alert.`,
      'The figures above come directly from business records; anything beyond them is a possibility, not a fact.',
    ],
    possibleExplanations: [
      'A legitimate business reason, such as a bulk order, promotion, or busy period.',
      'A process error, such as a mistyped amount, wrong product, or unrecorded stock movement.',
    ],
    suggestedNextSteps: [
      'Open the alert review to see the full related records.',
      'Compare the amounts and times with receipts or till records.',
      'Check with the staff member on duty before drawing any conclusion.',
      'Start an investigation if the activity still needs a closer look.',
    ],
  }
}

function explainAlert(alert, ctx) {
  const base = summarizeAlert(alert, ctx)
  return {
    ...base,
    title: `Why this alert was generated: ${alert.type}`,
    knownInformation: [ruleLine(alert), ...base.knownInformation],
    analysis: [
      `The monitor compared current records against the rule above and this activity met the condition.`,
      'Rule-based flags use fixed thresholds; they support review but do not replace your judgment.',
    ],
  }
}

function summarizeTransactions(alert, ctx) {
  const txns = relatedTxns(alert, ctx.txnById)
  const total = txns.reduce((sum, t) => sum + t.amount, 0)
  const byType = {}
  txns.forEach((t) => { byType[t.type] = (byType[t.type] || 0) + 1 })
  return {
    title: `Transactions behind: ${alert.type}`,
    knownInformation: txns.map((t) => txnLine(t, ctx.productById, ctx.userById)),
    analysis: [
      `${txns.length} transaction(s) totalling ₦${total.toLocaleString()}.`,
      `Breakdown: ${Object.entries(byType).map(([k, v]) => `${v} ${k}`).join(', ') || 'none'}.`,
    ],
    possibleExplanations: [
      'The cluster may reflect one underlying event (for example, several refunds for one faulty batch).',
      'Or the transactions may be unrelated and only share the same time window.',
    ],
    suggestedNextSteps: [
      'Read each transaction line above against its receipt.',
      'Note anything confirmed or still unclear as an investigation note.',
    ],
  }
}

function suggestQuestions(alert) {
  return {
    title: `Questions to consider: ${alert.type}`,
    knownInformation: [
      `Alert: ${alert.type} — severity ${alert.severity} — status ${alert.status}.`,
      `Recorded reason: ${alert.message}`,
    ],
    analysis: [
      'These questions help gather facts; answers belong in investigation notes.',
    ],
    possibleExplanations: [
      'Possible explanations can only be weighed after the questions below are answered from records.',
    ],
    suggestedNextSteps: [...STARTER_QUESTIONS],
  }
}

export function briefInvestigation(investigation, alert, ctx) {
  const staff = ctx.userById[investigation.investigatorId]
  return {
    title: `Investigation brief: ${investigation.id}`,
    knownInformation: [
      `Status: ${investigation.status} — opened ${formatDateTime(investigation.createdAt)}${staff ? ` — investigator ${staff.name}` : ''}.`,
      alert ? `Linked alert: ${alert.type} — ${alert.severity} — ${alert.status}. ${alert.message}` : `Linked alert record: ${investigation.alertType} (${investigation.alertSeverity}).`,
      `Notes recorded: ${investigation.notes.length}. Finding recorded: ${investigation.finding || 'none yet'}.`,
      ...(investigation.status === 'Resolved' || investigation.status === 'Closed'
        ? [`Resolution notes: ${investigation.resolutionNotes} (resolved ${formatDateTime(investigation.resolvedAt)}).`]
        : []),
    ],
    analysis: [
      investigation.notes.length > 0
        ? 'Notes exist, so review them before deciding what is still missing.'
        : 'No notes exist yet, so the next useful step is to record what the evidence shows.',
      investigation.finding
        ? 'A finding has been recorded by the user; this brief does not second-guess it.'
        : 'No finding has been recorded; this brief must not be treated as one.',
    ],
    possibleExplanations: [
      'The records so far are consistent with more than one possibility.',
      'Only the recorded finding, chosen by the authorized user, counts as the conclusion.',
    ],
    suggestedNextSteps: [...STARTER_QUESTIONS],
  }
}

export function overviewBrief(business, products, transactions, alerts, investigations) {
  const sales = transactions.filter((t) => t.type === 'sale').reduce((s, t) => s + t.amount, 0)
  const openAlerts = alerts.filter((a) => a.status === 'New' || a.status === 'Under Review').length
  const openInv = investigations.filter((i) => i.status === 'Open' || i.status === 'Under Investigation').length
  return {
    title: `Business overview: ${business.name}`,
    knownInformation: [
      `${products.length} products and ${transactions.length} recorded transactions in the current records.`,
      `Recorded sales total ₦${sales.toLocaleString()}.`,
      `${openAlerts} alert(s) need review; ${openInv} investigation(s) are open.`,
    ],
    analysis: [
      'Totals above are straight sums of the records; they hide day-to-day variation.',
    ],
    possibleExplanations: [
      'Differences between days may reflect normal trade, promotions, or recording gaps.',
    ],
    suggestedNextSteps: [
      'Open the Dashboard for the detailed breakdown.',
      'Review any alert marked New before the day ends.',
    ],
  }
}

export function buildAlertResponse(alert, question, ctx) {
  if (question === 'why') return explainAlert(alert, ctx)
  if (question === 'transactions') return summarizeTransactions(alert, ctx)
  if (question === 'questions') return suggestQuestions(alert)
  return summarizeAlert(alert, ctx)
}
