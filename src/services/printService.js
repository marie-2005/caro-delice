/**
 * Service de gestion de l'impression automatique des tickets
 * Supporte : tickets de commande, cuisine, et livraison
 */

// Configuration des imprimantes (peut être personnalisée)
const PRINTER_CONFIG = {
  orderTicket: 'default', // Imprimante pour tickets de commande
  kitchenTicket: 'default', // Imprimante pour tickets cuisine
  deliveryTicket: 'default' // Imprimante pour tickets livraison
}

/**
 * Formate une date pour l'affichage sur ticket
 */
const formatTicketDate = (dateString) => {
  if (!dateString) return 'Date inconnue'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

/**
 * Ouvre la fenêtre d'impression pour un ticket
 * Utilise plusieurs méthodes pour contourner le blocage des pop-ups
 */
const printTicket = (ticketComponent) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Ticket de Commande</title>
        <meta charset="UTF-8">
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          @media print {
            @page {
              size: 80mm auto;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: 'Courier New', 'Monaco', monospace;
              font-size: 12px;
              width: 80mm;
              max-width: 80mm;
            }
            .no-print {
              display: none !important;
            }
          }
          body {
            margin: 0;
            padding: 10px;
            font-family: 'Courier New', 'Monaco', monospace;
            font-size: 12px;
            width: 80mm;
            max-width: 80mm;
            line-height: 1.4;
          }
          @media screen {
            body {
              border: 1px solid #ddd;
              margin: 20px auto;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
          }
        </style>
      </head>
      <body>
        ${ticketComponent}
      </body>
    </html>
  `

  // Méthode 1 : Essayer d'ouvrir une nouvelle fenêtre
  try {
    const printWindow = window.open('', '_blank', 'width=300,height=600')
    
    if (printWindow && !printWindow.closed) {
      // Écrire le contenu immédiatement
      printWindow.document.open()
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      
      console.log('✅ Contenu écrit dans la fenêtre d\'impression')
      
      // Attendre que le contenu soit complètement chargé
      const waitForLoad = () => {
        try {
          // Vérifier si le document est prêt
          if (printWindow.document.readyState === 'complete') {
            // Attendre encore un peu pour que tout soit rendu
            setTimeout(() => {
              if (!printWindow.closed) {
                printWindow.focus() // Mettre le focus sur la fenêtre
                printWindow.print()
                console.log('✅ Impression déclenchée')
              }
            }, 300)
          } else {
            // Réessayer après un court délai
            setTimeout(waitForLoad, 100)
          }
        } catch (e) {
          console.warn('Erreur lors de l\'attente du chargement:', e)
          // Essayer quand même d'imprimer après un délai
          setTimeout(() => {
            if (!printWindow.closed) {
              try {
                printWindow.focus()
                printWindow.print()
                console.log('✅ Impression déclenchée (retry)')
              } catch (err) {
                console.error('Erreur impression:', err)
              }
            }
          }, 800)
        }
      }
      
      // Démarrer l'attente du chargement
      waitForLoad()
      
      // Fallback : forcer l'impression après 2 secondes même si onload ne s'est pas déclenché
      setTimeout(() => {
        try {
          if (!printWindow.closed) {
            printWindow.focus()
            printWindow.print()
            console.log('✅ Impression déclenchée (fallback final)')
          }
        } catch (e) {
          console.warn('Erreur impression fallback:', e)
        }
      }, 2000)
      
      return true
    }
  } catch (error) {
    console.warn('Méthode 1 (window.open) échouée:', error)
  }

  // Méthode 2 : Utiliser un iframe caché si les pop-ups sont bloquées
  try {
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = 'none'
    document.body.appendChild(iframe)
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
    iframeDoc.open()
    iframeDoc.write(htmlContent)
    iframeDoc.close()
    
    // Attendre que l'iframe soit chargé
    setTimeout(() => {
      try {
        iframe.contentWindow.print()
        console.log('✅ Impression via iframe réussie')
        // Retirer l'iframe après impression
        setTimeout(() => {
          document.body.removeChild(iframe)
        }, 1000)
        return true
      } catch (error) {
        console.warn('Erreur impression iframe:', error)
        document.body.removeChild(iframe)
      }
    }, 500)
  } catch (error) {
    console.error('Méthode 2 (iframe) échouée:', error)
  }

  // Si tout échoue, afficher un message
  //console.error('❌ Impossible d\'imprimer : les pop-ups sont peut-être bloquées')
  //alert('⚠️ L\'impression automatique n\'a pas pu s\'ouvrir.\n\nVeuillez autoriser les pop-ups pour ce site ou utiliser le bouton 🖨️ dans la liste des commandes pour imprimer manuellement.')
  return false
}

/**
 * Génère le HTML d'un ticket de commande (caisse)
 */
const generateOrderTicketHTML = (order) => {
  const date = formatTicketDate(order.createdAt || order.date)
  const promoInfo = order.appliedPromo 
    ? `\n🎁 PROMO: ${order.appliedPromo.code}\nRéduction: -${order.appliedPromo.discountAmount.toLocaleString()} FCFA`
    : ''
  
  return `
    <div style="text-align: center; padding: 10px; border-bottom: 2px dashed #000;">
      <h2 style="margin: 5px 0; font-size: 16px; font-weight: bold;">CARO DELICE</h2>
      <p style="margin: 2px 0; font-size: 10px;">Chambre C-75</p>
      <p style="margin: 2px 0; font-size: 10px;">Tel: 0759402520</p>
    </div>
    
    <div style="padding: 10px;">
      <div style="text-align: center; margin-bottom: 10px;">
        <strong>TICKET DE COMMANDE</strong>
      </div>
      
      <div style="margin-bottom: 8px;">
        <strong>Commande:</strong> #${order.id.toString().slice(-6)}<br/>
        <strong>Date:</strong> ${date}<br/>
        <strong>Statut:</strong> ${order.status}
      </div>
      
      <div style="border-top: 1px dashed #000; padding-top: 8px; margin-bottom: 8px;">
        <strong>CLIENT:</strong><br/>
        ${order.customerName || order.name}<br/>
        Tel: ${order.customerPhone || order.phone}<br/>
        ${order.customerEmail ? `Email: ${order.customerEmail}<br/>` : ''}
      </div>
      
      <div style="border-top: 1px dashed #000; padding-top: 8px; margin-bottom: 8px;">
        <strong>MODE:</strong> ${order.deliveryType === 'livraison' ? 'LIVRAISON' : 'SUR PLACE'}<br/>
        ${order.deliveryType === 'livraison' && order.roomNumber ? `Chambre: ${order.roomNumber}<br/>` : ''}
        ${order.deliveryType === 'sur-place' ? 'Retrait: Chambre C-75<br/>' : ''}
      </div>
      
      <div style="border-top: 1px dashed #000; padding-top: 8px; margin-bottom: 8px;">
        <strong>ARTICLES:</strong><br/>
        ${order.items.map(item => 
          `${item.quantity}x ${item.name} - ${(item.price * item.quantity).toLocaleString()} FCFA`
        ).join('<br/>')}
      </div>
      
      ${order.notes ? `
        <div style="border-top: 1px dashed #000; padding-top: 8px; margin-bottom: 8px;">
          <strong>NOTES:</strong><br/>
          ${order.notes}
        </div>
      ` : ''}
      
      <div style="border-top: 2px solid #000; padding-top: 8px; margin-top: 10px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>Sous-total:</span>
          <span>${(order.total + (order.appliedPromo?.discountAmount || 0)).toLocaleString()} FCFA</span>
        </div>
        ${promoInfo ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: #d32f2f;">
            <span>Réduction:</span>
            <span>-${order.appliedPromo.discountAmount.toLocaleString()} FCFA</span>
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; margin-top: 5px;">
          <span>TOTAL:</span>
          <span>${order.total.toLocaleString()} FCFA</span>
        </div>
        <div style="margin-top: 5px;">
          <strong>Paiement:</strong> ${order.paymentMethod.toUpperCase()}
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 15px; padding-top: 10px; border-top: 1px dashed #000;">
        <p style="font-size: 10px;">Merci de votre visite !</p>
        <p style="font-size: 9px;">www.carodelice.com</p>
      </div>
    </div>
  `
}

/**
 * Génère le HTML d'un ticket de cuisine
 */
const generateKitchenTicketHTML = (order) => {
  const date = formatTicketDate(order.createdAt || order.date)
  
  return `
    <div style="text-align: center; padding: 10px; border-bottom: 2px dashed #000; background: #fff3cd;">
      <h2 style="margin: 5px 0; font-size: 18px; font-weight: bold;">CUISINE</h2>
      <p style="margin: 2px 0; font-size: 12px;">TICKET DE PRÉPARATION</p>
    </div>
    
    <div style="padding: 10px;">
      <div style="text-align: center; margin-bottom: 10px; background: #ff6b6b; color: white; padding: 5px;">
        <strong>COMMANDE #${order.id.toString().slice(-6)}</strong>
      </div>
      
      <div style="margin-bottom: 8px;">
        <strong>Date:</strong> ${date}<br/>
        <strong>Statut:</strong> ${order.status}
      </div>
      
      <div style="border-top: 1px dashed #000; padding-top: 8px; margin-bottom: 8px;">
        <strong>CLIENT:</strong> ${order.customerName || order.name}<br/>
        Tel: ${order.customerPhone || order.phone}
      </div>
      
      <div style="border-top: 1px dashed #000; padding-top: 8px; margin-bottom: 8px;">
        <strong>MODE:</strong> ${order.deliveryType === 'livraison' ? 'LIVRAISON' : 'SUR PLACE'}<br/>
        ${order.deliveryType === 'livraison' && order.roomNumber ? `Chambre: ${order.roomNumber}` : ''}
      </div>
      
      <div style="border-top: 2px solid #000; padding-top: 8px; margin-bottom: 8px;">
        <strong>À PRÉPARER:</strong><br/>
        ${order.items.map(item => 
          `<div style="margin: 5px 0; padding: 5px; background: #f8f9fa; border-left: 3px solid #ff6b6b;">
            <strong>${item.quantity}x ${item.name}</strong>
          </div>`
        ).join('')}
      </div>
      
      ${order.notes ? `
        <div style="border-top: 1px dashed #000; padding-top: 8px; margin-bottom: 8px; background: #fff3cd; padding: 8px;">
          <strong>⚠️ NOTES SPÉCIALES:</strong><br/>
          ${order.notes}
        </div>
      ` : ''}
      
      <div style="text-align: center; margin-top: 15px; padding-top: 10px; border-top: 1px dashed #000;">
        <p style="font-size: 10px; font-weight: bold;">Temps estimé: 15-20 min</p>
      </div>
    </div>
  `
}

/**
 * Génère le HTML d'un ticket de livraison
 */
const generateDeliveryTicketHTML = (order) => {
  const date = formatTicketDate(order.createdAt || order.date)
  
  if (order.deliveryType !== 'livraison') {
    return null // Pas de ticket de livraison si ce n'est pas une livraison
  }
  
  return `
    <div style="text-align: center; padding: 10px; border-bottom: 2px dashed #000; background: #d4edda;">
      <h2 style="margin: 5px 0; font-size: 18px; font-weight: bold;">LIVRAISON</h2>
      <p style="margin: 2px 0; font-size: 12px;">TICKET DE LIVRAISON</p>
    </div>
    
    <div style="padding: 10px;">
      <div style="text-align: center; margin-bottom: 10px; background: #28a745; color: white; padding: 5px;">
        <strong>COMMANDE #${order.id.toString().slice(-6)}</strong>
      </div>
      
      <div style="margin-bottom: 8px;">
        <strong>Date:</strong> ${date}<br/>
        <strong>Statut:</strong> ${order.status}
      </div>
      
      <div style="border-top: 2px solid #000; padding-top: 8px; margin-bottom: 8px;">
        <strong>📍 ADRESSE DE LIVRAISON:</strong><br/>
        <div style="background: #fff3cd; padding: 8px; margin: 5px 0; border-left: 3px solid #ffc107;">
          <strong>Chambre: ${order.roomNumber || 'N/A'}</strong>
        </div>
      </div>
      
      <div style="border-top: 1px dashed #000; padding-top: 8px; margin-bottom: 8px;">
        <strong>👤 CLIENT:</strong><br/>
        ${order.customerName || order.name}<br/>
        <strong>Tel:</strong> ${order.customerPhone || order.phone}
      </div>
      
      <div style="border-top: 1px dashed #000; padding-top: 8px; margin-bottom: 8px;">
        <strong>📦 ARTICLES À LIVRER:</strong><br/>
        ${order.items.map(item => 
          `${item.quantity}x ${item.name}`
        ).join('<br/>')}
      </div>
      
      ${order.notes ? `
        <div style="border-top: 1px dashed #000; padding-top: 8px; margin-bottom: 8px;">
          <strong>📝 NOTES:</strong><br/>
          ${order.notes}
        </div>
      ` : ''}
      
      <div style="border-top: 2px solid #000; padding-top: 8px; margin-top: 10px;">
        <div style="text-align: center; font-size: 14px; font-weight: bold;">
          TOTAL: ${order.total.toLocaleString()} FCFA
        </div>
        <div style="margin-top: 5px; text-align: center;">
          <strong>Paiement:</strong> ${order.paymentMethod.toUpperCase()}
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 15px; padding-top: 10px; border-top: 1px dashed #000; background: #d4edda;">
        <p style="font-size: 10px; font-weight: bold;">✅ Signature client requise</p>
        <p style="font-size: 9px; margin-top: 5px;">_________________________</p>
      </div>
    </div>
  `
}

/**
 * Impression automatique lors de la création d'une commande
 * Imprime : UNIQUEMENT le ticket de commande (caisse)
 */
export const autoPrintOnOrderCreate = async (orderData) => {
  try {
    console.log('🖨️ Tentative d\'impression automatique pour la commande:', orderData.id)
    
    // Délai minimal pour s'assurer que la commande est bien créée
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Imprimer UNIQUEMENT le ticket de commande (caisse)
    const orderTicketHTML = generateOrderTicketHTML(orderData)
    const success = printTicket(orderTicketHTML)
    
    if (success) {
      console.log('✅ Ticket de commande imprimé automatiquement:', {
        orderId: orderData.id,
        ticket: 'Commande'
      })
    } else {
      console.warn('⚠️ Impression automatique échouée (pop-ups peut-être bloquées)')
    }
  } catch (error) {
    console.error('❌ Erreur impression automatique création commande:', error)
    // Ne pas faire échouer la création de commande si l'impression échoue
  }
}

/**
 * Impression automatique lors du changement de statut
 * DÉSACTIVÉ : On n'imprime plus automatiquement lors du changement de statut
 * Seul le ticket de commande est imprimé à la création
 */
export const autoPrintOnStatusChange = (orderData, oldStatus, newStatus) => {
  // Fonction désactivée - pas d'impression automatique lors du changement de statut
  return
  
  // Ancien code commenté (pour référence)
  /*
  try {
    // Imprimer le ticket de livraison si statut passe à "prête" ou "en livraison"
    if (
      orderData.deliveryType === 'livraison' &&
      (newStatus === 'prête' || newStatus === 'en livraison') &&
      oldStatus !== newStatus
    ) {
      const deliveryTicketHTML = generateDeliveryTicketHTML(orderData)
      if (deliveryTicketHTML) {
        setTimeout(() => {
          printTicket(deliveryTicketHTML)
          console.log('✅ Ticket de livraison imprimé automatiquement:', {
            orderId: orderData.id,
            status: newStatus
          })
        }, 500)
      }
    }
  } catch (error) {
    console.error('❌ Erreur impression automatique changement statut:', error)
  }
  */
}

/**
 * Impression manuelle d'un ticket (depuis l'interface admin)
 */
export const printOrderTicket = (order) => {
  const ticketHTML = generateOrderTicketHTML(order)
  return printTicket(ticketHTML)
}

export const printKitchenTicket = (order) => {
  const ticketHTML = generateKitchenTicketHTML(order)
  return printTicket(ticketHTML)
}

export const printDeliveryTicket = (order) => {
  const ticketHTML = generateDeliveryTicketHTML(order)
  if (!ticketHTML) {
    alert('Cette commande n\'est pas une livraison')
    return false
  }
  return printTicket(ticketHTML)
}

/**
 * Configuration des imprimantes
 */
export const configurePrinters = (config) => {
  Object.assign(PRINTER_CONFIG, config)
}
