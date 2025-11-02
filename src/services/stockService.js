// Service pour gérer les stocks

const STOCK_KEY = 'caro_delice_stock'

/**
 * Obtenir les stocks depuis localStorage
 */
export const getStock = () => {
  try {
    const stock = localStorage.getItem(STOCK_KEY)
    if (stock) {
      return JSON.parse(stock)
    }
    // Stocks par défaut si aucun stock enregistré
    return getDefaultStock()
  } catch (error) {
    console.error('Erreur lecture stock:', error)
    return getDefaultStock()
  }
}

/**
 * Stocks par défaut pour chaque article
 */
const getDefaultStock = () => {
  return {
    1: { quantity: 100, lowThreshold: 20, name: 'Crêpe au Cérélac' },
    2: { quantity: 100, lowThreshold: 20, name: 'Crêpe au Nutella' },
    3: { quantity: 100, lowThreshold: 20, name: 'Crêpe Nature' },
    4: { quantity: 100, lowThreshold: 20, name: 'Crêpe au Jambon/Fromage' },
    5: { quantity: 100, lowThreshold: 20, name: 'Crêpe au Viande/Fromage' }
  }
}

/**
 * Sauvegarder les stocks
 */
export const saveStock = (stock) => {
  try {
    localStorage.setItem(STOCK_KEY, JSON.stringify(stock))
  } catch (error) {
    console.error('Erreur sauvegarde stock:', error)
  }
}

/**
 * Mettre à jour la quantité d'un article
 */
export const updateStockQuantity = (itemId, quantity) => {
  const stock = getStock()
  if (stock[itemId]) {
    stock[itemId].quantity = Math.max(0, quantity)
    saveStock(stock)
    return stock
  }
  return stock
}

/**
 * Réduire le stock après une commande
 */
export const reduceStock = (orderItems) => {
  const stock = getStock()
  let hasLowStock = false
  const lowStockItems = []

  orderItems.forEach(item => {
    const itemId = item.id || item.itemId
    if (stock[itemId]) {
      stock[itemId].quantity = Math.max(0, stock[itemId].quantity - (item.quantity || 1))
      
      // Vérifier si stock faible
      if (stock[itemId].quantity <= stock[itemId].lowThreshold) {
        hasLowStock = true
        lowStockItems.push({
          id: itemId,
          name: stock[itemId].name,
          quantity: stock[itemId].quantity,
          threshold: stock[itemId].lowThreshold
        })
      }
    }
  })

  saveStock(stock)
  return { stock, hasLowStock, lowStockItems }
}

/**
 * Obtenir les articles avec stock faible
 */
export const getLowStockItems = () => {
  const stock = getStock()
  const lowStockItems = []

  Object.keys(stock).forEach(itemId => {
    if (stock[itemId].quantity <= stock[itemId].lowThreshold) {
      lowStockItems.push({
        id: parseInt(itemId),
        ...stock[itemId]
      })
    }
  })

  return lowStockItems
}

/**
 * Vérifier si un article est en stock
 */
export const isInStock = (itemId, quantity = 1) => {
  const stock = getStock()
  if (stock[itemId]) {
    return stock[itemId].quantity >= quantity
  }
  return true // Si pas de gestion de stock, considérer comme disponible
}

