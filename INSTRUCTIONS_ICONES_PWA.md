# 📱 Instructions pour les Icônes PWA

## ✅ Configuration Terminée !

Votre application est maintenant configurée comme PWA (Progressive Web App) et peut être installée sur mobile.

## 🎯 Ce qu'il vous reste à faire

**Vous devez créer 8 ICÔNES** dans le dossier `public/images/` :

1. ✅ `icon-72x72.png` (72x72 pixels)
2. ✅ `icon-96x96.png` (96x96 pixels)
3. ✅ `icon-128x128.png` (128x128 pixels)
4. ✅ `icon-144x144.png` (144x144 pixels)
5. ✅ `icon-152x152.png` (152x152 pixels)
6. ✅ `icon-192x192.png` (192x192 pixels)
7. ✅ `icon-384x384.png` (384x384 pixels)
8. ✅ `icon-512x512.png` (512x512 pixels)

## 🛠️ Comment Créer les Icônes

### Option 1 : Générateur Automatique (RECOMMANDÉ - 2 minutes)

1. Allez sur **https://www.pwabuilder.com/imageGenerator**
2. Téléchargez votre logo (`logo-carodelice.jpg`)
3. Cliquez sur **"Générer"**
4. Téléchargez le ZIP
5. **Extrayez le ZIP** - vous verrez des dossiers `android/`, `windows/`, `ios/`
6. **Ouvrez le dossier `android/`** et copiez TOUTES les icônes
7. **Collez-les dans `public/images/`** de votre projet
8. **Vérifiez les noms** - ils doivent être exactement `icon-72x72.png`, `icon-96x96.png`, etc.

**💡 Astuce :** Les icônes Android fonctionnent pour toutes les plateformes PWA !

**Voir `ORGANISER_ICONES_GENERATOR.md` pour plus de détails**

### Option 2 : Manuellement

1. Ouvrez votre logo (`logo-carodelice.jpg`) dans un éditeur d'images
2. Redimensionnez en **carré** (ratio 1:1)
3. Créez chaque version avec les tailles suivantes :
   - 72x72 pixels → `icon-72x72.png`
   - 96x96 pixels → `icon-96x96.png`
   - 128x128 pixels → `icon-128x128.png`
   - 144x144 pixels → `icon-144x144.png`
   - 152x152 pixels → `icon-152x152.png`
   - 192x192 pixels → `icon-192x192.png`
   - 384x384 pixels → `icon-384x384.png`
   - 512x512 pixels → `icon-512x512.png`
4. Placez tous les fichiers dans `public/images/`

## 🚀 Après Création des Icônes

1. **Build** : `npm run build`
2. **Déployer** sur Vercel
3. **Tester** sur mobile : ouvrir le site et cliquer "Ajouter à l'écran d'accueil"

## 📱 Installation sur Mobile

### Android (Chrome)
- Menu (⋮) → **"Ajouter à l'écran d'accueil"**

### iOS (Safari)
- Bouton Partager (□↑) → **"Sur l'écran d'accueil"**

---

**Une fois les 8 icônes créées, votre app sera prête à être installée !** 📲

**Astuce :** Utilisez le générateur automatique (Option 1) pour créer toutes les icônes en 2 minutes !

