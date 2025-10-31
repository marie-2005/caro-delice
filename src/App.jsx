import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Menu from './components/Menu'
import Cart from './components/Cart'
import OrderForm from './components/OrderForm'
import OrdersList from './components/OrdersList'
import './App.css'

function App() {
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [currentView, setCurrentView] = useState('menu') // 'menu' ou 'orders'
  const [orders, setOrders] = useState([])

  // Charger les commandes depuis localStorage au démarrage
  useEffect(() => {
    const savedOrders = localStorage.getItem('caroDeliceOrders')
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders))
      } catch (e) {
        console.error('Erreur lors du chargement des commandes:', e)
      }
    }
  }, [])

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [...prevCart, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleOrder = (orderInfo) => {
    const total = getTotalPrice()
    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: [...cart],
      total,
      ...orderInfo,
      status: 'en attente'
    }
    
    // Sauvegarder dans localStorage
    setOrders(prevOrders => {
      const updatedOrders = [newOrder, ...prevOrders]
      localStorage.setItem('caroDeliceOrders', JSON.stringify(updatedOrders))
      return updatedOrders
    })
    
    alert(`Commande reçue! Total: ${total.toLocaleString()} FCFA\n\nMode de paiement: ${orderInfo.paymentMethod}\nRetrait: Chambre C-75\n\nNous préparons votre commande. Merci!`)
    
    setCart([])
    setShowCart(false)
    setShowOrderForm(false)
  }

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    )
    setOrders(updatedOrders)
    localStorage.setItem('caroDeliceOrders', JSON.stringify(updatedOrders))
  }

  const deleteOrder = (orderId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      const updatedOrders = orders.filter(order => order.id !== orderId)
      setOrders(updatedOrders)
      localStorage.setItem('caroDeliceOrders', JSON.stringify(updatedOrders))
    }
  }

  return (
    <div className="App">
      <Header 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
        onCartClick={() => setShowCart(!showCart)}
        currentView={currentView}
        onViewChange={setCurrentView}
        ordersCount={orders.filter(o => o.status === 'en attente').length}
      />
      <main>
        {currentView === 'menu' ? (
          <Menu addToCart={addToCart} />
        ) : (
          <OrdersList 
            orders={orders}
            onUpdateStatus={updateOrderStatus}
            onDelete={deleteOrder}
          />
        )}
      </main>
      {showCart && (
        <Cart
          cart={cart}
          total={getTotalPrice()}
          onClose={() => setShowCart(false)}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onCheckout={() => {
            setShowCart(false)
            setShowOrderForm(true)
          }}
        />
      )}
      {showOrderForm && (
        <OrderForm
          total={getTotalPrice()}
          onClose={() => setShowOrderForm(false)}
          onOrder={handleOrder}
        />
      )}
    </div>
  )
}

export default App

