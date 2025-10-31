import React from 'react'
import './Header.css'

function Header({ cartCount, onCartClick, currentView, onViewChange, ordersCount }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>Les Délices de Caro</h1>
          <p>Ouvert uniquement les samedis</p>
        </div>
        <div className="header-actions">
          <div className="nav-buttons">
            <button
              className={`nav-button ${currentView === 'menu' ? 'active' : ''}`}
              onClick={() => onViewChange('menu')}
            >
              Menu
            </button>
            <button
              className={`nav-button ${currentView === 'orders' ? 'active' : ''}`}
              onClick={() => onViewChange('orders')}
            >
              Commandes
              {ordersCount > 0 && <span className="orders-badge">{ordersCount}</span>}
            </button>
          </div>
          {currentView === 'menu' && (
            <button className="cart-button" onClick={onCartClick}>
              <span>Panier</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

