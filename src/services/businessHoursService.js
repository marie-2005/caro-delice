// Service de gestion des horaires de service

/**
 * Période exceptionnelle : autoriser les commandes jusqu'à dimanche 18h
 * Calcule la date de fin (dimanche 18h00)
 */
const getExceptionalPeriodEnd = () => {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 = dimanche
  
  // Si on est dimanche après 18h, la période exceptionnelle est terminée
  if (dayOfWeek === 0 && today.getHours() >= 18) {
    return null // Période terminée
  }
  
  // Trouver le prochain dimanche à 18h00
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
  const nextSunday = new Date(today)
  nextSunday.setDate(today.getDate() + daysUntilSunday)
  nextSunday.setHours(18, 0, 0, 0) // 18h00
  nextSunday.setMinutes(0, 0, 0) // 18h00 exactement
  
  return nextSunday
}

/**
 * Vérifier si on est dans la période exceptionnelle
 * @returns {boolean}
 */
export const isExceptionalPeriod = () => {
  const now = new Date()
  const endDate = getExceptionalPeriodEnd()
  
  if (!endDate) {
    return false // Période terminée
  }
  
  return now <= endDate
}

// Configuration des horaires (peut être déplacée dans Firebase plus tard)
const BUSINESS_HOURS = {
  // Format: { day: { open: "HH:MM", close: "HH:MM" } }
  // day: 0 = dimanche, 1 = lundi, ..., 6 = samedi
  0: { open: "08:00", close: "18:00" }, // Dimanche - ouvert de 8h à 18h
  1: null, // Lundi - fermé
  2: null, // Mardi - fermé
  3: null, // Mercredi - fermé
  4: null, // Jeudi - fermé
  5: null, // Vendredi - fermé
  6: { open: "08:00", close: "22:00" } // Samedi - ouvert de 8h à 22h
}

/**
 * Obtenir les horaires d'aujourd'hui
 * @returns {Object|null} { open, close } ou null si fermé
 */
export const getTodayHours = () => {
  const today = new Date().getDay()
  return BUSINESS_HOURS[today]
}

/**
 * Vérifier si le restaurant est ouvert en ce moment
 * @returns {boolean}
 */
export const isCurrentlyOpen = () => {
  const todayHours = getTodayHours()
  
  if (!todayHours) {
    return false // Fermé aujourd'hui
  }

  const now = new Date()
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  
  return currentTime >= todayHours.open && currentTime <= todayHours.close
}

/**
 * Obtenir le message d'état (ouvert/fermé)
 * @returns {Object} { isOpen, message, nextOpen, isExceptional }
 */
export const getBusinessStatus = () => {
  // Vérifier si on est en période exceptionnelle
  const exceptional = isExceptionalPeriod()
  
  if (exceptional) {
    const endDate = getExceptionalPeriodEnd()
    if (endDate) {
      const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
      const endDay = dayNames[endDate.getDay()]
      const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`
      return {
        isOpen: true,
        message: `Période exceptionnelle : Commandes ouvertes jusqu'à ${endDay} ${endTime}`,
        nextOpen: null,
        isExceptional: true
      }
    }
  }
  
  const todayHours = getTodayHours()
  const now = new Date()
  const currentDay = now.getDay()
  
  // Si ouvert aujourd'hui
  if (todayHours) {
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    
    if (currentTime >= todayHours.open && currentTime <= todayHours.close) {
      return {
        isOpen: true,
        message: `Ouvert aujourd'hui jusqu'à ${todayHours.close}`,
        nextOpen: null,
        isExceptional: false
      }
    } else if (currentTime < todayHours.open) {
      return {
        isOpen: false,
        message: `Fermé - Réouverture aujourd'hui à ${todayHours.open}`,
        nextOpen: todayHours.open,
        isExceptional: false
      }
    } else {
      // Après la fermeture, chercher le prochain jour ouvert
      return getNextOpenDay(now)
    }
  }
  
  // Fermé aujourd'hui, chercher le prochain jour ouvert
  return getNextOpenDay(now)
}

/**
 * Trouver le prochain jour d'ouverture
 * @param {Date} fromDate - Date de départ
 * @returns {Object} { isOpen, message, nextOpen }
 */
const getNextOpenDay = (fromDate) => {
  const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
  let checkDate = new Date(fromDate)
  
  // Chercher dans les 7 prochains jours
  for (let i = 1; i <= 7; i++) {
    checkDate.setDate(fromDate.getDate() + i)
    const dayOfWeek = checkDate.getDay()
    const hours = BUSINESS_HOURS[dayOfWeek]
    
    if (hours) {
      const dayName = dayNames[dayOfWeek]
      return {
        isOpen: false,
        message: `Fermé - Réouverture ${dayName} à ${hours.open}`,
        nextOpen: `${dayName} ${hours.open}`,
        isExceptional: false
      }
    }
  }
  
  return {
    isOpen: false,
    message: 'Fermé - Aucune ouverture prévue',
    nextOpen: null,
    isExceptional: false
  }
}

/**
 * Obtenir tous les horaires de la semaine
 * @returns {Array} Liste des horaires par jour
 */
export const getWeeklyHours = () => {
  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  
  return dayNames.map((name, index) => {
    const hours = BUSINESS_HOURS[index]
    return {
      day: name,
      hours: hours ? `${hours.open} - ${hours.close}` : 'Fermé'
    }
  })
}

