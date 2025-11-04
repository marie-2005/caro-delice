import React, { useState, useEffect } from 'react'
import { validatePromoCode } from '../services/promoService'
import './PromoCode.css'

function PromoCode({ onApplyPromo, appliedPromo, total, userId = null }) {
  const [promoCode, setPromoCode] = useState('')
  const [error, setError] = useState('')
  const [applying, setApplying] = useState(false)

  // Nettoyer le code promo appliqué si l'utilisateur n'est plus connecté et que c'est un code à usage unique
  useEffect(() => {
    if (appliedPromo && appliedPromo.code === 'BIENVENUE10' && !userId) {
      // Si le code BIENVENUE10 est appliqué mais l'utilisateur n'est pas connecté, le retirer
      onApplyPromo(null)
      setError('Ce code promo nécessite une connexion. Veuillez créer un compte ou vous connecter.')
    }
  }, [userId, appliedPromo, onApplyPromo])

  const handleApply = async () => {
    if (!promoCode.trim()) {
      setError('Veuillez entrer un code promo')
      return
    }

    setApplying(true)
    setError('')

    // Debug: vérifier si userId est passé
    console.log('PromoCode - userId reçu:', userId, 'Code:', promoCode.trim())

    // Valider le code promo avec l'userId (vérifie si déjà utilisé pour codes à usage unique)
    const validation = await validatePromoCode(promoCode.trim(), userId)
    
    if (!validation.valid) {
      setError(validation.error)
      setApplying(false)
      return
    }

    // Calculer la réduction
    const discount = Math.round(total * (validation.discount / 100))
    const discountedTotal = total - discount

    const promoData = {
      code: promoCode.toUpperCase().trim(),
      discount: validation.discount,
      discountAmount: discount,
      total: discountedTotal,
      description: validation.description
    }

    // Sauvegarder dans sessionStorage pour persister entre les sessions
    sessionStorage.setItem('applied_promo', JSON.stringify(promoData))

    onApplyPromo(promoData)

    setPromoCode('')
    setApplying(false)
  }

  const handleRemove = () => {
    sessionStorage.removeItem('applied_promo')
    onApplyPromo(null)
    setPromoCode('')
    setError('')
  }

  return (
    <div className="promo-code-section">
      <h3>🎁 Code Promo</h3>
      {!appliedPromo ? (
        <div className="promo-input-group">
          <input
            type="text"
            className="promo-input"
            placeholder="Entrez votre code promo"
            value={promoCode}
            onChange={(e) => {
              setPromoCode(e.target.value)
              setError('')
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleApply()
              }
            }}
          />
          <button
            className="promo-apply-btn"
            onClick={handleApply}
            disabled={applying}
          >
            {applying ? '...' : 'Appliquer'}
          </button>
        </div>
      ) : (
        <div className="promo-applied">
          <div className="promo-success">
            <span className="promo-check">✅</span>
            <div className="promo-info">
              <strong>{appliedPromo.code}</strong>
              <span className="promo-discount">-{appliedPromo.discount}%</span>
            </div>
            <button
              className="promo-remove-btn"
              onClick={handleRemove}
              title="Retirer le code promo"
            >
              ×
            </button>
          </div>
          <p className="promo-description">{appliedPromo.description}</p>
        </div>
      )}
      {error && (
        <div className="promo-error">
          {error}
        </div>
      )}
    </div>
  )
}

export default PromoCode

