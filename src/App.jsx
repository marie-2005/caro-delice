import React, { useState, useEffect, useRef } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './config/firebase'
import { 
  createOrder, 
  getAllOrders, 
  getCustomerOrders, 
  updateOrderStatus, 
  deleteOrder,
  deleteAllOrders,
  getUserRole,
  getUserProfile,
  updateUserProfile
} from './services/firebaseService'
import Header from './components/Header'
import Menu from './components/Menu'
import Cart from './components/Cart'
import OrderForm from './components/OrderForm'
import OrdersList from './components/OrdersList'
import Login from './components/Login'
import Profile from './components/Profile'
import Toast from './components/Toast'
import Dashboard from './components/Dashboard'
import { getStatusChangeNotification } from './services/orderStatusService'
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
  const [toasts, setToasts] = useState([])
  const previousOrdersRef = useRef([])
  const [userProfile, setUserProfile] = useState(null)
  const [favorites, setFavorites] = useState([])

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
        
        // Charger le profil utilisateur
        try {
          const { getUserProfile } = await import('./services/firebaseService')
          const profile = await getUserProfile(currentUser.uid)
          if (profile) {
            setUserProfile(profile)
            setFavorites(profile.favorites || [])
          }
        } catch (error) {
          console.error('Erreur chargement profil:', error)
        }
      } else {
        setUserRole('customer')
        setIsAdmin(false)
        setUserProfile(null)
        setFavorites([])
      }
    })

    return () => unsubscribe()
  }, [])

  // Afficher un toast
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
  }

  // Fermer un toast
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Détecter les changements de statut et afficher des notifications
  const detectStatusChanges = (oldOrders, newOrders) => {
    // Créer un map pour accès rapide
    const oldOrdersMap = new Map(oldOrders.map(order => [order.id, order]))

    newOrders.forEach(newOrder => {
      const oldOrder = oldOrdersMap.get(newOrder.id)
      
      // Si la commande existe et que le statut a changé
      if (oldOrder && oldOrder.status !== newOrder.status) {
        const notification = getStatusChangeNotification(oldOrder.status, newOrder.status)
        showToast(notification.message, notification.type)
      }
    })
  }

  // Charger les commandes depuis Firebase et détecter les changements de statut
  useEffect(() => {
    let unsubscribe

    if (isAdmin) {
      // Admin voit toutes les commandes
      unsubscribe = getAllOrders((ordersList) => {
        // Admin ne reçoit pas de notifications (ils changent les statuts eux-mêmes)
        setOrders(ordersList)
        previousOrdersRef.current = ordersList
      })
    } else if (user) {
      // Client connecté voit ses commandes (par ID)
      unsubscribe = getCustomerOrders(user.uid, (ordersList) => {
        // Détecter les changements de statut pour les notifications
        if (previousOrdersRef.current.length > 0) {
          detectStatusChanges(previousOrdersRef.current, ordersList)
        }
        setOrders(ordersList)
        previousOrdersRef.current = ordersList
      })
    } else {
      // Pas connecté = pas de commandes visibles
      setOrders([])
      previousOrdersRef.current = []
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
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
    
    // Appliquer le code promo si présent
    const promoData = sessionStorage.getItem('applied_promo')
    if (promoData) {
      try {
        const promo = JSON.parse(promoData)
        // Vérifier que si c'est un code à usage unique (BIENVENUE10), l'utilisateur est connecté
        if (promo.code === 'BIENVENUE10' && !user?.uid) {
          // Nettoyer le code promo si l'utilisateur n'est pas connecté
          sessionStorage.removeItem('applied_promo')
          return subtotal
        }
        return promo.total
      } catch (e) {
        console.error('Erreur lecture promo:', e)
        sessionStorage.removeItem('applied_promo')
      }
    }
    
    return subtotal
  }

  const handleOrder = async (orderInfo) => {
    // Vérifier si c'est samedi (jour 6, où 0 = dimanche, 1 = lundi, ..., 6 = samedi)
    // DÉSACTIVÉ TEMPORAIREMENT
    // const today = new Date()
    // const dayOfWeek = today.getDay()
    // 
    // if (dayOfWeek !== 6) {
    //   const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
    //   const currentDay = days[dayOfWeek]
    //   alert(`❌ Les commandes ne sont disponibles que le samedi.\n\nAujourd'hui, nous sommes ${currentDay}.\n\nMerci de revenir le samedi pour passer votre commande.`)
    //   return
    // }
    
    const total = getTotalPrice()
    
    // Récupérer le code promo appliqué si présent
    let appliedPromo = null
    const promoData = sessionStorage.getItem('applied_promo')
    if (promoData) {
      try {
        appliedPromo = JSON.parse(promoData)
        // Vérifier que si c'est BIENVENUE10, l'utilisateur est connecté
        if (appliedPromo.code === 'BIENVENUE10' && !user?.uid) {
          // Nettoyer le code promo et afficher une erreur
          sessionStorage.removeItem('applied_promo')
          alert('Ce code promo nécessite une connexion. Veuillez créer un compte ou vous connecter.')
          return // Arrêter la création de commande
        }
      } catch (e) {
        console.error('Erreur lecture promo:', e)
        sessionStorage.removeItem('applied_promo')
      }
    }
    
    // Préparer les informations de livraison AVANT tout
    const deliveryInfo = orderInfo.deliveryType === 'livraison' 
      ? `Livraison: Chambre ${orderInfo.roomNumber}`
      : 'Retrait: Chambre C-75'
    
    // AFFICHER LE MESSAGE IMMÉDIATEMENT (sans attendre la création de la commande)
    // Fermer les formulaires immédiatement pour une meilleure UX
    setCart([])
    setShowCart(false)
    setShowOrderForm(false)
    
    // Afficher l'alert IMMÉDIATEMENT (bloquant)
    if (orderInfo.paymentMethod === 'wave' && orderInfo.paymentLink) {
      alert(`Commande créée! Total: ${total.toLocaleString()} FCFA\n\nUn lien de paiement Wave a été ouvert dans un nouvel onglet.\n\n${deliveryInfo}\n\nVeuillez compléter le paiement pour valider votre commande.`)
    } else {
      alert(`Commande reçue! Total: ${total.toLocaleString()} FCFA\n\nMode de paiement: ${orderInfo.paymentMethod === 'wave' ? 'Wave' : orderInfo.paymentMethod === 'tremo' ? 'Tremo' : orderInfo.paymentMethod === 'orange-money' ? 'Orange Money' : 'Espèces'}\n${deliveryInfo}\n\nNous préparons votre commande. Merci!`)
    }
    
    // CRÉER LA COMMANDE EN ARRIÈRE-PLAN (après avoir affiché le message)
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
        appliedPromo: appliedPromo || null, // Inclure les infos de promo pour l'impression
        createdAt: new Date().toISOString()
      }

      // Réduire les stocks avant de créer la commande
      try {
        const { reduceStock } = await import('./services/stockService')
        const stockResult = reduceStock(orderData.items)
        if (stockResult.hasLowStock && stockResult.lowStockItems.length > 0) {
          const itemsList = stockResult.lowStockItems.map(item => `- ${item.name} (${item.quantity} restant)`).join('\n')
          console.warn('⚠️ Stock faible détecté:', stockResult.lowStockItems)
        }
      } catch (stockError) {
        console.warn('Erreur gestion stock:', stockError)
      }

      // Créer la commande en arrière-plan
      const order = await createOrder(orderData)
      
      // Enregistrer l'utilisation du code promo si présent (pour codes à usage unique)
      if (appliedPromo && appliedPromo.code && user?.uid) {
        try {
          const { recordPromoCodeUsage } = await import('./services/promoService')
          await recordPromoCodeUsage(user.uid, appliedPromo.code, order.id)
        } catch (promoError) {
          console.warn('Erreur enregistrement usage code promo:', promoError)
          // Ne pas bloquer si l'enregistrement échoue
        }
      }
      
      // Nettoyer le code promo du sessionStorage après création de la commande
      sessionStorage.removeItem('applied_promo')
      
      // IMPRESSION : S'exécute après la création de la commande
      try {
        const { printOrderTicket } = await import('./services/printService')
        printOrderTicket(order)
      } catch (error) {
        console.error('Erreur impression après confirmation:', error)
      }
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error)
      alert('Erreur lors de la création de la commande. Veuillez réessayer.')
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus, oldStatus = null) => {
    try {
      // Récupérer l'ancien statut si non fourni
      if (!oldStatus) {
        const order = orders.find(o => o.id === orderId)
        if (order) {
          oldStatus = order.status
        }
      }
      await updateOrderStatus(orderId, newStatus, oldStatus)
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
            <Dashboard menuItems={[
              { id: 1, name: 'Crêpe au Cérélac' },
              { id: 2, name: 'Crêpe au Nutella' },
              { id: 3, name: 'Crêpe Nature' },
              { id: 4, name: 'Crêpe au Jambon/Fromage' },
              { id: 5, name: 'Crêpe au Viande/Fromage' }
            ]} />
          ) : (
            <Menu 
              cart={cart}
              addToCart={addToCart} 
              updateQuantity={updateQuantity}
              user={user}
              favorites={favorites}
              onToggleFavorite={async (itemId) => {
                if (!user) return
                
                const newFavorites = favorites.includes(itemId)
                  ? favorites.filter(id => id !== itemId)
                  : [...favorites, itemId]
                
                setFavorites(newFavorites)
                
                // Sauvegarder dans Firebase
                try {
                  await updateUserProfile(user.uid, { favorites: newFavorites })
                } catch (error) {
                  console.error('Erreur sauvegarde favoris:', error)
                  // Revenir en arrière en cas d'erreur
                  setFavorites(favorites)
                }
              }}
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
          onCheckout={(appliedPromo) => {
            setShowCart(false)
            setShowOrderForm(true)
            // Stocker le code promo pour l'utiliser dans la commande
            if (appliedPromo) {
              sessionStorage.setItem('applied_promo', JSON.stringify(appliedPromo))
            }
          }}
          user={user}
        />
      )}
      {showOrderForm && (
        <OrderForm
          total={getTotalPrice()}
          onClose={() => setShowOrderForm(false)}
          onOrder={handleOrder}
          user={user}
          userProfile={userProfile}
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
          onClose={async () => {
            setShowProfile(false)
            // Recharger le profil après modification
            if (user) {
              try {
                const profile = await getUserProfile(user.uid)
                if (profile) {
                  setUserProfile(profile)
                  setFavorites(profile.favorites || [])
                }
              } catch (error) {
                console.error('Erreur rechargement profil:', error)
              }
            }
          }}
        />
      )}
      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default App
