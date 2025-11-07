// Service pour gérer les notifications de commandes supprimées par l'admin

import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  deleteDoc,
  doc,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../config/firebase'

/**
 * Créer une notification de suppression pour un client
 * @param {Object} orderData - Données de la commande supprimée
 * @param {string} orderData.orderId - ID de la commande
 * @param {string} orderData.customerId - ID du client
 * @param {string} orderData.customerEmail - Email du client
 * @param {string} orderData.customerName - Nom du client
 */
export const createDeletedOrderNotification = async (orderData) => {
  try {
    if (!orderData.customerId && !orderData.customerEmail) {
      console.warn('Pas de customerId ou customerEmail - Notification non créée')
      return { success: false, reason: 'Pas d\'identifiant client' }
    }

    const notificationData = {
      orderId: orderData.orderId || orderData.id,
      customerId: orderData.customerId || null,
      customerEmail: orderData.customerEmail || null,
      customerName: orderData.customerName || 'Client',
      orderTotal: orderData.total || 0,
      orderItems: orderData.items || [],
      orderDate: orderData.createdAt || new Date().toISOString(),
      deletedAt: new Date().toISOString(),
      read: false,
      createdAt: new Date().toISOString()
    }

    await addDoc(collection(db, 'deletedOrderNotifications'), notificationData)
    console.log('✅ Notification de suppression créée pour le client')
    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Obtenir les notifications non lues pour un client
 * @param {string} customerId - ID du client
 * @param {string} customerEmail - Email du client (optionnel)
 * @param {Function} callback - Fonction appelée avec les notifications
 * @returns {Function} Fonction pour se désabonner
 */
export const getDeletedOrderNotifications = (customerId, customerEmail, callback) => {
  if (!customerId && !customerEmail) {
    // Pas d'identifiant, retourner vide
    callback([])
    return () => {}
  }

  // Créer une requête pour trouver les notifications
  // On filtre par customerId ou customerEmail, puis on filtre read côté client
  let q
  if (customerId) {
    q = query(
      collection(db, 'deletedOrderNotifications'),
      where('customerId', '==', customerId)
    )
  } else {
    // Si pas de customerId, utiliser customerEmail
    q = query(
      collection(db, 'deletedOrderNotifications'),
      where('customerEmail', '==', customerEmail)
    )
  }

  return onSnapshot(q, (snapshot) => {
    // Filtrer les notifications non lues côté client
    const notifications = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(notif => !notif.read)
    callback(notifications)
  }, (error) => {
    console.error('Erreur lors de la récupération des notifications:', error)
    callback([])
  })
}

/**
 * Marquer une notification comme lue et la supprimer
 * @param {string} notificationId - ID de la notification
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    await deleteDoc(doc(db, 'deletedOrderNotifications', notificationId))
    console.log('✅ Notification marquée comme lue et supprimée')
    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error)
    throw error
  }
}

