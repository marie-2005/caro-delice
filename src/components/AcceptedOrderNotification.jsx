import React from 'react'
import './AcceptedOrderNotification.css'

function AcceptedOrderNotification({ notification, onClose }) {
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
    <div className="accepted-order-overlay">
      <div className="accepted-order-modal">
        <div className="accepted-order-header">
          <h2>Commande acceptée !</h2>
          <button className="accepted-order-close-x" onClick={onClose} title="Fermer">
            ×
          </button>
        </div>
        <div className="accepted-order-content">
          <div className="accepted-order-icon">✅</div>
          <p className="accepted-order-message">
            Votre commande <strong>#{notification.orderId?.slice(-6) || 'N/A'}</strong> a été acceptée et est maintenant en cours de préparation !
          </p>
          
          <div className="accepted-order-details">
            <div className="detail-item">
              <strong>Date de commande :</strong> {formatDate(notification.orderDate)}
            </div>
            <div className="detail-item">
              <strong>Total :</strong> {notification.orderTotal?.toLocaleString() || 0} FCFA
            </div>
            {notification.orderItems && notification.orderItems.length > 0 && (
              <div className="detail-item">
                <strong>Articles :</strong>
                <ul className="items-list">
                  {notification.orderItems.map((item, index) => (
                    <li key={index}>
                      {item.quantity}x {item.name} - {item.price?.toLocaleString() || 0} FCFA
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="accepted-order-info">
            <p>🍳 Votre commande est en cours de préparation. Vous serez notifié lorsqu'elle sera prête !</p>
          </div>

          <button className="accepted-order-close-btn" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

export default AcceptedOrderNotification

