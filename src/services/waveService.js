// Service Wave pour les paiements
// Documentation : https://docs.wave.com/business

import { waveConfig } from '../config/wave'

/**
 * Créer une session de paiement Wave Checkout
 * @param {Object} paymentData - Données du paiement
 * @param {number} paymentData.amount - Montant en FCFA
 * @param {string} paymentData.orderId - ID de la commande
 * @param {string} paymentData.customerPhone - Téléphone du client
 * @param {string} paymentData.customerName - Nom du client
 * @returns {Promise<string>} URL de paiement Wave
 */
export const createWavePayment = async (paymentData) => {
  try {
    // Vérifier que Wave est configuré
    if (!waveConfig.apiKey) {
      throw new Error('Wave n\'est pas configuré. Veuillez ajouter votre clé API dans .env.local')
    }

    // Structure de la requête selon l'API Wave Checkout
    // Documentation complète : https://docs.wave.com/checkout
    // API URL : https://api.waveapps.com/v1/checkout/sessions
    
    const checkoutSession = {
      amount: paymentData.amount,
      currency: 'XOF', // Franc CFA pour Sénégal/Côte d'Ivoire
      business_id: waveConfig.businessId,
      customer: {
        name: paymentData.customerName,
        phone: paymentData.customerPhone
      },
      metadata: {
        order_id: paymentData.orderId,
        reference: `COMMANDE-${paymentData.orderId}`,
        customer_phone: paymentData.customerPhone
      },
      success_url: waveConfig.returnUrl,
      cancel_url: waveConfig.cancelUrl,
      // Wave Checkout peut aussi accepter :
      // description: `Commande ${paymentData.orderId}`,
      // callback_url: waveConfig.returnUrl // Pour les webhooks
    }
    
    // Faire la requête à l'API Wave Checkout
    // Endpoint : POST https://api.waveapps.com/v1/checkout/sessions
    const response = await fetch(`${waveConfig.apiUrl}/checkout/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${waveConfig.apiKey}`,
        // Certaines versions peuvent nécessiter :
        // 'X-Wave-Business-ID': waveConfig.businessId
      },
      body: JSON.stringify(checkoutSession)
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erreur lors de la création du paiement Wave' }))
      throw new Error(error.message || 'Erreur lors de la création du paiement Wave')
    }

    const data = await response.json()
    
    // Retourner l'URL de paiement (format peut varier selon l'API)
    return data.checkout_url || data.url || data.payment_url

  } catch (error) {
    console.error('Erreur Wave:', error)
    throw error
  }
}

/**
 * Vérifier le statut d'un paiement
 * @param {string} sessionId - ID de la session de paiement Wave
 * @returns {Promise<Object>} Statut du paiement
 */
export const checkWavePaymentStatus = async (sessionId) => {
  try {
    if (!waveConfig.apiKey) {
      throw new Error('Wave n\'est pas configuré')
    }
    
    const response = await fetch(`${waveConfig.apiUrl}/checkout/sessions/${sessionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${waveConfig.apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la vérification du paiement')
    }

    return await response.json()

  } catch (error) {
    console.error('Erreur vérification Wave:', error)
    throw error
  }
}

/**
 * Générer un lien de paiement Wave Mobile Money
 * Pour Wave Mobile Money (Sénégal/Côte d'Ivoire)
 * Le client peut payer via l'app Wave, USSD, ou le site web
 */
export const generateWavePaymentLink = (amount, orderId, phone) => {
  // Numéro Wave Business (à modifier avec votre numéro)
  const waveBusinessNumber = '0759402520' // 👈 REMPLACEZ par votre numéro Wave Business
  
  // Instructions de paiement claires
  const message = `📱 INSTRUCTIONS DE PAIEMENT WAVE\n\n` +
    `Commande : #${orderId}\n` +
    `Montant : ${amount.toLocaleString()} FCFA\n\n` +
    `Pour payer :\n` +
    `1. Ouvrez l'application Wave sur votre téléphone\n` +
    `2. Allez dans "Envoyer" ou "Paiement"\n` +
    `3. Entrez le numéro : ${waveBusinessNumber}\n` +
    `4. Entrez le montant : ${amount.toLocaleString()} FCFA\n` +
    `5. Dans la description, écrivez : "Commande ${orderId}"\n` +
    `6. Confirmez le paiement\n\n` +
    `Après paiement, votre commande sera validée automatiquement.`
  
  return {
    type: 'manual',
    message: message,
    instructions: `Payez ${amount.toLocaleString()} FCFA via Wave vers ${waveBusinessNumber}\nRéférence: Commande ${orderId}`,
    waveBusinessNumber: waveBusinessNumber,
    orderReference: `COMMANDE-${orderId}`
  }
}

