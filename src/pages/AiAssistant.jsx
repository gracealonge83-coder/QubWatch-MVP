import { useState } from 'react'
import {
  buildAlertResponse, briefInvestigation, overviewBrief, FAIRNESS_NOTE,
} from '../ai/mockAssistant.js'

// Stage 5 AI Assistant (PRD Sections 28-29). Controlled mock responses only.
// Read-only: this page never records findings or resolves anything.
const ALERT_QUESTIONS = [
  { id: 'summarize', label: 'Summarize this alert' },
  { id: 'why', label: 'Why was this alert generated?' },
  { id: 'transactions', label: 'Summarize related transactions' },
  { id: 'questions', label: 'Suggest investigation questions' },
]

function AiAssistant({
  business, alerts, investigations, products, transactions, users,
  initialContext, thresholds, onOpenAlert, onOpenInvestigation,
}) {
  const [contextType, setContextType] = useState(initialContext.type)
  const [contextId, setContextId] = useState(initialContext.id)
  const [request, setRequest] = useState(null)

  const productById = Object.fromEntries(products.map((p) => [p.id, p]))
  const txnById = Object.fromEntries(transactions.map((t) => [t.id, t]))
  const userById = Object.fromEntries(users.map((u) => [u.id, u]))
  const ctx = { productById, txnById, userById, thresholds }
  const alertById = Object.fromEntries(alerts.map((a) => [a.id, a]))
  const invById = Object.fromEntries(investigations.map((i) => [i.id, i]))

  function ask(question) {
    if (contextType === 'alert' && !alertById[contextId]) return
    if (contextType === 'investigation' && !invById[contextId]) return
    setRequest({ contextType, contextId, question })
  }

  let response = null
  if (request) {
    if (request.contextType === 'alert' && alertById[request.contextId]) {
      response = {
        kind: 'alert',
        id: request.contextId,
        ...buildAlertResponse(alertById[request.contextId], request.question, ctx),
      }
    } else if (request.contextType === 'investigation' && invById[request.contextId]) {
      const inv = invById[request.contextId]
      response = {
        kind: 'investigation',
        id: request.contextId,
        ...briefInvestigation(inv, alertById[inv.alertId] || null, ctx),
      }
    } else if (request.contextType === 'overview') {
      response = { kind: 'overview', id: null, ...overviewBrief(business, products, transactions, alerts, investigations) }
    }
  }

  const questions = contextType === 'investigation'
    ? [
      { id: 'summarize', label: 'Summarize this investigation' },
      { id: 'questions', label: 'Suggest investigation questions' },
    ]
    : ALERT_QUESTIONS

  return (
    <div className="grid">
      <div className="card">
        <h2>AI Assistant</h2>
        <p className="muted">Explanations based on your business records. The assistant supports you; you decide.</p>
        <div className="form">
          <label>
            Context
            <select
              value={contextType}
              onChange={(e) => { setContextType(e.target.value); setContextId(null); setRequest(null) }}
            >
              <option value="overview">Business overview</option>
              <option value="alert">Alert</option>
              <option value="investigation">Investigation</option>
            </select>
          </label>
          {contextType === 'alert' && (
            <label>
              Alert
              <select
                value={contextId || ''}
                onChange={(e) => { setContextId(e.target.value || null); setRequest(null) }}
              >
                <option value="">Select an alert</option>
                {alerts.map((a) => (
                  <option key={a.id} value={a.id}>{a.type} — {a.severity} — {a.status}</option>
                ))}
              </select>
            </label>
          )}
          {contextType === 'investigation' && (
            <label>
              Investigation
              <select
                value={contextId || ''}
                onChange={(e) => { setContextId(e.target.value || null); setRequest(null) }}
              >
                <option value="">Select an investigation</option>
                {investigations.map((i) => (
                  <option key={i.id} value={i.id}>{i.id} — {i.status}</option>
                ))}
              </select>
            </label>
          )}
          {contextType === 'overview' && (
            <button type="button" className="primary-btn" onClick={() => ask('summarize')}>
              Summarize business activity
            </button>
          )}
          {(contextType !== 'overview' && contextId) && (
            <div className="form-row">
              {questions.map((q) => (
                <button key={q.id} type="button" className="secondary-btn" onClick={() => ask(q.id)}>
                  {q.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2>Response</h2>
        <p className="ai-disclaimer">This assistant explains records; it does not decide, judge staff or prove wrongdoing.</p>
        {!response ? (
          <p className="muted">Choose a context and a question to receive a response.</p>
        ) : (
          <div>
            <h3>{response.title}</h3>
            <div className="ai-section">
              <h3>Known Information</h3>
              <ul>
                {response.knownInformation.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
            <div className="ai-section">
              <h3>Analysis</h3>
              <ul>
                {response.analysis.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
            <div className="ai-section">
              <h3>Possible Explanations</h3>
              <ul>
                {response.possibleExplanations.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
            <div className="ai-section">
              <h3>Suggested Next Steps</h3>
              <ul>
                {response.suggestedNextSteps.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
            <p className="muted">{FAIRNESS_NOTE}</p>
            <div className="form-row">
              {response.kind === 'alert' && (
                <button className="secondary-btn" onClick={() => onOpenAlert(response.id)}>View alert</button>
              )}
              {response.kind === 'investigation' && (
                <button className="secondary-btn" onClick={() => onOpenInvestigation(response.id)}>View investigation</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AiAssistant
