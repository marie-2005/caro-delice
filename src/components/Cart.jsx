import React from 'react'
import './Cart.css'

function Cart({ cart, total, onClose, onRemove, onUpdateQuantity, onCheckout }) {
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
              <div className="cart-footer">
                <div className="cart-total">
                  <strong>Total: {total.toLocaleString()} FCFA</strong>
                </div>
                <button className="checkout-button" onClick={onCheckout}>
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

