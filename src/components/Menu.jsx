import React, { useState, useEffect } from 'react'
import BusinessHours from './BusinessHours'
import { getLocalFavorites, toggleLocalFavorite } from '../services/favoritesService'
import { getStock, isInStock } from '../services/stockService'
import './Menu.css'

const menuItems = [
  {
    id: 1,
    name: 'Crêpe au Cérélac',
    description: 'Crêpe avec céréales pour bébé',
    price: 350,
    originalPrice: 350,
    category: 'Sucré',
    image: '/images/crepe-cerelac.jpg', // Image 3
    promotion: null
  },
  {
    id: 2,
    name: 'Crêpe au Nutella',
    description: 'Crêpe généreusement nappée de Nutella',
    price: 350,
    originalPrice: 350,
    category: 'Sucré',
    image: '/images/crepe-nutella.jpg', // Image 2
    promotion: null
  },
  {
    id: 3,
    name: 'Crêpe Nature',
    description: 'Crêpe simple et dorée',
    price: 250,
    originalPrice: 250,
    category: 'Sucré',
    image: '/images/crepe-nature.jpg', // Image 1
    promotion: null
  },
  {
    id: 4,
    name: 'Crêpe au Jambon/Fromage',
    description: 'Jambon et fromage fondu',
    price: 500,
    originalPrice: 500,
    category: 'Salé',
    image: '/images/crepe-jambon-fromage.jpg', // Image 4
    promotion: null
  },
  {
    id: 5,
    name: 'Crêpe au Viande/Fromage',
    description: 'Viande hachée et fromage',
    price: 500,
    originalPrice: 500,
    category: 'Salé',
    image: '/images/crepe-viande-fromage.jpg', // Image 5
    promotion: null
  }
]

function Menu({ cart, addToCart, updateQuantity, user, favorites, onToggleFavorite }) {
  // Favoris locaux pour les non-connectés
  const [localFavorites, setLocalFavorites] = useState(() => {
    return user ? [] : getLocalFavorites()
  })
  
  // Stock pour vérifier la disponibilité
  const [stock, setStock] = useState({})
  
  // Filtre de catégorie
  const [selectedCategory, setSelectedCategory] = useState('toutes')

  // Mettre à jour les favoris locaux quand l'utilisateur se connecte
  useEffect(() => {
    if (user && favorites) {
      // Si l'utilisateur se connecte, synchroniser les favoris locaux avec Firebase
      const local = getLocalFavorites()
      if (local.length > 0 && favorites.length === 0) {
        // Si l'utilisateur avait des favoris locaux, les fusionner (optionnel)
        // Pour l'instant, on garde ceux de Firebase
      }
      setLocalFavorites([])
    } else if (!user) {
      // Si déconnecté, charger depuis localStorage
      setLocalFavorites(getLocalFavorites())
    }
  }, [user, favorites])

  // Charger le stock au démarrage
  useEffect(() => {
    const currentStock = getStock()
    setStock(currentStock)
    
    // Mettre à jour le stock toutes les 30 secondes
    const interval = setInterval(() => {
      const updatedStock = getStock()
      setStock(updatedStock)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getItemQuantity = (itemId) => {
    const cartItem = cart.find((item) => item.id === itemId)
    return cartItem ? cartItem.quantity : 0
  }

  const handleQuantityChange = (item, change) => {
    const currentQuantity = getItemQuantity(item.id)
    const newQuantity = currentQuantity + change

    if (newQuantity <= 0) {
      // Si on arrive à 0 ou moins, retirer l'article du panier
      updateQuantity(item.id, 0)
    } else {
      // Vérifier le stock avant d'augmenter
      const available = getAvailableQuantity(item.id)
      if (available !== null && newQuantity > available) {
        alert(`❌ Stock insuffisant !\n\nIl reste seulement ${available} article(s) disponible(s).`)
        return
      }
      updateQuantity(item.id, newQuantity)
    }
  }

  // Vérifier si un article est disponible
  const checkAvailability = (itemId, quantity = 1) => {
    return isInStock(itemId, quantity)
  }

  // Obtenir la quantité disponible
  const getAvailableQuantity = (itemId) => {
    if (stock[itemId]) {
      return stock[itemId].quantity
    }
    return null // Stock illimité si pas de gestion
  }

  // Gérer l'ajout au panier avec vérification de stock
  const handleAddToCart = (item) => {
    const quantityInCart = getItemQuantity(item.id)
    const quantityToAdd = quantityInCart + 1
    const available = getAvailableQuantity(item.id)

    // Si pas de gestion de stock, autoriser
    if (available === null) {
      addToCart(item)
      return
    }

    // Vérifier la disponibilité
    if (available === 0) {
      alert('❌ Désolé, cet article est en rupture de stock pour le moment.')
      return
    }

    if (quantityToAdd > available) {
      alert(`❌ Stock insuffisant !\n\nIl reste seulement ${available} article(s) disponible(s).`)
      return
    }

    addToCart(item)
  }

  const isFavorite = (itemId) => {
    if (user) {
      return favorites && favorites.includes(itemId)
    } else {
      return localFavorites.includes(itemId)
    }
  }

  const handleToggleFavorite = (itemId) => {
    if (user) {
      // Connecté : utiliser Firebase via onToggleFavorite
      onToggleFavorite(itemId)
    } else {
      // Non connecté : utiliser localStorage
      const newFavorites = toggleLocalFavorite(itemId)
      setLocalFavorites(newFavorites)
    }
  }

  // Obtenir toutes les catégories uniques
  const categories = ['toutes', ...new Set(menuItems.map(item => item.category))]
  
  // Filtrer les articles par catégorie
  const filteredItems = selectedCategory === 'toutes' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  return (
    <div className="menu">
      <BusinessHours />
      <h2 className="menu-title">Notre Menu</h2>
      
      {/* Filtres de catégories */}
      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category}
            className={`category-filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'toutes' ? '✨ Toutes' : category}
          </button>
        ))}
      </div>
      
      {/* Section Favoris si avec des favoris (connecté ou non) */}
      {((user && favorites && favorites.length > 0) || (!user && localFavorites.length > 0)) && (
        <div className="favorites-section">
          <h3 className="favorites-title">⭐ Mes Favoris</h3>
          <div className="favorites-grid">
            {filteredItems
              .filter(item => user ? (favorites && favorites.includes(item.id)) : localFavorites.includes(item.id))
              .map(item => {
                const quantity = getItemQuantity(item.id)
                const isInCart = quantity > 0

                return (
                  <div key={item.id} className={`menu-item favorite-item ${isInCart ? 'in-cart' : ''}`}>
                    <div className="menu-item-header">
                      <span className="menu-category">{item.category}</span>
                      <button
                        className="favorite-btn active"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleFavorite(item.id)
                        }}
                        title="Retirer des favoris"
                      >
                        ⭐
                      </button>
                    </div>
                    <div className="menu-item-info">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <div className="menu-item-footer">
                        <div className="price-container">
                          {item.originalPrice > item.price && (
                            <span className="original-price">{item.originalPrice.toLocaleString()} FCFA</span>
                          )}
                          <span className="price">{item.price.toLocaleString()} FCFA</span>
                        </div>
                        {isInCart ? (
                          <div className="quantity-selector">
                            <button
                              className="quantity-btn minus"
                              onClick={() => handleQuantityChange(item, -1)}
                            >
                              −
                            </button>
                            <span className="quantity-display">{quantity}</span>
                            <button
                              className="quantity-btn plus"
                              onClick={() => handleQuantityChange(item, 1)}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <>
                            {(() => {
                              const available = getAvailableQuantity(item.id)
                              const isAvailable = available === null || available > 0
                              
                              return (
                                <>
                                  {available !== null && (
                                    <div className="stock-info">
                                      {available === 0 ? (
                                        <span className="stock-unavailable">⚠️ Rupture de stock</span>
                                      ) : available <= 10 ? (
                                        <span className="stock-low">⚡ Il reste {available}</span>
                                      ) : (
                                        <span className="stock-ok">✓ En stock</span>
                                      )}
                                    </div>
                                  )}
                                  <button
                                    className={`add-button ${!isAvailable ? 'disabled' : ''}`}
                                    onClick={() => handleAddToCart(item)}
                                    disabled={!isAvailable}
                                    title={!isAvailable ? 'Article en rupture de stock' : ''}
                                  >
                                    {!isAvailable ? 'Indisponible' : 'Ajouter'}
                                  </button>
                                </>
                              )
                            })()}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      <h2 className="menu-title">Articles</h2>
      <div className="menu-grid">
        {filteredItems.map((item) => {
          const quantity = getItemQuantity(item.id)
          const isInCart = quantity > 0

          return (
            <div key={item.id} className={`menu-item ${isInCart ? 'in-cart' : ''} ${item.promotion ? 'has-promotion' : ''}`}>
              {/* Image du produit */}
              {item.image && (
                <div className="menu-item-image">
                  <img src={item.image} alt={item.name} />
                  {item.promotion && (
                    <span className="promotion-badge">{item.promotion.discount}% OFF</span>
                  )}
                </div>
              )}
              
              <div className="menu-item-header">
                <span className="menu-category">{item.category}</span>
                <button
                  className={`favorite-btn ${isFavorite(item.id) ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleFavorite(item.id)
                  }}
                  title={isFavorite(item.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  {isFavorite(item.id) ? '⭐' : '☆'}
                </button>
              </div>
              <div className="menu-item-info">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="menu-item-footer">
                  <div className="price-container">
                    {item.originalPrice > item.price && (
                      <span className="original-price">{item.originalPrice.toLocaleString()} FCFA</span>
                    )}
                    <span className="price">{item.price.toLocaleString()} FCFA</span>
                  </div>
                  {isInCart ? (
                    <div className="quantity-selector">
                      <button
                        className="quantity-btn minus"
                        onClick={() => handleQuantityChange(item, -1)}
                        aria-label="Diminuer la quantité"
                      >
                        −
                      </button>
                      <span className="quantity-display">{quantity}</span>
                      <button
                        className="quantity-btn plus"
                        onClick={() => handleQuantityChange(item, 1)}
                        aria-label="Augmenter la quantité"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <>
                      {(() => {
                        const available = getAvailableQuantity(item.id)
                        const isAvailable = available === null || available > 0
                        
                        return (
                          <>
                            {available !== null && (
                              <div className="stock-info">
                                {available === 0 ? (
                                  <span className="stock-unavailable">⚠️ Rupture de stock</span>
                                ) : available <= 10 ? (
                                  <span className="stock-low">⚡ Il reste {available}</span>
                                ) : (
                                  <span className="stock-ok">✓ En stock</span>
                                )}
                              </div>
                            )}
                            <button
                              className={`add-button ${!isAvailable ? 'disabled' : ''}`}
                              onClick={() => handleAddToCart(item)}
                              disabled={!isAvailable}
                              title={!isAvailable ? 'Article en rupture de stock' : ''}
                            >
                              {!isAvailable ? 'Indisponible' : 'Ajouter'}
                            </button>
                          </>
                        )
                      })()}
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="no-items-message">
          <p>Aucun article dans la catégorie "{selectedCategory}"</p>
        </div>
      )}
    </div>
  )
}

export default Menu

