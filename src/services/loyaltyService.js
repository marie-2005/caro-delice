// Service pour gérer le système de points fidélité

import { doc, getDoc, setDoc, updateDoc, collection, query, where, orderBy, getDocs, addDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

const POINTS_PER_100FCFA = 1 // 1 point pour 100 FCFA dépensés
const POINTS_FOR_DISCOUNT = 100 // 100 points = 15% de réduction
const DISCOUNT_PERCENTAGE = 15 // Pourcentage de réduction (15%)

/**
 * Calculer les points gagnés selon le montant dépensé
 */
export const calculatePointsEarned = (amount) => {
  return Math.floor(amount / 100) // 1 point pour chaque 100 FCFA
}

/**
 * Obtenir ou créer le profil de fidélité d'un utilisateur
 */
export const getLoyaltyProfile = async (userId) => {
  try {
    const loyaltyRef = doc(db, 'loyalty', userId)
    const loyaltySnap = await getDoc(loyaltyRef)

    if (loyaltySnap.exists()) {
      return loyaltySnap.data()
    } else {
      // Créer un nouveau profil de fidélité
      const newProfile = {
        userId,
        totalPoints: 0,
        availablePoints: 0,
        usedPoints: 0,
        totalOrders: 0,
        badge: 'bronze',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      await setDoc(loyaltyRef, newProfile)
      return newProfile
    }
  } catch (error) {
    console.error('Erreur récupération profil fidélité:', error)
    throw error
  }
}

/**
 * Ajouter des points après une commande
 */
export const addPointsFromOrder = async (userId, orderAmount, orderId) => {
  try {
    const pointsEarned = calculatePointsEarned(orderAmount)
    
    if (pointsEarned <= 0) {
      return { success: true, pointsEarned: 0 }
    }

    const loyaltyRef = doc(db, 'loyalty', userId)
    const loyaltySnap = await getDoc(loyaltyRef)

    let currentProfile
    if (loyaltySnap.exists()) {
      currentProfile = loyaltySnap.data()
    } else {
      currentProfile = {
        userId,
        totalPoints: 0,
        availablePoints: 0,
        usedPoints: 0,
        totalOrders: 0,
        badge: 'bronze',
        createdAt: new Date().toISOString()
      }
    }

    // Mettre à jour les points
    const newTotalPoints = (currentProfile.totalPoints || 0) + pointsEarned
    const newAvailablePoints = (currentProfile.availablePoints || 0) + pointsEarned
    const newTotalOrders = (currentProfile.totalOrders || 0) + 1

    // Calculer le badge
    const newBadge = calculateBadge(newTotalOrders)

    // Enregistrer dans l'historique
    await addPointsHistory(userId, {
      type: 'earned',
      points: pointsEarned,
      orderId,
      orderAmount,
      date: new Date().toISOString()
    })

    // Mettre à jour le profil
    await updateDoc(loyaltyRef, {
      totalPoints: newTotalPoints,
      availablePoints: newAvailablePoints,
      totalOrders: newTotalOrders,
      badge: newBadge,
      updatedAt: new Date().toISOString()
    })

    return {
      success: true,
      pointsEarned,
      totalPoints: newTotalPoints,
      availablePoints: newAvailablePoints,
      badge: newBadge
    }
  } catch (error) {
    console.error('Erreur ajout points:', error)
    throw error
  }
}

/**
 * Utiliser des points pour payer une commande
 * 100 points = 15% de réduction sur le total
 */
export const usePointsForOrder = async (userId, pointsToUse, orderAmount, orderId) => {
  try {
    const profile = await getLoyaltyProfile(userId)

    // Vérifier que l'utilisateur a au moins 100 points
    if (profile.availablePoints < POINTS_FOR_DISCOUNT) {
      return {
        success: false,
        error: `Vous avez besoin d'au moins ${POINTS_FOR_DISCOUNT} points pour utiliser cette réduction`
      }
    }

    // Utiliser exactement 100 points pour obtenir 15% de réduction
    const pointsToDeduct = POINTS_FOR_DISCOUNT
    if (profile.availablePoints < pointsToDeduct) {
      return {
        success: false,
        error: 'Points insuffisants'
      }
    }

    // Calculer la réduction : 10% du montant de la commande
    const discountAmount = Math.round(orderAmount * (DISCOUNT_PERCENTAGE / 100))

    const loyaltyRef = doc(db, 'loyalty', userId)

    // Enregistrer dans l'historique
    await addPointsHistory(userId, {
      type: 'used',
      points: pointsToDeduct,
      orderId,
      discountAmount,
      discountPercentage: DISCOUNT_PERCENTAGE,
      date: new Date().toISOString()
    })

    // Mettre à jour le profil
    await updateDoc(loyaltyRef, {
      availablePoints: profile.availablePoints - pointsToDeduct,
      usedPoints: (profile.usedPoints || 0) + pointsToDeduct,
      updatedAt: new Date().toISOString()
    })

    return {
      success: true,
      discountAmount,
      discountPercentage: DISCOUNT_PERCENTAGE,
      pointsUsed: pointsToDeduct,
      remainingPoints: profile.availablePoints - pointsToDeduct
    }
  } catch (error) {
    console.error('Erreur utilisation points:', error)
    throw error
  }
}

/**
 * Ajouter une entrée dans l'historique des points
 */
export const addPointsHistory = async (userId, historyEntry) => {
  try {
    const historyRef = collection(db, 'loyalty', userId, 'history')
    await addDoc(historyRef, {
      ...historyEntry,
      createdAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erreur ajout historique points:', error)
  }
}

/**
 * Obtenir l'historique des points
 */
export const getPointsHistory = async (userId, limit = 50) => {
  try {
    const historyRef = collection(db, 'loyalty', userId, 'history')
    const q = query(historyRef, orderBy('date', 'desc'))
    const snapshot = await getDocs(q)

    return snapshot.docs
      .slice(0, limit)
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
  } catch (error) {
    console.error('Erreur récupération historique:', error)
    return []
  }
}

/**
 * Calculer le badge selon le nombre de commandes
 */
export const calculateBadge = (totalOrders) => {
  if (totalOrders >= 50) {
    return 'or'
  } else if (totalOrders >= 20) {
    return 'argent'
  } else {
    return 'bronze'
  }
}

/**
 * Obtenir les informations du badge
 */
export const getBadgeInfo = (badge) => {
  const badges = {
    bronze: {
      name: 'Bronze',
      icon: '🥉',
      description: 'Client fidèle',
      minOrders: 0
    },
    argent: {
      name: 'Argent',
      icon: '🥈',
      description: 'Client VIP',
      minOrders: 20
    },
    or: {
      name: 'Or',
      icon: '🥇',
      description: 'Client Premium',
      minOrders: 50
    }
  }

  return badges[badge] || badges.bronze
}

/**
 * Obtenir les points disponibles pour un utilisateur
 */
export const getAvailablePoints = async (userId) => {
  try {
    const profile = await getLoyaltyProfile(userId)
    return profile.availablePoints || 0
  } catch (error) {
    console.error('Erreur récupération points:', error)
    return 0
  }
}

/**
 * Convertir les points en réduction (pourcentage)
 * Retourne le pourcentage de réduction si l'utilisateur a assez de points
 */
export const pointsToDiscount = (points, orderAmount) => {
  // Il faut 100 points pour obtenir 15% de réduction
  if (points >= POINTS_FOR_DISCOUNT) {
    return {
      canUse: true,
      discountPercentage: DISCOUNT_PERCENTAGE,
      discountAmount: Math.round(orderAmount * (DISCOUNT_PERCENTAGE / 100)),
      pointsRequired: POINTS_FOR_DISCOUNT
    }
  }
  return {
    canUse: false,
    pointsRequired: POINTS_FOR_DISCOUNT,
    pointsNeeded: POINTS_FOR_DISCOUNT - points
  }
}

/**
 * Vérifier si l'utilisateur peut utiliser des points pour cette commande
 */
export const canUsePointsForOrder = (availablePoints) => {
  return availablePoints >= POINTS_FOR_DISCOUNT
}

/**
 * Obtenir le nombre de points nécessaires pour utiliser la réduction
 */
export const getPointsRequiredForDiscount = () => {
  return POINTS_FOR_DISCOUNT
}

/**
 * Obtenir le pourcentage de réduction
 */
export const getDiscountPercentage = () => {
  return DISCOUNT_PERCENTAGE
}

