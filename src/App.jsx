import React, { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './config/firebase'
import { 
  createOrder, 
  getAllOrders, 
  getCustomerOrders, 
  updateOrderStatus, 
  deleteOrder,
  deleteAllOrders,
  getUserRole 
} from './services/firebaseService'
import Header from './components/Header'
import Menu from './components/Menu'
import Cart from './components/Cart'
import OrderForm from './components/OrderForm'
import OrdersList from './components/OrdersList'
import Login from './components/Login'
import Profile from './components/Profile'
import './App.css'

function App() {
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [currentView, setCurrentView] = useState('menu')
  const [orders, setOrders] = useState([])
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState('customer')
  const [isAdmin, setIsAdmin] = useState(false)

  // Écouter les changements d'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      
      if (currentUser) {
        // Vérifier le rôle de l'utilisateur
        const role = await getUserRole(currentUser.uid)
        console.log('Rôle détecté pour', currentUser.uid, ':', role)
        setUserRole(role)
        setIsAdmin(role === 'admin')
        console.log('isAdmin défini à:', role === 'admin')
      } else {
        setUserRole('customer')
        setIsAdmin(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // Charger les commandes depuis Firebase
  useEffect(() => {
    let unsubscribe

    if (isAdmin) {
      // Admin voit toutes les commandes
      unsubscribe = getAllOrders((ordersList) => {
        setOrders(ordersList)
      })
    } else if (user) {
      // Client connecté voit ses commandes (par ID)
      // Le téléphone sera récupéré depuis les commandes existantes si nécessaire
      unsubscribe = getCustomerOrders(user.uid, (ordersList) => {
        setOrders(ordersList)
      })
    } else {
      // Pas connecté = pas de commandes visibles
      setOrders([])
    }

    return () => {
      // Nettoyer les abonnements avant de changer d'état
      if (unsubscribe) {
        try {
          unsubscribe()
        } catch (error) {
          // Ignorer les erreurs de nettoyage
          console.warn('Erreur lors du nettoyage des abonnements:', error)
        }
      }
    }
  }, [user, isAdmin])

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

  const handleOrder = async (orderInfo) => {
    const total = getTotalPrice()
    
    try {
      const orderData = {
        items: [...cart],
        total,
        customerName: orderInfo.name,
        customerPhone: orderInfo.phone,
        customerEmail: user?.email || orderInfo.email || '',
        customerId: user?.uid || null, // null si pas connecté
        paymentMethod: orderInfo.paymentMethod,
        deliveryType: orderInfo.deliveryType || 'sur-place',
        roomNumber: orderInfo.roomNumber || null,
        deliveryAddress: orderInfo.deliveryType === 'livraison' 
          ? `Chambre ${orderInfo.roomNumber}` 
          : 'Chambre C-75',
        notes: orderInfo.notes || '',
        status: orderInfo.paymentMethod === 'wave' && orderInfo.paymentStatus === 'en_attente' 
          ? 'en attente de paiement' 
          : 'en attente',
        paymentStatus: orderInfo.paymentStatus || null,
        paymentLink: orderInfo.paymentLink || null,
        createdAt: new Date().toISOString()
      }

      const orderId = await createOrder(orderData)
      
      const deliveryInfo = orderInfo.deliveryType === 'livraison' 
        ? `Livraison: Chambre ${orderInfo.roomNumber}`
        : 'Retrait: Chambre C-75'
      
      if (orderInfo.paymentMethod === 'wave' && orderInfo.paymentLink) {
        alert(`Commande créée! Total: ${total.toLocaleString()} FCFA\n\nUn lien de paiement Wave a été ouvert dans un nouvel onglet.\n\n${deliveryInfo}\n\nVeuillez compléter le paiement pour valider votre commande.`)
      } else {
        alert(`Commande reçue! Total: ${total.toLocaleString()} FCFA\n\nMode de paiement: ${orderInfo.paymentMethod === 'wave' ? 'Wave' : orderInfo.paymentMethod === 'tremo' ? 'Tremo' : 'Orange Money'}\n${deliveryInfo}\n\nNous préparons votre commande. Merci!`)
      }
      
      setCart([])
      setShowCart(false)
      setShowOrderForm(false)
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error)
      alert('Erreur lors de la création de la commande. Veuillez réessayer.')
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus)
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      alert('Erreur lors de la mise à jour du statut.')
    }
  }

  const handleDeleteOrder = async (orderId) => {
    const order = orders.find(o => o.id === orderId)
    const isOwnOrder = !isAdmin && order?.customerId === user?.uid
    const message = isOwnOrder 
      ? 'Êtes-vous sûr de vouloir annuler votre commande ?'
      : 'Êtes-vous sûr de vouloir supprimer cette commande ?'
    
    if (window.confirm(message)) {
      try {
        await deleteOrder(orderId)
        if (isOwnOrder) {
          alert('Votre commande a été annulée.')
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        alert('Erreur lors de la suppression de la commande.')
      }
    }
  }

  const handleLogin = (email) => {
    setShowLogin(false)
    // La fonction onAuthStateChanged va mettre à jour user automatiquement
  }

  const handleLogout = async () => {
    try {
      // Réinitialiser l'état avant la déconnexion pour éviter les erreurs
      setOrders([])
      setCurrentView('menu')
      setShowCart(false)
      setShowOrderForm(false)
      // Attendre un peu pour que les abonnements se nettoient
      await new Promise(resolve => setTimeout(resolve, 100))
      await signOut(auth)
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      // Continuer même en cas d'erreur
      setOrders([])
      setCurrentView('menu')
    }
  }

  // Réinitialiser la vue quand l'utilisateur se déconnecte
  useEffect(() => {
    if (!user) {
      setCurrentView('menu')
    }
  }, [user])

  return (
    <div className="App">
      <Header 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
        onCartClick={() => setShowCart(!showCart)}
        user={user}
        isAdmin={isAdmin}
        onLoginClick={() => setShowLogin(true)}
        onLogoutClick={handleLogout}
        currentView={currentView}
        onViewChange={setCurrentView}
        ordersCount={orders.filter(o => o.status === 'en attente').length}
        onProfileClick={() => setShowProfile(true)}
      />
      <main>
        {currentView === 'menu' ? (
          isAdmin ? (
            <div style={{padding: '2rem', textAlign: 'center'}}>
              <h2>Bienvenue dans l'espace Admin</h2>
              <p>Utilisez l'onglet "Commandes" pour gérer les commandes.</p>
            </div>
          ) : (
            <Menu 
              cart={cart}
              addToCart={addToCart} 
              updateQuantity={updateQuantity}
            />
          )
        ) : (
          <OrdersList 
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
            onDelete={handleDeleteOrder}
            onDeleteAll={isAdmin ? async () => {
              if (window.confirm('⚠️ Êtes-vous sûr de vouloir supprimer TOUTES les commandes ? Cette action est irréversible !')) {
                try {
                  const result = await deleteAllOrders()
                  alert(`✅ ${result.count} commande(s) supprimée(s) avec succès`)
                } catch (error) {
                  console.error('Erreur:', error)
                  alert('❌ Erreur lors de la suppression: ' + error.message)
                }
              }
            } : undefined}
            isAdmin={isAdmin}
            currentUserId={user?.uid}
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
          user={user}
        />
      )}
      {showLogin && (
        <Login
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
          isAdmin={isAdmin}
        />
      )}
      {showProfile && (
        <Profile
          user={user}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  )
}

export default App
