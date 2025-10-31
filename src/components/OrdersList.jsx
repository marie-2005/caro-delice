import React from 'react'
import './OrdersList.css'

function OrdersList({ orders, onUpdateStatus, onDelete, isAdmin, currentUserId }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue'
    const date = new Date(dateString)
    // Vérifier si la date est valide
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'en attente':
        return 'status-pending'
      case 'en préparation':
        return 'status-preparing'
      case 'prête':
        return 'status-ready'
      case 'livrée':
        return 'status-delivered'
      case 'annulée':
        return 'status-cancelled'
      default:
        return ''
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'en attente':
        return 'En attente'
      case 'en préparation':
        return 'En préparation'
      case 'prête':
        return 'Prête'
      case 'livrée':
        return 'Livrée'
      case 'annulée':
        return 'Annulée'
      default:
        return status
    }
  }

  const pendingOrders = orders.filter(o => o.status === 'en attente')
  const otherOrders = orders.filter(o => o.status !== 'en attente')

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <p>{isAdmin ? 'Aucune commande pour le moment' : 'Vous n\'avez aucune commande. Connectez-vous pour voir vos commandes passées.'}</p>
      </div>
    )
  }

  return (
    <div className="orders-list">
      <h2 className="orders-title">Liste des Commandes</h2>
      
      {isAdmin && pendingOrders.length > 0 && (
        <div className="orders-section">
          <h3 className="section-title">En attente ({pendingOrders.length})</h3>
          <div className="orders-grid">
            {pendingOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                formatDate={formatDate}
                getStatusColor={getStatusColor}
                getStatusLabel={getStatusLabel}
                onUpdateStatus={onUpdateStatus}
                onDelete={onDelete}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        </div>
      )}

      {(isAdmin ? otherOrders : orders).length > 0 && (
        <div className="orders-section">
          <h3 className="section-title">{isAdmin ? `Autres commandes (${otherOrders.length})` : 'Mes commandes'}</h3>
          <div className="orders-grid">
            {(isAdmin ? otherOrders : orders).map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                formatDate={formatDate}
                getStatusColor={getStatusColor}
                getStatusLabel={getStatusLabel}
                onUpdateStatus={onUpdateStatus}
                onDelete={onDelete}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function OrderCard({ order, formatDate, getStatusColor, getStatusLabel, onUpdateStatus, onDelete, isAdmin }) {
  return (
    <div className="order-card">
      <div className="order-header-card">
        <div>
          <div className="order-id">Commande #{order.id.toString().slice(-6)}</div>
          <div className="order-date">{formatDate(order.createdAt || order.date)}</div>
        </div>
        <span className={`order-status ${getStatusColor(order.status)}`}>
          {getStatusLabel(order.status)}
        </span>
      </div>

      <div className="order-customer">
        <div><strong>Client:</strong> {order.customerName || order.name}</div>
        <div><strong>Téléphone:</strong> {order.customerPhone || order.phone}</div>
        {order.customerEmail && <div><strong>Email:</strong> {order.customerEmail}</div>}
        <div><strong>Mode:</strong> {order.deliveryType === 'livraison' ? 'Livraison' : 'Sur place'}</div>
        {order.deliveryType === 'livraison' && order.roomNumber && (
          <div><strong>Chambre:</strong> {order.roomNumber}</div>
        )}
        {order.deliveryType === 'sur-place' && (
          <div><strong>Retrait:</strong> Chambre C-75</div>
        )}
        <div><strong>Paiement:</strong> {order.paymentMethod === 'wave' ? 'Wave' : order.paymentMethod === 'tremo' ? 'Tremo' : 'Orange Money'}</div>
      </div>

      <div className="order-items">
        <strong>Articles:</strong>
        <ul>
          {order.items.map((item, index) => (
            <li key={index}>
              {item.quantity}x {item.name} - {item.price.toLocaleString()} FCFA
            </li>
          ))}
        </ul>
      </div>

      {order.notes && (
        <div className="order-notes">
          <strong>Notes:</strong> {order.notes}
        </div>
      )}

      <div className="order-total-card">
        <strong>Total: {order.total.toLocaleString()} FCFA</strong>
      </div>

      {isAdmin && (
        <div className="order-actions">
          <select
            value={order.status}
            onChange={(e) => onUpdateStatus(order.id, e.target.value)}
            className="status-select"
          >
            <option value="en attente">En attente</option>
            <option value="en préparation">En préparation</option>
            <option value="prête">Prête</option>
            <option value="livrée">Livrée</option>
            <option value="annulée">Annulée</option>
          </select>
          <button
            className="delete-button"
            onClick={() => onDelete(order.id)}
            title="Supprimer"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}

export default OrdersList

