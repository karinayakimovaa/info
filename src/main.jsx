import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './style.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from "@vercel/speed-insights/react"

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
    <Analytics />
    <SpeedInsights />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: '12px',
          background: '#2f251d',
          color: '#fff6eb',
          fontFamily: 'Manrope, sans-serif',
        },
      }}
    />
  </React.StrictMode>,
)
