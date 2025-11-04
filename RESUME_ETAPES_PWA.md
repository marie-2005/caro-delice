# 📝 Résumé des Étapes PWA - Pour Faire Seul

## 🎯 Les 7 Étapes Principales

### ✅ Étape 1 : Installer le Plugin
```bash
npm install vite-plugin-pwa --save-dev
```

---

### ✅ Étape 2 : Modifier vite.config.js

**Ajouter en haut :**
```javascript
import { VitePWA } from 'vite-plugin-pwa'
```

**Ajouter dans plugins :**
```javascript
plugins: [
  react(),
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'images/*.png', 'images/*.jpg'],
    manifest: {
      name: 'Votre App',
      short_name: 'App Court',
      description: 'Description',
      theme_color: '#8B4513',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait-primary',
      start_url: '/',
      icons: [ /* voir étape 4 */ ],
      categories: ['food', 'shopping']
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}']
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  })
]
```

---

### ✅ Étape 3 : Créer public/manifest.json

```json
{
  "name": "Votre App",
  "short_name": "App Court",
  "description": "Description",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#8B4513",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/images/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/images/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

### ✅ Étape 4 : Créer les Icônes

**Générateur automatique (2 minutes) :**
1. Aller sur https://www.pwabuilder.com/imageGenerator
2. Télécharger votre logo
3. Padding : `0.3`
4. Cliquer "Générer"
5. Télécharger le ZIP
6. Extraire le dossier `android/`
7. Copier toutes les icônes dans `public/images/`
8. Renommer pour avoir :
   - `icon-72x72.png`
   - `icon-96x96.png`
   - `icon-128x128.png`
   - `icon-144x144.png`
   - `icon-152x152.png`
   - `icon-192x192.png`
   - `icon-384x384.png`
   - `icon-512x512.png`

---

### ✅ Étape 5 : Modifier index.html

**Ajouter dans `<head>` :**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<meta name="theme-color" content="#8B4513" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="Votre App" />

<link rel="icon" type="image/png" href="/images/icon-96x96.png" />
<link rel="apple-touch-icon" href="/images/icon-192x192.png" />
<link rel="manifest" href="/manifest.json" />
```

---

### ✅ Étape 6 : Build
```bash
npm run build
```

---

### ✅ Étape 7 : Déployer et Tester
1. Déployer sur Vercel (ou autre avec HTTPS)
2. Tester sur mobile :
   - Android : Menu → "Ajouter à l'écran d'accueil"
   - iOS : Partager → "Sur l'écran d'accueil"

---

## 🎯 Checklist Rapide

- [ ] `npm install vite-plugin-pwa --save-dev`
- [ ] Configurer `vite.config.js`
- [ ] Créer `public/manifest.json`
- [ ] Générer les icônes (8 fichiers)
- [ ] Modifier `index.html`
- [ ] `npm run build`
- [ ] Déployer sur HTTPS
- [ ] Tester sur mobile

---

## 💡 Astuce

**Le plus important :** Les icônes et le manifest.json. Sans eux, ça ne fonctionne pas !

**Temps total :** ~15 minutes (surtout la génération des icônes)

---

**C'est tout ! Vous pouvez maintenant créer une PWA pour n'importe quel projet !** 🚀

