// Configuration Wave Business API
// Documentation : https://docs.wave.com/business
// IMPORTANT : Ne jamais commiter ce fichier avec les vraies clés !

// Variables d'environnement (chargées depuis .env.local)
export const waveConfig = {
  // Clé API Wave (Bearer token)
  apiKey: import.meta.env.VITE_WAVE_API_KEY || '',
  
  // ID du compte marchand (Business ID)
  businessId: import.meta.env.VITE_WAVE_BUSINESS_ID || '',
  
  // URL de l'API Wave
  // Pour Côte d'Ivoire : Wave CI peut avoir une API différente
  // Contactez support@wave.ci pour obtenir l'URL exacte
  // En attendant, utilisez l'API générique ou la méthode manuelle
  apiUrl: import.meta.env.VITE_WAVE_API_URL || 'https://api.waveapps.com/v1',
  
  // URLs de retour après paiement
  returnUrl: typeof window !== 'undefined' 
    ? `${window.location.origin}/payment/success` 
    : '',
  cancelUrl: typeof window !== 'undefined' 
    ? `${window.location.origin}/payment/cancel` 
    : ''
}

// Vérifier que Wave est configuré
export const isWaveConfigured = () => {
  return !!(waveConfig.apiKey && waveConfig.businessId)
}

export default waveConfig
