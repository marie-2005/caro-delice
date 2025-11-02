// Service pour gérer les statuts de commande et les estimations de temps

/**
 * Obtenir le temps de préparation estimé selon le statut
 * @param {string} status - Statut de la commande
 * @returns {Object} { time, unit, message }
 */
export const getPreparationTime = (status) => {
  const statusTimes = {
    'en attente': { time: 5, unit: 'min', message: 'En attente de préparation' },
    'en préparation': { time: 15, unit: 'min', message: 'En cours de préparation (~15 min)' },
    'prête': { time: 0, unit: 'min', message: 'Prête pour récupération' },
    'livrée': { time: 0, unit: 'min', message: 'Commande livrée' },
    'annulée': { time: 0, unit: 'min', message: 'Commande annulée' }
  }

  return statusTimes[status] || { time: 0, unit: 'min', message: status }
}

/**
 * Obtenir le message de notification selon le changement de statut
 * @param {string} oldStatus - Ancien statut
 * @param {string} newStatus - Nouveau statut
 * @returns {Object} { message, type }
 */
export const getStatusChangeNotification = (oldStatus, newStatus) => {
  const notifications = {
    'en attente': {
      message: 'Votre commande a été reçue et est en attente de préparation',
      type: 'info'
    },
    'en préparation': {
      message: '🍳 Votre commande est en cours de préparation !',
      type: 'info'
    },
    'prête': {
      message: '✅ Votre commande est prête ! Vous pouvez venir la récupérer.',
      type: 'success'
    },
    'livrée': {
      message: '🎉 Votre commande a été livrée ! Merci !',
      type: 'success'
    },
    'annulée': {
      message: '❌ Votre commande a été annulée',
      type: 'error'
    }
  }

  return notifications[newStatus] || {
    message: `Statut de votre commande : ${newStatus}`,
    type: 'info'
  }
}

/**
 * Calculer le temps écoulé depuis la création
 * @param {string} createdAt - Date de création (ISO string)
 * @returns {string} - Temps écoulé formaté
 */
export const getElapsedTime = (createdAt) => {
  if (!createdAt) return 'Temps inconnu'
  
  const now = new Date()
  const created = new Date(createdAt)
  const diff = Math.floor((now - created) / 1000 / 60) // Différence en minutes

  if (diff < 1) return 'À l\'instant'
  if (diff < 60) return `Il y a ${diff} min`
  
  const hours = Math.floor(diff / 60)
  if (hours < 24) return `Il y a ${hours}h`
  
  const days = Math.floor(hours / 24)
  return `Il y a ${days}j`
}

/**
 * Obtenir le temps restant estimé avant la préparation
 * @param {string} status - Statut actuel
 * @param {string} createdAt - Date de création
 * @returns {string} - Message avec estimation
 */
export const getRemainingTime = (status, createdAt) => {
  const prepTime = getPreparationTime(status)
  
  if (status === 'prête' || status === 'livrée' || status === 'annulée') {
    return prepTime.message
  }

  if (status === 'en préparation') {
    return prepTime.message
  }

  if (status === 'en attente' && createdAt) {
    const elapsed = Math.floor((new Date() - new Date(createdAt)) / 1000 / 60)
    const estimated = 15 - elapsed
    if (estimated > 0) {
      return `Estimation : prêt dans ~${estimated} min`
    }
    return 'Bientôt prêt...'
  }

  return prepTime.message
}

