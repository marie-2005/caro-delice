import React, { useState } from 'react'
import PromoCode from './PromoCode'
import { applyPromoCodeToTotal } from '../services/promoService'
import './Cart.css'

function Cart({ cart, total, onClose, onRemove, onUpdateQuantity, onCheckout, user = null }) {
  const [appliedPromo, setAppliedPromo] = useState(null)
  
  // Vérifier si c'est samedi - DÉSACTIVÉ TEMPORAIREMENT
  // const today = new Date()
  // const dayOfWeek = today.getDay()
  const isSaturday = true // Toujours activé temporairement
  
  // Calculer le total avec code promo
  const finalTotal = appliedPromo ? appliedPromo.total : total
  const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0
  
  const handleCheckout = () => {
    // DÉSACTIVÉ TEMPORAIREMENT
    // if (!isSaturday) {
    //   const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
    //   const currentDay = days[dayOfWeek]
    //   alert(`❌ Les commandes ne sont disponibles que le samedi.\n\nAujourd'hui, nous sommes ${currentDay}.\n\nMerci de revenir le samedi pour passer votre commande.`)
    //   return
    // }
    onCheckout(appliedPromo)
  }
  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Mon Panier</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="cart-content">
          {cart.length === 0 ? (
            <p className="empty-cart">Votre panier est vide</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p>{item.price.toLocaleString()} FCFA</p>
                    </div>
                    <div className="cart-item-controls">
                      <button
                        className="quantity-button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        className="quantity-button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        className="remove-button"
                        onClick={() => onRemove(item.id)}
                        title="Supprimer"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <PromoCode 
                onApplyPromo={setAppliedPromo}
                appliedPromo={appliedPromo}
                total={total}
                userId={user?.uid || null}
              />
              <div className="cart-footer">
                {discountAmount > 0 && (
                  <div className="cart-discount">
                    <span>Sous-total: {total.toLocaleString()} FCFA</span>
                    <span className="discount-amount">-{discountAmount.toLocaleString()} FCFA ({appliedPromo.discount}%)</span>
                  </div>
                )}
                <div className="cart-total">
                  <strong>Total: {finalTotal.toLocaleString()} FCFA</strong>
                </div>
                {/* DÉSACTIVÉ TEMPORAIREMENT */}
                {/* {!isSaturday && (
                  <div style={{ 
                    backgroundColor: '#fee2e2', 
                    border: '1px solid #ef4444', 
                    borderRadius: '0.5rem', 
                    padding: '0.75rem', 
                    marginBottom: '0.75rem',
                    textAlign: 'center',
                    fontSize: '0.875rem'
                  }}>
                    <strong style={{ color: '#dc2626' }}>🔴 Commandes disponibles uniquement le samedi</strong>
                  </div>
                )} */}
                <button 
                  className="checkout-button" 
                  onClick={handleCheckout}
                  // disabled={!isSaturday} // DÉSACTIVÉ TEMPORAIREMENT
                  // style={!isSaturday ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                  Commander
                  {/* {isSaturday ? 'Commander' : 'Commandes disponibles uniquement le samedi'} */}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart

