import React, { useState, useEffect } from 'react'
import { isCurrentlyOpen, getBusinessStatus } from '../services/businessHoursService'
import './OrderForm.css'

function OrderForm({ total, onClose, onOrder, user, userProfile }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: user?.email || '', // Email automatique si connecté
    paymentMethod: '',
    deliveryType: 'sur-place',
    roomNumber: '',
    notes: ''
  })
  const [isOpen, setIsOpen] = useState(isCurrentlyOpen())
  const [businessStatus, setBusinessStatus] = useState(getBusinessStatus())

  // Vérifier les horaires toutes les minutes
  useEffect(() => {
    const checkHours = () => {
      setIsOpen(isCurrentlyOpen())
      setBusinessStatus(getBusinessStatus())
    }
    
    checkHours()
    const interval = setInterval(checkHours, 60000) // Toutes les minutes
    
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Vérifier si ouvert - DÉSACTIVÉ TEMPORAIREMENT POUR TEST
    // if (!isOpen) {
    //   alert(`❌ Nous sommes fermés actuellement.\n\n${businessStatus.message}\n\nMerci de réessayer pendant nos heures d'ouverture.`)
    //   return
    // }
    
    if (!formData.name || !formData.phone || !formData.paymentMethod) {
      alert('Veuillez remplir le nom, le téléphone et choisir un mode de paiement')
      return
    }
    if (formData.deliveryType === 'livraison' && !formData.roomNumber) {
      alert('Veuillez indiquer votre numéro de chambre pour la livraison')
      return
    }

    // Paiement manuel - la commande est créée et le client paie ensuite
    // Le statut de paiement sera géré manuellement par l'administrateur
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
        {/* Alerte fermeture - DÉSACTIVÉ TEMPORAIREMENT POUR TEST */}
        {/* {!isOpen && (
          <div className="closed-alert">
            <p>🔴 <strong>Fermé actuellement</strong></p>
            <p className="closed-message">{businessStatus.message}</p>
          </div>
        )} */}
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
            <label htmlFor="email">Email (optionnel)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={user ? user.email : "votre@email.com"}
              disabled={!!user}
              title={user ? "Email de votre compte" : ""}
            />
            {user && <small style={{color: 'var(--text-secondary)', fontSize: '0.75rem'}}>Utilise votre email de connexion</small>}
          </div>
          <div className="form-group">
            <label htmlFor="deliveryType">Mode de réception *</label>
            <select
              id="deliveryType"
              name="deliveryType"
              value={formData.deliveryType}
              onChange={handleChange}
              required
            >
              <option value="sur-place">Retrait sur place (Chambre C-75)</option>
              <option value="livraison">Livraison</option>
            </select>
          </div>
          
          {formData.deliveryType === 'livraison' && (
            <div className="form-group">
              <label htmlFor="roomNumber">Numéro de chambre *</label>
              <input
                type="text"
                id="roomNumber"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                placeholder="Ex: A-25, B-10, C-75"
                required={formData.deliveryType === 'livraison'}
              />
            </div>
          )}
          
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
              <option value="orange-money">Orange Money</option>
              <option value="tremo">Tremo</option>
              <option value="especes">Espèces</option>
            </select>
          </div>
          {/* Rappel des allergies si enregistrées */}
          {userProfile && userProfile.allergies && (
            <div className="allergies-reminder">
              <div className="reminder-icon">⚠️</div>
              <div className="reminder-content">
                <strong>Rappel - Vos allergies/intolérances :</strong>
                <p>{userProfile.allergies}</p>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="notes">Notes spéciales (optionnel)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Instructions spéciales, préférences, etc."
              rows="3"
            />
          </div>
          {/* Code promo appliqué */}
          {(() => {
            const promoData = sessionStorage.getItem('applied_promo')
            if (promoData) {
              try {
                const promo = JSON.parse(promoData)
                return (
                  <div className="promo-applied-info">
                    <strong>🎁 Code promo appliqué :</strong> {promo.code} (-{promo.discount}%)
                    <br />
                    <small>Économie : {promo.discountAmount.toLocaleString()} FCFA</small>
                  </div>
                )
              } catch (e) {
                return null
              }
            }
            return null
          })()}

          <div className="order-info">
            {formData.deliveryType === 'sur-place' ? (
              <>
                <div className="info-item">
                  <strong>Lieu de retrait :</strong> Chambre C-75
                </div>
                <div className="info-item">
                  <strong>Contact :</strong> 0759402520
                </div>
              </>
            ) : (
              <>
                <div className="info-item">
                  <strong>Livraison à :</strong> Chambre {formData.roomNumber || '(à remplir)'}
                </div>
                <div className="info-item">
                  <strong>Contact client :</strong> {formData.phone || '(à remplir)'}
                </div>
              </>
            )}
          </div>
          <div className="order-total">
            <strong>Total: {total.toLocaleString()} FCFA</strong>
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Annuler
            </button>
            <button 
              type="submit" 
              className="submit-button"
              // disabled={!isOpen} // DÉSACTIVÉ TEMPORAIREMENT POUR TEST
              // style={!isOpen ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              Confirmer la commande
              {/* {isOpen ? 'Confirmer la commande' : 'Fermé - Commande impossible'} */}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OrderForm

