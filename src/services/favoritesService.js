// Service pour gérer les favoris (localStorage pour non-connectés, Firebase pour connectés)

const FAVORITES_KEY = 'caro_delice_favorites'

/**
 * Obtenir les favoris depuis localStorage (pour non-connectés)
 */
export const getLocalFavorites = () => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY)
    return favorites ? JSON.parse(favorites) : []
  } catch (error) {
    console.error('Erreur lecture favoris localStorage:', error)
    return []
  }
}

/**
 * Sauvegarder les favoris dans localStorage (pour non-connectés)
 */
export const saveLocalFavorites = (favorites) => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  } catch (error) {
    console.error('Erreur sauvegarde favoris localStorage:', error)
  }
}

/**
 * Ajouter un favori dans localStorage
 */
export const addLocalFavorite = (itemId) => {
  const favorites = getLocalFavorites()
  if (!favorites.includes(itemId)) {
    favorites.push(itemId)
    saveLocalFavorites(favorites)
  }
  return favorites
}

/**
 * Retirer un favori de localStorage
 */
export const removeLocalFavorite = (itemId) => {
  const favorites = getLocalFavorites()
  const newFavorites = favorites.filter(id => id !== itemId)
  saveLocalFavorites(newFavorites)
  return newFavorites
}

/**
 * Toggle un favori dans localStorage
 */
export const toggleLocalFavorite = (itemId) => {
  const favorites = getLocalFavorites()
  if (favorites.includes(itemId)) {
    return removeLocalFavorite(itemId)
  } else {
    return addLocalFavorite(itemId)
  }
}

