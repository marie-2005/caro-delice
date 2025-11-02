import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Forcer le rechargement des variables d'environnement
  envPrefix: 'VITE_',
})

