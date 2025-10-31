import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
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
    return docRef.id
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error)
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
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const orderRef = doc(db, 'orders', orderId)
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: new Date().toISOString()
    })
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

