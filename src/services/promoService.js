// Service pour gérer les codes promo et promotions

import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'

const PROMO_CODES_KEY = 'caro_delice_promo_codes'
const ACTIVE_PROMOTIONS_KEY = 'caro_delice_promotions'

/**
 * Codes promo par défaut (pour la première version)
 */
const DEFAULT_PROMO_CODES = {
  'BIENVENUE10': { 
    discount: 10, 
    description: 'Réduction de 10% sur votre première commande',
    oneTimeUse: true // Ne peut être utilisé qu'une seule fois par utilisateur
  },
  'SAMEDI20': { 
    discount: 20, 
    description: 'Réduction de 20% tous les samedis',
    oneTimeUse: false
  },
  'FIDELITE15': { 
    discount: 15, 
    description: 'Code fidélité - 15% de réduction',
    oneTimeUse: false
  }
}

/**
 * Promotions actives sur certains produits
 */
const DEFAULT_PROMOTIONS = {
  1: { discount: 10, endDate: null }, // Exemple : 10% sur Crêpe au Cérélac
}

/**
 * Obtenir les codes promo depuis localStorage
 */
export const getPromoCodes = () => {
  try {
    const codes = localStorage.getItem(PROMO_CODES_KEY)
    if (codes) {
      return JSON.parse(codes)
    }
    // Initialiser avec les codes par défaut
    savePromoCodes(DEFAULT_PROMO_CODES)
    return DEFAULT_PROMO_CODES
  } catch (error) {
    console.error('Erreur lecture codes promo:', error)
    return DEFAULT_PROMO_CODES
  }
}

/**
 * Sauvegarder les codes promo
 */
export const savePromoCodes = (codes) => {
  try {
    localStorage.setItem(PROMO_CODES_KEY, JSON.stringify(codes))
  } catch (error) {
    console.error('Erreur sauvegarde codes promo:', error)
  }
}

/**
 * Obtenir les promotions actives
 */
export const getActivePromotions = () => {
  try {
    const promotions = localStorage.getItem(ACTIVE_PROMOTIONS_KEY)
    if (promotions) {
      return JSON.parse(promotions)
    }
    saveActivePromotions(DEFAULT_PROMOTIONS)
    return DEFAULT_PROMOTIONS
  } catch (error) {
    console.error('Erreur lecture promotions:', error)
    return DEFAULT_PROMOTIONS
  }
}

/**
 * Sauvegarder les promotions actives
 */
export const saveActivePromotions = (promotions) => {
  try {
    localStorage.setItem(ACTIVE_PROMOTIONS_KEY, JSON.stringify(promotions))
  } catch (error) {
    console.error('Erreur sauvegarde promotions:', error)
  }
}

/**
 * Vérifier si un utilisateur a déjà utilisé un code promo (pour codes à usage unique)
 */
export const hasUserUsedPromoCode = async (userId, promoCode) => {
  try {
    if (!userId) {
      // Si pas d'utilisateur connecté, on ne peut pas vérifier
      // On autorise pour les utilisateurs non connectés (ils pourront utiliser une fois)
      return false
    }

    const promoUsageRef = collection(db, 'promoUsage')
    const q = query(
      promoUsageRef, 
      where('userId', '==', userId),
      where('promoCode', '==', promoCode.toUpperCase().trim())
    )
    
    const snapshot = await getDocs(q)
    return !snapshot.empty // Si on trouve des documents, l'utilisateur a déjà utilisé ce code
  } catch (error) {
    console.error('Erreur vérification usage code promo:', error)
    // En cas d'erreur, on autorise (pour ne pas bloquer)
    return false
  }
}

/**
 * Enregistrer l'utilisation d'un code promo par un utilisateur
 */
export const recordPromoCodeUsage = async (userId, promoCode, orderId) => {
  try {
    if (!userId) {
      // Pour les utilisateurs non connectés, on ne peut pas enregistrer
      // On pourrait utiliser localStorage, mais ça ne persiste pas entre appareils
      return
    }

    const promoUsageRef = doc(collection(db, 'promoUsage'))
    await setDoc(promoUsageRef, {
      userId,
      promoCode: promoCode.toUpperCase().trim(),
      orderId,
      usedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erreur enregistrement usage code promo:', error)
    // Ne pas bloquer si l'enregistrement échoue
  }
}

/**
 * Vérifier si un code promo est valide
 * @param {string} code - Le code promo à valider
 * @param {string|null} userId - L'ID de l'utilisateur (null si non connecté)
 */
export const validatePromoCode = async (code, userId = null) => {
  const codes = getPromoCodes()
  const upperCode = code.toUpperCase().trim()
  
  if (!codes[upperCode]) {
    return { valid: false, error: 'Code promo invalide' }
  }

  const promoInfo = codes[upperCode]

  // Pour les codes à usage unique, exiger une connexion
  // Vérifier explicitement si c'est BIENVENUE10 OU si oneTimeUse est défini
  const isOneTimeUseCode = upperCode === 'BIENVENUE10' || promoInfo.oneTimeUse === true
  
  if (isOneTimeUseCode) {
    // Vérifier que l'utilisateur est connecté
    if (!userId || userId === null) {
      console.log('Validation promo: userId manquant pour code à usage unique', { code: upperCode, userId })
      return { 
        valid: false, 
        error: 'Ce code promo nécessite une connexion. Veuillez créer un compte ou vous connecter pour l\'utiliser.' 
      }
    }

    // Vérifier si l'utilisateur a déjà utilisé ce code
    const alreadyUsed = await hasUserUsedPromoCode(userId, upperCode)
    
    if (alreadyUsed) {
      return { 
        valid: false, 
        error: 'Ce code promo a déjà été utilisé. Il ne peut être utilisé qu\'une seule fois.' 
      }
    }
  }

  return {
    valid: true,
    discount: promoInfo.discount,
    description: promoInfo.description,
    oneTimeUse: promoInfo.oneTimeUse || false
  }
}

/**
 * Appliquer une promotion à un produit
 */
export const applyPromotionToItem = (item, promotions) => {
  if (!promotions || !promotions[item.id]) {
    return item
  }
  
  const promotion = promotions[item.id]
  const discount = promotion.discount || 0
  const discountedPrice = Math.round(item.originalPrice * (1 - discount / 100))
  
  return {
    ...item,
    price: discountedPrice,
    promotion: {
      discount,
      originalPrice: item.originalPrice
    }
  }
}

/**
 * Appliquer un code promo au total
 */
export const applyPromoCodeToTotal = (total, promoCode) => {
  if (!promoCode) return total
  
  const validation = validatePromoCode(promoCode)
  if (!validation.valid) {
    return { total, discount: 0, error: validation.error }
  }
  
  const discount = Math.round(total * (validation.discount / 100))
  const discountedTotal = total - discount
  
  return {
    total: discountedTotal,
    discount,
    discountPercent: validation.discount,
    description: validation.description
  }
}

