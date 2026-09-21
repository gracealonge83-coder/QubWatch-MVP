import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Stage 6 PWA: activate the generated service worker in production builds.
// Dev server is unaffected. No behavior change to the app itself.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  registerSW({ immediate: true })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
