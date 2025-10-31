import React from 'react'
import './Header.css'

function Header({ 
  cartCount, 
  onCartClick, 
  user,
  isAdmin,
  onLoginClick,
  onLogoutClick,
  currentView,
  onViewChange,
  ordersCount
}) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>Les Délices de Caro</h1>
          <p>Ouvert uniquement les samedis</p>
        </div>
        <div className="header-actions">
          {user && (
            <div className="nav-tabs">
              <button
                className={`nav-tab ${currentView === 'menu' ? 'active' : ''}`}
                onClick={() => onViewChange('menu')}
              >
                Menu
              </button>
              <button
                className={`nav-tab ${currentView === 'orders' ? 'active' : ''}`}
                onClick={() => onViewChange('orders')}
              >
                Commandes
                {ordersCount > 0 && <span className="orders-badge">{ordersCount}</span>}
              </button>
            </div>
          )}
          
          {user ? (
            <div className="user-info">
              <span className="user-name clickable" onClick={onLogoutClick} title="Cliquez pour vous déconnecter">
                {user.email}
              </span>
              {isAdmin && <span className="admin-badge">Admin</span>}
            </div>
          ) : (
            <button className="login-button" onClick={onLoginClick}>
              Connexion
            </button>
          )}
          
              {currentView === 'menu' && !isAdmin && (
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

