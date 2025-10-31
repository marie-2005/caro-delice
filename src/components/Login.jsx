import React, { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../config/firebase'
import './Login.css'

function Login({ onLogin, onClose, isAdmin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        // Inscription
        await createUserWithEmailAndPassword(auth, email, password)
        setError('')
        onLogin(email)
      } else {
        // Connexion - vérifier si c'est un admin
        await signInWithEmailAndPassword(auth, email, password)
        setError('')
        onLogin(email)
      }
    } catch (err) {
      setError(err.message.includes('user-not-found') 
        ? 'Email introuvable' 
        : err.message.includes('wrong-password')
        ? 'Mot de passe incorrect'
        : err.message.includes('email-already-in-use')
        ? 'Cet email est déjà utilisé'
        : 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{isSignUp ? 'Créer un compte' : 'Se connecter'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          
          <div className="toggle-auth">
            <span>{isSignUp ? 'Déjà un compte ?' : 'Pas de compte ?'}</span>
            <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Se connecter' : 'Créer un compte'}
            </button>
          </div>
          
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Chargement...' : isSignUp ? 'Créer le compte' : 'Se connecter'}
          </button>
        </form>
        
        <p className="guest-note">
          Vous pouvez aussi commander sans compte en utilisant votre nom et téléphone.
        </p>
      </div>
    </div>
  )
}

export default Login

