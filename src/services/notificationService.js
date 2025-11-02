// Service de notification par email pour les nouvelles commandes
// Utilise EmailJS (gratuit) pour envoyer des emails depuis le frontend

/**
 * Envoyer une notification email à l'admin lorsqu'une nouvelle commande est créée
 * @param {Object} orderData - Données de la commande
 * @param {string} orderData.orderId - ID de la commande
 * @param {string} orderData.customerName - Nom du client
 * @param {string} orderData.customerPhone - Téléphone du client
 * @param {number} orderData.total - Montant total
 * @param {Array} orderData.items - Articles commandés
 * @param {string} orderData.status - Statut de la commande
 */
export const sendNewOrderNotification = async (orderData) => {
  try {
    // Vérifier si EmailJS est configuré
    const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    const emailJsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const emailJsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL

    // Log de débogage pour voir ce qui est chargé
    console.log('🔍 Debug EmailJS Config:', {
      publicKey: emailJsPublicKey ? emailJsPublicKey.substring(0, 10) + '...' : 'MANQUANT',
      serviceId: emailJsServiceId || 'MANQUANT',
      templateId: emailJsTemplateId || 'MANQUANT',
      adminEmail: adminEmail || 'MANQUANT'
    })

    if (!emailJsPublicKey || !emailJsServiceId || !emailJsTemplateId || !adminEmail) {
      console.warn('⚠️ EmailJS non configuré - Notification non envoyée', {
        publicKey: !!emailJsPublicKey,
        serviceId: !!emailJsServiceId,
        templateId: !!emailJsTemplateId,
        adminEmail: !!adminEmail
      })
      return { success: false, reason: 'EmailJS non configuré' }
    }

    // Charger EmailJS dynamiquement
    if (typeof window === 'undefined') {
      return { success: false, reason: 'Hors navigateur' }
    }

    // Importer EmailJS
    const emailjs = (await import('@emailjs/browser')).default
    emailjs.init(emailJsPublicKey)

    // Formater les articles pour l'email
    const itemsList = orderData.items
      .map(item => `• ${item.quantity}x ${item.name} - ${item.price.toLocaleString()} FCFA`)
      .join('\n')

    // Préparer les données de l'email
    const templateParams = {
      to_email: adminEmail,
      order_id: orderData.orderId,
      customer_name: orderData.customerName || 'Non renseigné',
      customer_phone: orderData.customerPhone || 'Non renseigné',
      customer_email: orderData.customerEmail || 'Non renseigné',
      total: orderData.total.toLocaleString(),
      items: itemsList,
      status: orderData.status || 'en attente',
      delivery_type: orderData.deliveryType === 'livraison' 
        ? `Livraison: Chambre ${orderData.roomNumber || 'Non renseigné'}`
        : 'Retrait: Chambre C-75',
      payment_method: orderData.paymentMethod || 'Non renseigné',
      notes: orderData.notes || 'Aucune note',
      date: new Date(orderData.createdAt || new Date()).toLocaleString('fr-FR'),
      message: `Nouvelle commande #${orderData.orderId.slice(-6)}`
    }

    // Log des paramètres avant envoi
    console.log('📧 Envoi de notification email...', {
      serviceId: emailJsServiceId,
      templateId: emailJsTemplateId,
      to: adminEmail,
      orderId: orderData.orderId
    })

    // Envoyer l'email
    const response = await emailjs.send(
      emailJsServiceId,
      emailJsTemplateId,
      templateParams
    )

    console.log('✅ Notification email envoyée avec succès:', response)
    return { success: true, response }
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de la notification:', error)
    console.error('Détails:', {
      message: error.message,
      status: error.status,
      text: error.text
    })
    // Ne pas bloquer la création de commande en cas d'erreur de notification
    return { success: false, error: error.message || 'Erreur inconnue' }
  }
}

