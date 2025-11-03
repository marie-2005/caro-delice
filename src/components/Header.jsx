import React, { useState, useRef, useEffect } from 'react'
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
  ordersCount,
  onProfileClick
}) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef(null)

  // Fermer le menu quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const handleUserClick = () => {
    setShowUserMenu(!showUserMenu)
  }

  const handleProfileClick = () => {
    setShowUserMenu(false)
    onProfileClick()
  }

  const handleLogoutClick = () => {
    setShowUserMenu(false)
    onLogoutClick()
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img 
            src="/images/logo-carodelice.jpg" 
            alt="Logo Les Délices de Caro" 
            className="logo-image"
          />
          <div className="logo-text">
            <h1>Les Délices de Caro</h1>
            <p>Ouvert uniquement les samedis</p>
          </div>
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
            <div className="user-info-container" ref={menuRef}>
              <div className="user-info">
                <span 
                  className="user-name clickable" 
                  onClick={handleUserClick} 
                  title="Cliquez pour voir les options"
                >
                  {user.email}
                </span>
                {isAdmin && <span className="admin-badge">Admin</span>}
              </div>
              {showUserMenu && (
                <div className="user-menu">
                  <button 
                    className="user-menu-item"
                    onClick={handleProfileClick}
                  >
                    <span className="menu-icon">👤</span>
                    Profil
                  </button>
                  <button 
                    className="user-menu-item"
                    onClick={handleLogoutClick}
                  >
                    <span className="menu-icon">🚪</span>
                    Déconnexion
                  </button>
                </div>
              )}
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

