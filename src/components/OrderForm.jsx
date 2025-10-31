import React, { useState } from 'react'
import './OrderForm.css'

function OrderForm({ total, onClose, onOrder }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    paymentMethod: '',
    notes: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.phone || !formData.paymentMethod) {
      alert('Veuillez remplir le nom, le téléphone et choisir un mode de paiement')
      return
    }
    onOrder(formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="order-overlay" onClick={onClose}>
      <div className="order-form" onClick={(e) => e.stopPropagation()}>
        <div className="order-header">
          <h2>Finaliser votre commande</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name">Nom *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Votre nom"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Téléphone *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0759402520"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="paymentMethod">Mode de paiement *</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez un mode de paiement</option>
              <option value="wave">Wave</option>
              <option value="tremo">Tremo</option>
              <option value="orange-money">Orange Money</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes spéciales (optionnel)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Allergies, préférences, etc."
              rows="3"
            />
          </div>
          <div className="order-info">
            <div className="info-item">
              <strong>Lieu de retrait :</strong> Chambre C-75
            </div>
            <div className="info-item">
              <strong>Contact :</strong> 0759402520
            </div>
          </div>
          <div className="order-total">
            <strong>Total: {total.toLocaleString()} FCFA</strong>
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="submit-button">
              Confirmer la commande
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OrderForm

