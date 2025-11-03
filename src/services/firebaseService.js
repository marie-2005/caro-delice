import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc,
  setDoc,
  doc, 
  deleteDoc,
  getDoc,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../config/firebase'

// Créer une commande
export const createOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    
    // Envoyer une notification email (ne bloque pas si ça échoue)
    try {
      const { sendNewOrderNotification } = await import('./notificationService')
      await sendNewOrderNotification({
        ...orderData,
        orderId: docRef.id
      })
    } catch (notifError) {
      // Ignorer les erreurs de notification pour ne pas bloquer la création
      console.warn('Notification email non envoyée:', notifError)
    }

    // Envoyer une notification SMS à l'admin (ne bloque pas si ça échoue)
    try {
      const { sendNewOrderSMS } = await import('./smsService')
      await sendNewOrderSMS({
        ...orderData,
        orderId: docRef.id
      })
    } catch (smsError) {
      // Ignorer les erreurs de SMS pour ne pas bloquer la création
      console.warn('Notification SMS non envoyée:', smsError)
    }

    // Envoyer une confirmation SMS au client (ne bloque pas si ça échoue)
    try {
      const { sendOrderConfirmationSMS } = await import('./smsService')
      await sendOrderConfirmationSMS({
        ...orderData,
        orderId: docRef.id
      })
    } catch (smsError) {
      // Ignorer les erreurs de SMS pour ne pas bloquer la création
      console.warn('SMS confirmation client non envoyé:', smsError)
    }

    // Attribuer des points fidélité (ne bloque pas si ça échoue)
    if (orderData.customerId) {
      try {
        const { addPointsFromOrder } = await import('./loyaltyService')
        await addPointsFromOrder(orderData.customerId, orderData.total, docRef.id)
      } catch (loyaltyError) {
        console.warn('Points fidélité non attribués:', loyaltyError)
      }
    }

    // Impression automatique DÉSACTIVÉE - sera déclenchée après la confirmation dans App.jsx
    // L'impression se fait maintenant APRÈS que l'utilisateur ait cliqué sur OK de l'alert
    // try {
    //   const { autoPrintOnOrderCreate } = await import('./printService')
    //   await autoPrintOnOrderCreate({
    //     ...orderData,
    //     id: docRef.id
    //   })
    // } catch (printError) {
    //   console.warn('Impression automatique non effectuée:', printError)
    // }
    
    // Retourner l'ID et les données de la commande pour éviter de devoir la relire depuis Firebase
    // (permet d'éviter les problèmes de permissions pour les utilisateurs non authentifiés)
    return {
      id: docRef.id,
      ...orderData,
      createdAt: orderData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error)
    throw error
  }
}

// Mettre à jour le statut de paiement d'une commande
export const updatePaymentStatus = async (orderId, paymentStatus, paymentLink = null) => {
  try {
    const orderRef = doc(db, 'orders', orderId)
    await updateDoc(orderRef, {
      paymentStatus,
      paymentLink,
      status: paymentStatus === 'payé' ? 'en attente' : 'en attente de paiement',
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de paiement:', error)
    throw error
  }
}

// Obtenir toutes les commandes (pour admin)
export const getAllOrders = (callback) => {
  const q = query(
    collection(db, 'orders'),
    orderBy('createdAt', 'desc')
  )
  
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(orders)
  })
}

// Obtenir les commandes d'un client spécifique (par ID, puis par téléphone depuis les commandes)
export const getCustomerOrders = (customerId, callback) => {
  // Requête principale : commandes avec customerId
  const q1 = query(
    collection(db, 'orders'),
    where('customerId', '==', customerId),
    orderBy('createdAt', 'desc')
  )
  
  // Retourner directement les commandes par customerId
  // Note: La recherche par téléphone est désactivée pour éviter les erreurs de permissions
  // Les utilisateurs verront leurs commandes passées quand ils sont connectés
  return onSnapshot(q1, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(orders)
  }, (error) => {
    console.error('Erreur requête customerId:', error)
    callback([])
  })
}

// Mettre à jour le statut d'une commande
export const updateOrderStatus = async (orderId, newStatus, oldStatus = null) => {
  try {
    const orderRef = doc(db, 'orders', orderId)
    
    // Récupérer l'ancien statut si non fourni
    if (!oldStatus) {
      const orderSnap = await getDoc(orderRef)
      if (orderSnap.exists()) {
        oldStatus = orderSnap.data().status
      }
    }
    
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: new Date().toISOString()
    })

    // Impression automatique lors du changement de statut (ne bloque pas si ça échoue)
    try {
      const orderSnap = await getDoc(orderRef)
      if (orderSnap.exists()) {
        const { autoPrintOnStatusChange } = await import('./printService')
        autoPrintOnStatusChange(
          { id: orderId, ...orderSnap.data() },
          oldStatus,
          newStatus
        )
      }
    } catch (printError) {
      console.warn('Impression automatique lors changement statut non effectuée:', printError)
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
    throw error
  }
}

// Supprimer une commande
export const deleteOrder = async (orderId) => {
  try {
    await deleteDoc(doc(db, 'orders', orderId))
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    throw error
  }
}

// Supprimer toutes les commandes (utilitaire pour nettoyer les tests)
export const deleteAllOrders = async () => {
  try {
    const ordersSnapshot = await getDocs(collection(db, 'orders'))
    const deletePromises = ordersSnapshot.docs.map(doc => deleteDoc(doc.ref))
    await Promise.all(deletePromises)
    console.log(`✅ ${ordersSnapshot.docs.length} commande(s) supprimée(s)`)
    return { success: true, count: ordersSnapshot.docs.length }
  } catch (error) {
    console.error('Erreur lors de la suppression de toutes les commandes:', error)
    throw error
  }
}

// Obtenir le rôle d'un utilisateur
export const getUserRole = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    console.log('Document utilisateur lu pour', userId, ':', userDoc.exists() ? userDoc.data() : 'n\'existe pas')
    if (userDoc.exists()) {
      const data = userDoc.data()
      // Chercher 'role' (prioritaire) ou 'rôle' (rétrocompatibilité)
      const role = data.role || data.rôle || 'customer'
      console.log('Rôle trouvé:', role)
      return role
    }
    console.log('Document utilisateur non trouvé, retour customer')
    return 'customer'
  } catch (error) {
    console.error('Erreur lors de la récupération du rôle:', error)
    return 'customer'
  }
}

// Obtenir le profil d'un utilisateur
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (userDoc.exists()) {
      return userDoc.data()
    }
    return null
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error)
    throw error
  }
}

// Mettre à jour le profil d'un utilisateur
export const updateUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId)
    
    // Ne pas permettre la modification de l'email et du téléphone s'ils existent déjà
    // (car ils sont utilisés pour identifier les commandes)
    const existingDoc = await getDoc(userRef)
    const existingData = existingDoc.exists() ? existingDoc.data() : {}
    
    // Préserver les données importantes
    const updateData = {
      ...profileData,
      // Préserver l'email et le téléphone existants (non modifiables)
      email: existingData.email || null,
      phone: existingData.phone || null,
      // Préserver le rôle
      role: existingData.role || existingData.rôle || 'customer',
      updatedAt: new Date().toISOString()
    }

    if (existingDoc.exists()) {
      // Mettre à jour le document existant
      await updateDoc(userRef, updateData)
    } else {
      // Créer le document s'il n'existe pas avec setDoc (merge permet de ne pas écraser)
      await setDoc(userRef, {
        ...updateData,
        createdAt: new Date().toISOString()
      }, { merge: true })
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    throw error
  }
}

