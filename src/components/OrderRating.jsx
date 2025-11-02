import React, { useState, useEffect } from 'react'
import { saveOrderRating, getOrderRating } from '../services/ratingService'
import './OrderRating.css'

function OrderRating({ orderId, onClose }) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [savedRating, setSavedRating] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Charger la note existante si elle existe
    const existing = getOrderRating(orderId)
    if (existing) {
      setSavedRating(existing)
      setRating(existing.rating)
      setComment(existing.comment || '')
    }
  }, [orderId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      alert('Veuillez donner une note de 1 à 5 étoiles')
      return
    }

    setSaving(true)
    try {
      const result = await saveOrderRating(orderId, rating, comment)
      if (result.success) {
        setSavedRating({ rating, comment, date: new Date().toISOString() })
        alert('Merci pour votre évaluation !')
        if (onClose) onClose()
      } else {
        alert('Erreur lors de l\'enregistrement de votre note')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'enregistrement de votre note')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rating-overlay" onClick={onClose}>
      <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rating-header">
          <h3>Notez notre service</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="rating-form">
          <div className="rating-stars">
            <p className="rating-label">Votre note :</p>
            <div className="stars-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  title={`${star} étoile${star > 1 ? 's' : ''}`}
                >
                  ⭐
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="rating-text">
                {rating === 1 && 'Très mauvais'}
                {rating === 2 && 'Mauvais'}
                {rating === 3 && 'Moyen'}
                {rating === 4 && 'Bien'}
                {rating === 5 && 'Excellent'}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="comment">Commentaire (optionnel)</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience..."
              rows="4"
            />
          </div>

          {savedRating && (
            <div className="saved-rating-info">
              <p>✅ Note enregistrée : {savedRating.rating}/5</p>
              {savedRating.comment && <p className="saved-comment">"{savedRating.comment}"</p>}
            </div>
          )}

          <div className="rating-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              {savedRating ? 'Fermer' : 'Annuler'}
            </button>
            {!savedRating && (
              <button type="submit" className="submit-btn" disabled={rating === 0 || saving}>
                {saving ? 'Enregistrement...' : 'Envoyer la note'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default OrderRating

