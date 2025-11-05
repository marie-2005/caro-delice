import React from 'react'
import { getBusinessStatus } from '../services/businessHoursService'
import './BusinessHours.css'

function BusinessHours() {
  const status = getBusinessStatus()

  // Ne rien afficher pendant la période exceptionnelle
  if (status.isExceptional) {
    return null
  }

  return (
    <div className="business-hours">
      <div className={`hours-status ${status.isOpen ? 'open' : 'closed'}`}>
        <div className="status-indicator">
          <span className={`status-dot ${status.isOpen ? 'dot-open' : 'dot-closed'}`}></span>
          <span className="status-text">
            {status.isOpen ? '🟢 Ouvert' : '🔴 Fermé'}
          </span>
        </div>
        <p className="status-message">{status.message}</p>
      </div>
    </div>
  )
}

export default BusinessHours

