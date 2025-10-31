import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Configuration Firebase pour caro-delice
const firebaseConfig = {
  apiKey: "AIzaSyDi11inGD4t_mNyI1uVQvxQK0hFg75UY70",
  authDomain: "caro-delice.firebaseapp.com",
  projectId: "caro-delice",
  storageBucket: "caro-delice.firebasestorage.app",
  messagingSenderId: "1093483259443",
  appId: "1:1093483259443:web:b7cceaf6ddeae1ca876546"
}

// Initialiser Firebase
const app = initializeApp(firebaseConfig)

// Initialiser les services
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app

