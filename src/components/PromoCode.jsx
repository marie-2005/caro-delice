import React, { useState } from 'react'
import { validatePromoCode } from '../services/promoService'
import './PromoCode.css'

function PromoCode({ onApplyPromo, appliedPromo, total }) {
  const [promoCode, setPromoCode] = useState('')
  const [error, setError] = useState('')
  const [applying, setApplying] = useState(false)

  const handleApply = async () => {
    if (!promoCode.trim()) {
      setError('Veuillez entrer un code promo')
      return
    }

    setApplying(true)
    setError('')

    const validation = validatePromoCode(promoCode.trim())
    
    if (!validation.valid) {
      setError(validation.error)
      setApplying(false)
      return
    }

    // Calculer la réduction
    const discount = Math.round(total * (validation.discount / 100))
    const discountedTotal = total - discount

    onApplyPromo({
      code: promoCode.toUpperCase().trim(),
      discount: validation.discount,
      discountAmount: discount,
      total: discountedTotal,
      description: validation.description
    })

    setPromoCode('')
    setApplying(false)
  }

  const handleRemove = () => {
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

