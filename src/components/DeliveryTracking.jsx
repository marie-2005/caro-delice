import React, { useState, useEffect } from 'react'
import './DeliveryTracking.css'

function DeliveryTracking({ order, onClose }) {
  const [deliveryStatus, setDeliveryStatus] = useState(order.status || 'en attente')
  const [estimatedArrival, setEstimatedArrival] = useState(null)
  const [currentPosition, setCurrentPosition] = useState(null)

  // Calculer l'estimation d'arrivée basée sur le statut
  useEffect(() => {
    const now = new Date()
    let estimatedTime = null

    switch (order.status) {
      case 'en attente':
        estimatedTime = new Date(now.getTime() + 5 * 60000) // +5 min
        break
      case 'en préparation':
        estimatedTime = new Date(now.getTime() + 15 * 60000) // +15 min
        break
      case 'prête':
        if (order.deliveryType === 'livraison') {
          estimatedTime = new Date(now.getTime() + 10 * 60000) // +10 min pour livraison
        } else {
          estimatedTime = new Date(now.getTime() + 2 * 60000) // +2 min pour retrait
        }
        break
      case 'livrée':
        estimatedTime = null // Déjà livrée
        break
      default:
        estimatedTime = null
    }

    setEstimatedArrival(estimatedTime)
  }, [order.status, order.deliveryType])

  // Statut de livraison (simulé sans carte)
  useEffect(() => {
    if (order.status === 'prête' && order.deliveryType === 'livraison') {
      // Statuts de livraison sans carte Google Maps
      const statuses = [
        { label: 'En route vers vous' },
        { label: 'À proximité' },
        { label: 'Arrivée imminente' }
      ]

      // Changer de statut toutes les 10 secondes
      let index = 0
      const interval = setInterval(() => {
        setCurrentPosition(statuses[index])
        index = (index + 1) % statuses.length
      }, 10000)

      // Statut initial
      setCurrentPosition(statuses[0])

      return () => clearInterval(interval)
    }
  }, [order.status, order.deliveryType])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'en attente':
        return '⏳'
      case 'en préparation':
        return '👨‍🍳'
      case 'prête':
        return order.deliveryType === 'livraison' ? '🚴' : '✅'
      case 'livrée':
        return '🎉'
      default:
        return '❓'
    }
  }

  const getStatusMessage = (status) => {
    switch (status) {
      case 'en attente':
        return 'Votre commande est en attente de traitement'
      case 'en préparation':
        return 'Votre commande est en cours de préparation'
      case 'prête':
        return order.deliveryType === 'livraison'
          ? 'Votre commande est prête et sera livrée bientôt'
          : 'Votre commande est prête ! Vous pouvez venir la récupérer'
      case 'livrée':
        return 'Votre commande a été livrée ! Bon appétit !'
      default:
        return 'Suivi de commande'
    }
  }

  const formatTime = (date) => {
    if (!date) return null
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const getMinutesRemaining = () => {
    if (!estimatedArrival) return null
    const now = new Date()
    const diff = estimatedArrival.getTime() - now.getTime()
    if (diff <= 0) return 0
    return Math.ceil(diff / 60000)
  }

  const minutesRemaining = getMinutesRemaining()

  return (
    <div className="delivery-tracking-overlay" onClick={onClose}>
      <div className="delivery-tracking" onClick={(e) => e.stopPropagation()}>
        <div className="tracking-header">
          <h2>📍 Suivi de Livraison</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="tracking-content">
          {/* Statut actuel */}
          <div className="tracking-status">
            <div className="status-icon">{getStatusIcon(order.status)}</div>
            <div className="status-info">
              <h3>{getStatusMessage(order.status)}</h3>
              <p className="order-id">Commande #{order.id?.slice(-6) || 'N/A'}</p>
            </div>
          </div>

          {/* Estimation d'arrivée */}
          {estimatedArrival && minutesRemaining !== null && (
            <div className="estimated-arrival">
              <div className="arrival-icon">⏰</div>
              <div className="arrival-info">
                <strong>Estimation d'arrivée :</strong>
                {minutesRemaining > 0 ? (
                  <span className="arrival-time">
                    {minutesRemaining} minute{minutesRemaining > 1 ? 's' : ''}
                    {' '}(vers {formatTime(estimatedArrival)})
                  </span>
                ) : (
                  <span className="arrival-time soon">Arrivée imminente !</span>
                )}
              </div>
            </div>
          )}

          {/* Carte retirée - Google Maps désactivé */}
          {order.deliveryType === 'livraison' && order.status === 'prête' && currentPosition && (
            <div className="delivery-status-info">
              <h4>🚴 Statut de livraison</h4>
              <div className="status-badge">
                <span className="status-icon-large">🚴</span>
                <div className="status-text">
                  <strong>{currentPosition.label}</strong>
                  <p>Votre commande est en cours de livraison</p>
                </div>
              </div>
            </div>
          )}

          {/* Adresse de livraison */}
          <div className="delivery-address">
            <h4>📍 Adresse de livraison</h4>
            <p>
              {order.deliveryType === 'livraison' 
                ? `Chambre ${order.roomNumber || 'N/A'}`
                : 'Retrait : Chambre C-75'}
            </p>
            <p className="contact-info">
              Contact : {order.customerPhone || 'N/A'}
            </p>
          </div>

          {/* Notification "Votre commande arrive" */}
          {order.status === 'prête' && order.deliveryType === 'livraison' && minutesRemaining !== null && minutesRemaining <= 5 && (
            <div className="arrival-notification">
              <div className="notification-icon">🔔</div>
              <div className="notification-text">
                <strong>Votre commande arrive !</strong>
                <p>Le livreur est à proximité</p>
              </div>
            </div>
          )}
        </div>

        <div className="tracking-footer">
          <button className="close-btn" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeliveryTracking

