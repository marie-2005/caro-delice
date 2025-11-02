import React, { useState, useEffect } from 'react'
import './Profile.css'
import { getUserProfile, updateUserProfile } from '../services/firebaseService'

function Profile({ user, onClose }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
    allergies: ''
  })
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    loadProfile()
  }, [user])

  const loadProfile = async () => {
    if (!user) return

    try {
      setLoading(true)
      const profile = await getUserProfile(user.uid)
      if (profile) {
        setFormData({
          name: profile.name || '',
          phone: profile.phone || '',
          address: profile.address || '',
          notes: profile.notes || '',
          allergies: profile.allergies || ''
        })
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error)
      setMessage({ type: 'error', text: 'Erreur lors du chargement du profil' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) return

    try {
      setSaving(true)
      setMessage({ type: '', text: '' })
      
      await updateUserProfile(user.uid, formData)
      
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' })
      
      // Masquer le message après 3 secondes
      setTimeout(() => {
        setMessage({ type: '', text: '' })
      }, 3000)
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du profil' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="profile-overlay" onClick={onClose}>
        <div className="profile" onClick={(e) => e.stopPropagation()}>
          <div className="profile-header">
            <h2>Mon Profil</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="profile-content">
            <p>Chargement...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <h2>Mon Profil</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-info-section">
            <h3>Informations importantes (non modifiables)</h3>
            <p className="info-text">
              Ces informations sont utilisées pour identifier vos commandes et ne peuvent pas être modifiées.
            </p>
            
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email || ''}
                disabled
                className="disabled-input"
              />
              <small className="field-note">Utilisé pour vous identifier et recevoir les notifications</small>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Téléphone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone || ''}
                disabled
                className="disabled-input"
              />
              <small className="field-note">Utilisé pour identifier vos commandes</small>
            </div>
          </div>

          <div className="profile-editable-section">
            <h3>Informations personnelles</h3>
            
            <div className="form-group">
              <label htmlFor="name">Nom complet</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Votre nom complet"
              />
              <small className="field-note">Utilisé pour personnaliser vos commandes</small>
            </div>

            <div className="form-group">
              <label htmlFor="address">Adresse (optionnel)</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Votre adresse pour la livraison"
                rows="3"
              />
              <small className="field-note">Sera utilisée si vous choisissez la livraison</small>
            </div>

            <div className="form-group">
              <label htmlFor="allergies">Allergies / Intolérances *</label>
              <textarea
                id="allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="Ex: Arachides, lactose, gluten, etc. (Laissez vide si aucune)"
                rows="3"
              />
              <small className="field-note">Ces informations seront rappelées lors de chaque commande pour votre sécurité</small>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes personnelles (optionnel)</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Préférences spéciales, goûts, etc."
                rows="3"
              />
              <small className="field-note">Informations générales pour personnaliser vos commandes</small>
            </div>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="profile-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="save-button" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile

