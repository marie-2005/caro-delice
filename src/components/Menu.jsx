import React from 'react'
import './Menu.css'

const menuItems = [
  {
    id: 1,
    name: 'Crêpe au Cérélac',
    description: 'Crêpe avec céréales pour bébé',
    price: 350,
    category: 'Sucré'
  },
  {
    id: 2,
    name: 'Crêpe au Nutella',
    description: 'Crêpe généreusement nappée de Nutella',
    price: 350,
    category: 'Sucré'
  },
  {
    id: 3,
    name: 'Crêpe Nature',
    description: 'Crêpe simple et dorée',
    price: 250,
    category: 'Sucré'
  },
  {
    id: 4,
    name: 'Crêpe au Jambon/Fromage',
    description: 'Jambon et fromage fondu',
    price: 500,
    category: 'Salé'
  },
  {
    id: 5,
    name: 'Crêpe au Viande/Fromage',
    description: 'Viande hachée et fromage',
    price: 500,
    category: 'Salé'
  }
]

function Menu({ cart, addToCart, updateQuantity }) {
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
      updateQuantity(item.id, newQuantity)
    }
  }

  return (
    <div className="menu">
      <h2 className="menu-title">Notre Menu</h2>
      <div className="menu-grid">
        {menuItems.map((item) => {
          const quantity = getItemQuantity(item.id)
          const isInCart = quantity > 0

          return (
            <div key={item.id} className={`menu-item ${isInCart ? 'in-cart' : ''}`}>
              <div className="menu-item-header">
                <span className="menu-category">{item.category}</span>
              </div>
              <div className="menu-item-info">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="menu-item-footer">
                  <span className="price">{item.price.toLocaleString()} FCFA</span>
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
                    <button
                      className="add-button"
                      onClick={() => addToCart(item)}
                    >
                      Ajouter
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Menu

