import React, { useState, useEffect } from 'react'
import './EditOrderModal.css'

function EditOrderModal({ order, onClose, onUpdate, menuItems }) {
  const [items, setItems] = useState([])
  const [notes, setNotes] = useState('')
  const [deliveryType, setDeliveryType] = useState('sur-place')
  const [roomNumber, setRoomNumber] = useState('')

  // Initialiser les données depuis la commande
  useEffect(() => {
    if (order) {
      setItems([...order.items])
      setNotes(order.notes || '')
      setDeliveryType(order.deliveryType || 'sur-place')
      setRoomNumber(order.roomNumber || '')
    }
  }, [order])

  // Calculer le total
  const getTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  // Mettre à jour la quantité d'un article
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      // Supprimer l'article si quantité <= 0
      setItems(items.filter((_, i) => i !== index))
      return
    }
    
    const updatedItems = [...items]
    updatedItems[index] = {
      ...updatedItems[index],
      quantity: newQuantity
    }
    setItems(updatedItems)
  }

  // Supprimer un article
  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }

  // Ajouter un article depuis le menu
  const addItem = (menuItem) => {
    const existingItemIndex = items.findIndex(item => item.id === menuItem.id)
    
    if (existingItemIndex >= 0) {
      // Augmenter la quantité si l'article existe déjà
      updateQuantity(existingItemIndex, items[existingItemIndex].quantity + 1)
    } else {
      // Ajouter un nouvel article
      setItems([...items, {
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1
      }])
    }
  }

  // Valider et sauvegarder les modifications
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (items.length === 0) {
      alert('Votre commande doit contenir au moins un article')
      return
    }

    if (deliveryType === 'livraison' && !roomNumber) {
      alert('Veuillez indiquer votre numéro de chambre pour la livraison')
      return
    }

    try {
      const orderData = {
        items,
        notes,
        deliveryType,
        roomNumber: deliveryType === 'livraison' ? roomNumber : null
      }

      await onUpdate(order.id, orderData)
      alert('Commande modifiée avec succès!')
      onClose()
    } catch (error) {
      console.error('Erreur lors de la modification:', error)
      alert('Erreur lors de la modification de la commande: ' + (error.message || 'Erreur inconnue'))
    }
  }

  if (!order) {
    return null
  }

  return (
    <div className="edit-order-overlay" onClick={onClose}>
      <div className="edit-order-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-order-header">
          <h2>Modifier ma commande</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="edit-order-form">
          {/* Articles de la commande */}
          <div className="edit-order-section">
            <h3>Articles</h3>
            {items.length === 0 ? (
              <p className="empty-message">Aucun article dans la commande</p>
            ) : (
              <div className="order-items-list">
                {items.map((item, index) => (
                  <div key={index} className="order-item-edit">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">{item.price.toLocaleString()} FCFA</span>
                    </div>
                    <div className="item-controls">
                      <button
                        type="button"
                        className="quantity-btn"
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button
                        type="button"
                        className="quantity-btn"
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeItem(index)}
                        title="Supprimer"
                      >
                        ×
                      </button>
                    </div>
                    <div className="item-subtotal">
                      Sous-total: {(item.price * item.quantity).toLocaleString()} FCFA
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ajouter des articles */}
          {menuItems && menuItems.length > 0 && (
            <div className="edit-order-section">
              <h3>Ajouter des articles</h3>
              <div className="menu-items-grid">
                {menuItems.map((menuItem) => (
                  <button
                    key={menuItem.id}
                    type="button"
                    className="menu-item-btn"
                    onClick={() => addItem(menuItem)}
                  >
                    <span className="menu-item-name">{menuItem.name}</span>
                    <span className="menu-item-price">{menuItem.price.toLocaleString()} FCFA</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mode de réception */}
          <div className="edit-order-section">
            <h3>Mode de réception</h3>
            <select
              value={deliveryType}
              onChange={(e) => setDeliveryType(e.target.value)}
              className="form-select"
            >
              <option value="sur-place">Retrait sur place (Chambre C-75)</option>
              <option value="livraison">Livraison</option>
            </select>
            
            {deliveryType === 'livraison' && (
              <div className="form-group">
                <label htmlFor="roomNumber">Numéro de chambre *</label>
                <input
                  type="text"
                  id="roomNumber"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="Ex: A-25, B-10, C-75"
                  required={deliveryType === 'livraison'}
                  className="form-input"
                />
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="edit-order-section">
            <h3>Notes spéciales (optionnel)</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instructions spéciales, préférences, etc."
              rows="3"
              className="form-textarea"
            />
          </div>

          {/* Total */}
          <div className="edit-order-total">
            <strong>Nouveau total: {getTotal().toLocaleString()} FCFA</strong>
            {getTotal() !== order.total && (
              <span className="total-diff">
                (Ancien total: {order.total.toLocaleString()} FCFA)
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="edit-order-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="submit-btn">
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditOrderModal

