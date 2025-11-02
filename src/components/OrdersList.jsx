import React, { useState } from 'react'
import { getRemainingTime, getPreparationTime } from '../services/orderStatusService'
import OrderRating from './OrderRating'
import DeliveryTracking from './DeliveryTracking'
import { getOrderRating } from '../services/ratingService'
import './OrdersList.css'

function OrdersList({ orders, onUpdateStatus, onDelete, onDeleteAll, isAdmin, currentUserId }) {
  // Par défaut, afficher les commandes du samedi en cours pour l'admin
  const [dateFilter, setDateFilter] = useState(isAdmin ? 'ce-samedi' : 'toutes')
  const [statusFilter, setStatusFilter] = useState('tous')
  const [ratingOrderId, setRatingOrderId] = useState(null)
  const [printOrderId, setPrintOrderId] = useState(null)
  const [trackingOrderId, setTrackingOrderId] = useState(null)
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

  // Fonction pour obtenir l'ordre de priorité du statut
  const getStatusPriority = (status) => {
    switch (status) {
      case 'en attente':
        return 1
      case 'en préparation':
        return 2
      case 'prête':
        return 3
      case 'livrée':
        return 4
      case 'annulée':
        return 5
      default:
        return 99
    }
  }

  // Trier les commandes : d'abord par statut, puis par date (plus récente en premier)
  const sortOrders = (ordersList) => {
    return [...ordersList].sort((a, b) => {
      // D'abord trier par statut (priorité)
      const statusA = getStatusPriority(a.status)
      const statusB = getStatusPriority(b.status)
      
      if (statusA !== statusB) {
        return statusA - statusB
      }
      
      // Si même statut, trier par date (plus récente en premier)
      const dateA = a.createdAt || a.date || ''
      const dateB = b.createdAt || b.date || ''
      
      if (dateA && dateB) {
        return new Date(dateB) - new Date(dateA)
      }
      
      return 0
    })
  }

  // Fonction pour obtenir le samedi de cette semaine
  const getThisSaturday = () => {
    const now = new Date()
    const day = now.getDay() // 0 = dimanche, 6 = samedi
    const diff = 6 - day // Nombre de jours jusqu'au samedi (0 si on est samedi)
    
    // Créer la date du samedi (début de la journée à 00:00)
    const saturday = new Date(now)
    if (diff === 6) {
      // Si dimanche, prendre samedi dernier
      saturday.setDate(now.getDate() - 1)
    } else {
      saturday.setDate(now.getDate() + diff)
    }
    saturday.setHours(0, 0, 0, 0)
    
    return saturday
  }

  // Fonction pour obtenir le dimanche suivant (fin du samedi à 23:59:59)
  const getNextSunday = (saturday) => {
    const sunday = new Date(saturday)
    sunday.setDate(saturday.getDate() + 1)
    sunday.setHours(23, 59, 59, 999)
    return sunday
  }

  // Fonction pour filtrer par date
  const filterByDate = (orderList) => {
    if (dateFilter === 'toutes') return orderList
    
    const now = new Date()
    
    switch (dateFilter) {
      case 'ce-samedi':
        // Commandes du samedi en cours (du samedi 00:00 au dimanche 23:59)
        const thisSaturday = getThisSaturday()
        const nextSunday = getNextSunday(thisSaturday)
        return orderList.filter(order => {
          const orderDate = new Date(order.createdAt || order.date)
          return orderDate >= thisSaturday && orderDate <= nextSunday
        })
      case 'heure':
        // Dernière heure
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
        return orderList.filter(order => {
          const orderDate = new Date(order.createdAt || order.date)
          return orderDate >= oneHourAgo
        })
      case 'semaine':
        // Dernière semaine (7 derniers jours)
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return orderList.filter(order => {
          const orderDate = new Date(order.createdAt || order.date)
          return orderDate >= oneWeekAgo
        })
      case 'mois':
        // Dernier mois (30 derniers jours)
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        return orderList.filter(order => {
          const orderDate = new Date(order.createdAt || order.date)
          return orderDate >= oneMonthAgo
        })
      default:
        return orderList
    }
  }

  // Fonction pour filtrer par statut
  const filterByStatus = (orderList) => {
    if (statusFilter === 'tous') return orderList
    return orderList.filter(order => order.status === statusFilter)
  }

  // Filtrer et trier les commandes
  let filteredOrders = orders
  
  // Appliquer le filtre de statut
  filteredOrders = filterByStatus(filteredOrders)
  
  // Appliquer le filtre de date
  filteredOrders = filterByDate(filteredOrders)
  
  // Trier les commandes filtrées (par statut puis par date)
  const sortedOrders = sortOrders(filteredOrders)

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <p>{isAdmin ? 'Aucune commande pour le moment' : 'Vous n\'avez aucune commande. Connectez-vous pour voir vos commandes passées.'}</p>
      </div>
    )
  }

  return (
    <div className="orders-list">
      <div className="orders-header">
        <h2 className="orders-title">Liste des Commandes</h2>
        
        {/* Bouton visible UNIQUEMENT pour les admins */}
        {isAdmin === true && onDeleteAll && (
          <button 
            className="delete-all-button"
            onClick={onDeleteAll}
            title="Supprimer toutes les commandes de test (Admin uniquement)"
          >
            🗑️ Supprimer toutes les commandes
          </button>
        )}
        
        <div className="orders-filters">
          <div className="filter-group">
            <label htmlFor="date-filter">Date :</label>
            <select
              id="date-filter"
              className="filter-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="toutes">Toutes</option>
              <option value="ce-samedi">Ce samedi</option>
              <option value="heure">Dernière heure</option>
              <option value="semaine">Dernière semaine</option>
              <option value="mois">Dernier mois</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="status-filter">Statut :</label>
            <select
              id="status-filter"
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="tous">Tous</option>
              <option value="en attente">En attente</option>
              <option value="en préparation">En préparation</option>
              <option value="prête">Prête</option>
              <option value="livrée">Livrée</option>
              <option value="annulée">Annulée</option>
            </select>
          </div>
        </div>
      </div>
      
      {sortedOrders.length > 0 ? (
        <div className="orders-section">
          <h3 className="section-title">
            {isAdmin 
              ? `Commandes (${sortedOrders.length})` 
              : `Mes commandes (${sortedOrders.length})`}
          </h3>
          <div className="orders-grid">
            {sortedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  formatDate={formatDate}
                  getStatusColor={getStatusColor}
                  getStatusLabel={getStatusLabel}
                  onUpdateStatus={onUpdateStatus}
                  onDelete={onDelete}
                  isAdmin={isAdmin}
                  ratingOrderId={ratingOrderId}
                  setRatingOrderId={setRatingOrderId}
                  printOrderId={printOrderId}
                  setPrintOrderId={setPrintOrderId}
                  trackingOrderId={trackingOrderId}
                  setTrackingOrderId={setTrackingOrderId}
                  currentUserId={currentUserId}
                />
            ))}
          </div>
        </div>
      ) : (
        <div className="orders-empty">
          <p>Aucune commande ne correspond aux filtres sélectionnés.</p>
        </div>
      )}
    </div>
  )
}

function OrderCard({ order, formatDate, getStatusColor, getStatusLabel, onUpdateStatus, onDelete, isAdmin, ratingOrderId, setRatingOrderId, printOrderId, setPrintOrderId, trackingOrderId, setTrackingOrderId, currentUserId }) {
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

      {/* Estimation du temps de préparation */}
      {!isAdmin && (
        <div className="order-time-estimate">
          <span className="time-icon">⏱️</span>
          <span className="time-text">{getRemainingTime(order.status, order.createdAt)}</span>
        </div>
      )}

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
            className="print-button"
            onClick={() => setPrintOrderId(order.id)}
            title="Imprimer le ticket"
          >
            🖨️
          </button>
          <button
            className="delete-button"
            onClick={() => onDelete(order.id)}
            title="Supprimer"
          >
            ×
          </button>
        </div>
      )}
      
      {!isAdmin && order.status === 'en attente' && (
        <div className="order-actions">
          <button
            className="delete-button"
            onClick={() => onDelete(order.id)}
            title="Annuler ma commande"
            style={{width: '100%', marginTop: '0.5rem'}}
          >
            Annuler ma commande
          </button>
        </div>
      )}

      {/* Bouton de notation pour les commandes livrées */}
      {!isAdmin && (order.status === 'livrée' || order.status === 'prête') && (
        <div className="order-actions">
          <button
            className="rate-button"
            onClick={() => setRatingOrderId(order.id)}
            title="Noter le service"
          >
            {getOrderRating(order.id) ? '⭐ Voir ma note' : '⭐ Noter le service'}
          </button>
        </div>
      )}

      {/* Modal de notation */}
      {ratingOrderId === order.id && (
        <OrderRating
          orderId={order.id}
          onClose={() => setRatingOrderId(null)}
        />
      )}

      {/* Modal d'impression */}
      {printOrderId === order.id && (
        <OrderPrint
          order={order}
          onClose={() => setPrintOrderId(null)}
        />
      )}

      {/* Bouton de suivi pour les clients (livraison uniquement) */}
      {!isAdmin && order.deliveryType === 'livraison' && order.status !== 'annulée' && order.status !== 'livrée' && (
        <div className="order-actions">
          <button
            className="tracking-button"
            onClick={() => setTrackingOrderId(order.id)}
            title="Suivre ma livraison"
          >
            📍 Suivre la livraison
          </button>
        </div>
      )}

      {/* Modal de suivi */}
      {trackingOrderId === order.id && (
        <DeliveryTracking
          order={order}
          onClose={() => setTrackingOrderId(null)}
        />
      )}
    </div>
  )
}

export default OrdersList

