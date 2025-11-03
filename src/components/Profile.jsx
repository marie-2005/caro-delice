import React, { useState, useEffect } from 'react'
import './Profile.css'
import { getUserProfile, updateUserProfile } from '../services/firebaseService'
import { getLoyaltyProfile, getPointsHistory, getBadgeInfo } from '../services/loyaltyService'

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
  const [loyaltyProfile, setLoyaltyProfile] = useState({
    totalPoints: 0,
    availablePoints: 0,
    usedPoints: 0,
    totalOrders: 0,
    badge: 'bronze'
  })
  const [pointsHistory, setPointsHistory] = useState([])
  const [showLoyalty, setShowLoyalty] = useState(false)

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

      // Charger le profil de fidélité (toujours afficher, même si erreur)
      try {
        const loyalty = await getLoyaltyProfile(user.uid)
        setLoyaltyProfile(loyalty)
        const history = await getPointsHistory(user.uid, 10)
        setPointsHistory(history)
      } catch (loyaltyError) {
        console.error('Erreur chargement fidélité:', loyaltyError)
        // Créer un profil par défaut si erreur de permissions ou profil inexistant
        setLoyaltyProfile({
          userId: user.uid,
          totalPoints: 0,
          availablePoints: 0,
          usedPoints: 0,
          totalOrders: 0,
          badge: 'bronze'
        })
        setPointsHistory([])
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

        {/* Section Points Fidélité - TOUJOURS VISIBLE */}
        <div style={{ 
          padding: '1.5rem', 
          margin: '1rem 1.5rem 2rem 1.5rem',
          backgroundColor: '#fef3c7', 
          border: '3px solid #f59e0b', 
          borderRadius: '0.75rem',
          minHeight: '100px'
        }}>
          <div 
            onClick={() => setShowLoyalty(!showLoyalty)} 
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              width: '100%',
              minHeight: '60px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
              <span style={{ fontSize: '2.5rem', display: 'inline-block' }}>🎁</span>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, color: '#92400e', fontSize: '1.5rem', fontWeight: '700', lineHeight: '1.2' }}>
                  Points Fidélité
                </h3>
                <p style={{ margin: '0.5rem 0 0 0', color: '#78350f', fontSize: '1.125rem', fontWeight: '600' }}>
                  {loyaltyProfile ? (loyaltyProfile.availablePoints || 0) : 0} points disponibles
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                padding: '0.5rem 1rem', 
                borderRadius: '0.5rem',
                backgroundColor: '#cd7f32',
                color: 'white',
                fontWeight: '700',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap'
              }}>
                <span style={{ fontSize: '1.25rem', display: 'inline-block' }}>🥉</span>
                <span style={{ textTransform: 'uppercase' }}>BRONZE</span>
              </div>
              <button 
                type="button" 
                onClick={(e) => {
                  e.stopPropagation()
                  setShowLoyalty(!showLoyalty)
                }}
                style={{ 
                  fontSize: '1.5rem', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem',
                  color: '#92400e'
                }}
              >
                {showLoyalty ? '▼' : '▶'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Contenu déplié - EN DEHORS du conteneur jaune */}
        {showLoyalty && (
          <div style={{ 
            padding: '1rem', 
            margin: '0 1.5rem 2rem 1.5rem',
            backgroundColor: 'white', 
            borderRadius: '0.5rem', 
            border: '1px solid #d1d5db'
          }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '1.25rem', 
                marginBottom: '2rem'
              }}>
                {/* Points disponibles */}
                <div className="loyalty-stat-card" style={{ 
                  padding: '1.5rem', 
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  borderRadius: '1rem', 
                  border: '2px solid #fbbf24',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    marginBottom: '1rem' 
                  }}>
                    <span style={{ fontSize: '2rem' }}>💎</span>
                    <div style={{ fontSize: '0.875rem', color: '#92400e', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Points disponibles
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: '800', 
                    color: '#b45309',
                    lineHeight: '1',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}>
                    {loyaltyProfile?.availablePoints || 0}
                  </div>
                </div>

                {/* Total gagné */}
                <div className="loyalty-stat-card" style={{ 
                  padding: '1.5rem', 
                  background: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)',
                  borderRadius: '1rem', 
                  border: '2px solid #a78bfa',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    marginBottom: '1rem' 
                  }}>
                    <span style={{ fontSize: '2rem' }}>⭐</span>
                    <div style={{ fontSize: '0.875rem', color: '#5b21b6', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Total gagné
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: '800', 
                    color: '#4c1d95',
                    lineHeight: '1',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}>
                    {loyaltyProfile?.totalPoints || 0}
                  </div>
                </div>

                {/* Points utilisés */}
                <div className="loyalty-stat-card" style={{ 
                  padding: '1.5rem', 
                  background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
                  borderRadius: '1rem', 
                  border: '2px solid #f472b6',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    marginBottom: '1rem' 
                  }}>
                    <span style={{ fontSize: '2rem' }}>🎯</span>
                    <div style={{ fontSize: '0.875rem', color: '#9f1239', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Points utilisés
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: '800', 
                    color: '#831843',
                    lineHeight: '1',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}>
                    {loyaltyProfile?.usedPoints || 0}
                  </div>
                </div>

                {/* Commandes */}
                <div className="loyalty-stat-card" style={{ 
                  padding: '1.5rem', 
                  background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                  borderRadius: '1rem', 
                  border: '2px solid #60a5fa',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    marginBottom: '1rem' 
                  }}>
                    <span style={{ fontSize: '2rem' }}>🛒</span>
                    <div style={{ fontSize: '0.875rem', color: '#1e40af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Commandes
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: '800', 
                    color: '#1e3a8a',
                    lineHeight: '1',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}>
                    {loyaltyProfile?.totalOrders || 0}
                  </div>
                </div>
              </div>
              
              <div style={{ 
                padding: '1.5rem', 
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)',
                border: '2px solid #f59e0b',
                borderRadius: '1rem', 
                marginBottom: '2rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>💡</span>
                  <p style={{ margin: 0, fontWeight: '800', color: '#92400e', fontSize: '1.125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Comment ça marche ?
                  </p>
                </div>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: '1.75rem', 
                  color: '#78350f', 
                  fontSize: '1rem',
                  lineHeight: '1.75'
                }}>
                  <li style={{ marginBottom: '0.75rem', fontWeight: '500' }}>
                    <strong style={{ color: '#92400e', fontWeight: '700' }}>1 point</strong> pour chaque <strong style={{ color: '#92400e', fontWeight: '700' }}>50 FCFA</strong> dépensés
                  </li>
                  <li style={{ marginBottom: '0.75rem', fontWeight: '500' }}>
                    <strong style={{ color: '#92400e', fontWeight: '700' }}>100 points = 10% de réduction</strong> sur votre commande
                  </li>
                  <li style={{ fontWeight: '500' }}>
                    Utilisez vos points lors de votre prochaine commande
                  </li>
                </ul>
              </div>

              {pointsHistory.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h4 style={{ 
                    margin: '0 0 1.5rem 0', 
                    fontSize: '1.125rem', 
                    fontWeight: '700', 
                    color: '#1f2937',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>📊</span>
                    Historique récent
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {pointsHistory.map((entry) => (
                      <div key={entry.id} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem', 
                        padding: '1.25rem', 
                        background: entry.type === 'earned' 
                          ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
                          : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                        borderRadius: '0.75rem', 
                        border: `2px solid ${entry.type === 'earned' ? '#10b981' : '#ef4444'}`,
                        boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                      }}>
                        <div style={{
                          width: '3rem',
                          height: '3rem',
                          borderRadius: '50%',
                          background: entry.type === 'earned' 
                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                        }}>
                          {entry.type === 'earned' ? '➕' : '➖'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontWeight: '700', 
                            color: entry.type === 'earned' ? '#065f46' : '#991b1b', 
                            fontSize: '1rem', 
                            marginBottom: '0.25rem' 
                          }}>
                            {entry.type === 'earned' 
                              ? `+${entry.points} points gagnés`
                              : `-${entry.points} points utilisés`}
                          </div>
                          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            {new Date(entry.date || entry.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                        {entry.orderAmount && (
                          <div style={{ 
                            padding: '0.5rem 1rem',
                            background: 'white',
                            borderRadius: '0.5rem',
                            color: '#1f2937', 
                            fontSize: '0.9375rem', 
                            fontWeight: '700',
                            border: '1px solid #e5e7eb'
                          }}>
                            {entry.orderAmount.toLocaleString()} FCFA
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
        
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

