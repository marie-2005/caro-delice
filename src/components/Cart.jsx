import React, { useState } from 'react'
import PromoCode from './PromoCode'
import { applyPromoCodeToTotal } from '../services/promoService'
import './Cart.css'

function Cart({ cart, total, onClose, onRemove, onUpdateQuantity, onCheckout }) {
  const [appliedPromo, setAppliedPromo] = useState(null)
  
  // Calculer le total avec code promo
  const finalTotal = appliedPromo ? appliedPromo.total : total
  const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0
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
                <button className="checkout-button" onClick={() => onCheckout(appliedPromo)}>
                  Commander
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

