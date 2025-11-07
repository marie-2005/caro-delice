import React from 'react'
import './DeletedOrderNotification.css'

function DeletedOrderNotification({ notification, onClose }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'Date invalide'
    }
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="deleted-order-overlay">
      <div className="deleted-order-modal">
        <div className="deleted-order-header">
          <h2>Commande annulée</h2>
        </div>
        <div className="deleted-order-content">
          <div className="deleted-order-icon">❌</div>
          <p className="deleted-order-message">
            Votre commande <strong>#{notification.orderId?.slice(-6) || 'N/A'}</strong> a été annulée par l'administrateur.
          </p>
          
          <div className="deleted-order-details">
            <div className="detail-row">
              <span className="detail-label">Date de commande :</span>
              <span className="detail-value">{formatDate(notification.orderDate)}</span>
            </div>
            
            {notification.orderItems && notification.orderItems.length > 0 && (
              <div className="detail-row">
                <span className="detail-label">Articles :</span>
                <div className="detail-items">
                  <ul>
                    {notification.orderItems.map((item, index) => (
                      <li key={index}>
                        {item.quantity}x {item.name} - {item.price?.toLocaleString()} FCFA
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {notification.orderTotal > 0 && (
              <div className="detail-row">
                <span className="detail-label">Total :</span>
                <span className="detail-value">{notification.orderTotal.toLocaleString()} FCFA</span>
              </div>
            )}
          </div>
        </div>
        <div className="deleted-order-footer">
          <button className="deleted-order-ok-button" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeletedOrderNotification

