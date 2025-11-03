import React from 'react'
import { printOrderTicket, printKitchenTicket, printDeliveryTicket } from '../services/printService'
import './OrderPrint.css'

function OrderPrint({ order, onClose }) {
  if (!order) return null

  const handlePrint = (type) => {
    let success = false
    
    switch (type) {
      case 'order':
        success = printOrderTicket(order)
        break
      case 'kitchen':
        success = printKitchenTicket(order)
        break
      case 'delivery':
        success = printDeliveryTicket(order)
        break
      default:
        break
    }
    
    if (!success) {
      alert('❌ Impossible d\'ouvrir la fenêtre d\'impression. Vérifiez que les pop-ups ne sont pas bloquées.')
    }
  }

  return (
    <div className="print-overlay" onClick={onClose}>
      <div className="print-modal" onClick={(e) => e.stopPropagation()}>
        <div className="print-header">
          <h2>🖨️ Imprimer Ticket</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="print-content">
          <div className="print-order-info">
            <p><strong>Commande:</strong> #{order.id.toString().slice(-6)}</p>
            <p><strong>Client:</strong> {order.customerName || order.name}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt || order.date).toLocaleString('fr-FR')}</p>
          </div>

          <div className="print-options">
            <div className="print-option-card">
              <div className="print-option-icon">💰</div>
              <div className="print-option-content">
                <h3>Ticket de Commande</h3>
                <p>Ticket pour la caisse</p>
              </div>
              <button 
                className="print-option-button"
                onClick={() => handlePrint('order')}
              >
                Imprimer
              </button>
            </div>

            <div className="print-option-card">
              <div className="print-option-icon">👨‍🍳</div>
              <div className="print-option-content">
                <h3>Ticket Cuisine</h3>
                <p>Ticket de préparation</p>
              </div>
              <button 
                className="print-option-button"
                onClick={() => handlePrint('kitchen')}
              >
                Imprimer
              </button>
            </div>

            {order.deliveryType === 'livraison' && (
              <div className="print-option-card">
                <div className="print-option-icon">🚚</div>
                <div className="print-option-content">
                  <h3>Ticket Livraison</h3>
                  <p>Pour le livreur</p>
                </div>
                <button 
                  className="print-option-button"
                  onClick={() => handlePrint('delivery')}
                >
                  Imprimer
                </button>
              </div>
            )}
          </div>

          <div className="print-tips">
            <p><strong>💡 Astuce:</strong> Assurez-vous que votre imprimante thermique est configurée sur 80mm de largeur.</p>
          </div>
        </div>

        <div className="print-footer">
          <button className="cancel-button" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderPrint
