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

function Menu({ addToCart }) {
  return (
    <div className="menu">
      <h2 className="menu-title">Notre Menu</h2>
      <div className="menu-grid">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item">
            <div className="menu-item-header">
              <span className="menu-category">{item.category}</span>
            </div>
            <div className="menu-item-info">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="menu-item-footer">
                <span className="price">{item.price.toLocaleString()} FCFA</span>
                <button
                  className="add-button"
                  onClick={() => addToCart(item)}
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Menu

