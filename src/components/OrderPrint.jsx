import React from 'react'
import './OrderPrint.css'

function OrderPrint({ order, onClose }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Date invalide'
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="print-overlay">
      <div className="print-content">
        <div className="print-actions">
          <button onClick={handlePrint} className="print-btn">
            🖨️ Imprimer
          </button>
          <button onClick={onClose} className="close-btn">
            ✕ Fermer
          </button>
        </div>

        <div className="ticket" id="order-ticket">
          <div className="ticket-header">
            <h1>LES DÉLICES DE CARO</h1>
            <p>Ouvert uniquement les samedis</p>
          </div>

          <div className="ticket-section">
            <div className="ticket-info">
              <div><strong>Ticket #</strong>{order.id.toString().slice(-6)}</div>
              <div><strong>Date:</strong> {formatDate(order.createdAt || order.date)}</div>
            </div>
          </div>

          <div className="ticket-section">
            <h3>Client</h3>
            <div className="ticket-details">
              <div><strong>Nom:</strong> {order.customerName || order.name}</div>
              <div><strong>Téléphone:</strong> {order.customerPhone || order.phone}</div>
              {order.customerEmail && <div><strong>Email:</strong> {order.customerEmail}</div>}
            </div>
          </div>

          <div className="ticket-section">
            <h3>Livraison</h3>
            <div className="ticket-details">
              <div><strong>Type:</strong> {order.deliveryType === 'livraison' ? 'Livraison' : 'Sur place'}</div>
              {order.roomNumber && <div><strong>Chambre:</strong> {order.roomNumber}</div>}
              {order.deliveryType === 'sur-place' && <div><strong>Retrait:</strong> Chambre C-75</div>}
            </div>
          </div>

          <div className="ticket-section">
            <h3>Articles</h3>
            <table className="ticket-items">
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Qté</th>
                  <th>Prix</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price.toLocaleString()} FCFA</td>
                    <td>{(item.price * item.quantity).toLocaleString()} FCFA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ticket-section">
            <div className="ticket-total">
              <strong>TOTAL: {order.total.toLocaleString()} FCFA</strong>
            </div>
          </div>

          <div className="ticket-section">
            <div className="ticket-details">
              <div><strong>Paiement:</strong> {
                order.paymentMethod === 'wave' ? 'Wave' :
                order.paymentMethod === 'mtn' ? 'MTN Mobile Money' :
                order.paymentMethod === 'orange-money' ? 'Orange Money' :
                order.paymentMethod === 'tremo' ? 'Tremo' :
                order.paymentMethod === 'especes' ? 'Espèces' :
                order.paymentMethod
              }</div>
              <div><strong>Statut:</strong> {
                order.status === 'en attente' ? 'En attente' :
                order.status === 'en préparation' ? 'En préparation' :
                order.status === 'prête' ? 'Prête' :
                order.status === 'livrée' ? 'Livrée' :
                order.status === 'annulée' ? 'Annulée' :
                order.status
              }</div>
            </div>
          </div>

          {order.notes && (
            <div className="ticket-section">
              <div className="ticket-notes">
                <strong>Notes:</strong> {order.notes}
              </div>
            </div>
          )}

          <div className="ticket-footer">
            <p>Merci pour votre commande !</p>
            <p>Bon appétit ! 🍴</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderPrint

