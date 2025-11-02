// Service pour envoyer des SMS via Textbelt (gratuit)

/**
 * Formater le numéro de téléphone avec indicatif pays
 */
const formatPhoneNumber = (phone) => {
  if (!phone) return null
  
  // Enlever tous les espaces et caractères non numériques sauf +
  let cleaned = phone.replace(/\s/g, '').replace(/[^\d+]/g, '')
  
  // Si commence déjà par +, retourner tel quel
  if (cleaned.startsWith('+')) {
    return cleaned
  }
  
  // Si commence par 0, remplacer par +225 (Côte d'Ivoire)
  if (cleaned.startsWith('0')) {
    return '+225' + cleaned.substring(1)
  }
  
  // Si commence par 225, ajouter +
  if (cleaned.startsWith('225')) {
    return '+' + cleaned
  }
  
  // Sinon, ajouter +225 (Côte d'Ivoire)
  return '+225' + cleaned
}

/**
 * Envoyer SMS avec une clé spécifique
 */
const sendSMSWithKey = async (to, message, apiKey) => {
  try {
    const formattedPhone = formatPhoneNumber(to)
    
    if (!formattedPhone) {
      throw new Error('Numéro de téléphone invalide')
    }

    const response = await fetch('https://textbelt.com/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: formattedPhone,
        message: message,
        key: apiKey
      })
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || 'Erreur envoi SMS Textbelt')
    }

    return { success: true, method: 'Textbelt', quotaRemaining: result.quotaRemaining }

  } catch (error) {
    console.error('Erreur envoi SMS Textbelt:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Système de rotation de clés API Textbelt pour gérer plusieurs SMS/jour
 * Si vous avez plusieurs clés API Textbelt, mettez-les séparées par des virgules
 * 
 * COMMENT OBTENIR UNE CLÉ API TEXTBELT :
 * 1. Allez sur https://textbelt.com/purchase
 * 2. Créez un compte gratuit
 * 3. Achetez une clé API (optionnel - la clé "textbelt" gratuite fonctionne mais limitée)
 * 4. Ou créez plusieurs comptes gratuits pour avoir plusieurs clés
 * 
 * Avec plusieurs clés, vous pouvez envoyer plusieurs SMS/jour !
 */
const getTextbeltKey = () => {
  const keysString = import.meta.env.VITE_TEXTBELT_API_KEYS || ''
  
  if (!keysString) {
    // Pas de clés = utiliser la clé par défaut (gratuite, limitée à 1 SMS/jour par numéro)
    return import.meta.env.VITE_TEXTBELT_API_KEY || 'textbelt'
  }
  
  // Récupérer toutes les clés
  const keys = keysString.split(',').map(k => k.trim()).filter(k => k)
  
  if (keys.length === 0) {
    return 'textbelt'
  }
  
  // Utiliser une rotation basée sur un compteur persistant
  // Utiliser localStorage pour un compteur persistant entre les appels
  let counter = parseInt(localStorage.getItem('textbelt_key_counter') || '0')
  const index = counter % keys.length
  localStorage.setItem('textbelt_key_counter', (counter + 1).toString())
  
  return keys[index]
}

/**
 * Fonction principale pour envoyer un SMS
 * Utilise la rotation de clés si plusieurs clés sont configurées
 */
export const sendSMS = async (to, message) => {
  const apiKey = getTextbeltKey()
  return await sendSMSWithKey(to, message, apiKey)
}

/**
 * Envoyer une notification SMS pour nouvelle commande (admin)
 * DÉSACTIVÉ TEMPORAIREMENT - Réactiver quand vous payez un service SMS
 */
export const sendNewOrderSMS = async (orderData) => {
  // SMS désactivés pour l'instant
  // Pour réactiver : décommentez le code ci-dessous et configurez VITE_TEXTBELT_API_KEYS dans .env.local
  
  console.log('📧 SMS désactivé - Vous recevrez les notifications par email')
  return { success: false, error: 'SMS désactivé temporairement' }
  
  /*
  // CODE À RÉACTIVER QUAND VOUS PAYEZ
  const adminPhone = import.meta.env.VITE_ADMIN_PHONE || '+225000000000'
  
  if (!adminPhone || adminPhone === '+225000000000') {
    console.warn('⚠️ VITE_ADMIN_PHONE non configuré dans .env.local')
    return { success: false, error: 'Numéro admin non configuré' }
  }
  
  const message = `Nouvelle commande #${orderData.orderId?.slice(-6) || 'N/A'}\n` +
    `Client: ${orderData.customerName}\n` +
    `Total: ${orderData.total.toLocaleString()} FCFA\n` +
    `Articles: ${orderData.items?.length || 0}\n` +
    `${orderData.deliveryType === 'livraison' ? `Livraison: Chambre ${orderData.roomNumber}` : 'Sur place'}`

  const apiKey = getTextbeltKey()
  const result = await sendSMSWithKey(adminPhone, message, apiKey)
  
  if (result.quotaRemaining === 0) {
    console.warn('⚠️ Quota Textbelt atteint pour cette clé')
  }
  
  return result
  */
}

/**
 * Envoyer une confirmation SMS au client
 * DÉSACTIVÉ TEMPORAIREMENT - Réactiver quand vous payez un service SMS
 */
export const sendOrderConfirmationSMS = async (orderData) => {
  // SMS désactivés pour l'instant
  // Les clients reçoivent déjà les notifications toast en temps réel
  
  console.log('📧 SMS client désactivé - Utilisez les notifications toast')
  return { success: false, error: 'SMS désactivé temporairement' }
  
  /*
  // CODE À RÉACTIVER QUAND VOUS PAYEZ
  const customerPhone = orderData.customerPhone || orderData.phone

  if (!customerPhone) {
    console.warn('Pas de numéro de téléphone pour envoyer SMS au client')
    return { success: false, error: 'Pas de numéro de téléphone' }
  }

  const message = `Votre commande #${orderData.orderId?.slice(-6) || 'N/A'} a été reçue!\n` +
    `Total: ${orderData.total.toLocaleString()} FCFA\n` +
    `Statut: En attente\n` +
    `Merci pour votre commande!`

  const apiKey = getTextbeltKey()
  const result = await sendSMSWithKey(customerPhone, message, apiKey)
  
  if (result.quotaRemaining === 0) {
    console.warn('⚠️ Quota Textbelt atteint pour cette clé')
  }
  
  return result
  */
}
