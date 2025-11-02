// Service pour gérer les notes/évaluations des commandes

/**
 * Enregistrer une note pour une commande
 * @param {string} orderId - ID de la commande
 * @param {number} rating - Note de 1 à 5
 * @param {string} comment - Commentaire optionnel
 */
export const saveOrderRating = async (orderId, rating, comment = '') => {
  try {
    // Pour l'instant, sauvegarder dans localStorage
    // Plus tard, on pourra l'envoyer à Firebase
    const ratings = getLocalRatings()
    ratings[orderId] = {
      rating,
      comment,
      date: new Date().toISOString()
    }
    localStorage.setItem('caro_delice_ratings', JSON.stringify(ratings))
    return { success: true }
  } catch (error) {
    console.error('Erreur sauvegarde note:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Obtenir la note d'une commande depuis localStorage
 */
export const getOrderRating = (orderId) => {
  try {
    const ratings = getLocalRatings()
    return ratings[orderId] || null
  } catch (error) {
    console.error('Erreur lecture note:', error)
    return null
  }
}

/**
 * Obtenir toutes les notes depuis localStorage
 */
const getLocalRatings = () => {
  try {
    const ratings = localStorage.getItem('caro_delice_ratings')
    return ratings ? JSON.parse(ratings) : {}
  } catch (error) {
    console.error('Erreur lecture notes localStorage:', error)
    return {}
  }
}

