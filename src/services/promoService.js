// Service pour gérer les codes promo et promotions

const PROMO_CODES_KEY = 'caro_delice_promo_codes'
const ACTIVE_PROMOTIONS_KEY = 'caro_delice_promotions'

/**
 * Codes promo par défaut (pour la première version)
 */
const DEFAULT_PROMO_CODES = {
  'BIENVENUE10': { discount: 10, description: 'Réduction de 10% sur votre première commande' },
  'SAMEDI20': { discount: 20, description: 'Réduction de 20% tous les samedis' },
  'FIDELITE15': { discount: 15, description: 'Code fidélité - 15% de réduction' }
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
 * Vérifier si un code promo est valide
 */
export const validatePromoCode = (code) => {
  const codes = getPromoCodes()
  const upperCode = code.toUpperCase().trim()
  
  if (codes[upperCode]) {
    return {
      valid: true,
      discount: codes[upperCode].discount,
      description: codes[upperCode].description
    }
  }
  
  return { valid: false, error: 'Code promo invalide' }
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

