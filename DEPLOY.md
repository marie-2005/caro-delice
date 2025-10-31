# 🚀 Guide de Déploiement - Les Délices de Caro

Ce guide vous explique comment mettre votre application en ligne pour que vos clients puissent y accéder depuis leurs téléphones.

## 📋 Prérequis

- Un compte GitHub (gratuit) : [github.com](https://github.com)
- Un compte Vercel (gratuit) : [vercel.com](https://vercel.com)

## 🎯 Option 1 : Déploiement avec Vercel (RECOMMANDÉ - Le plus simple)

### Étape 1 : Créer un compte GitHub

1. Allez sur [github.com](https://github.com)
2. Créez un compte gratuit
3. Créez un nouveau dépôt (repository) :
   - Cliquez sur "+" → "New repository"
   - Donnez un nom (ex: "caro-delice")
   - Cliquez sur "Create repository"

### Étape 2 : Envoyer votre code sur GitHub

Ouvrez PowerShell/Terminal dans le dossier de votre projet et exécutez :

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Faire un premier commit
git commit -m "Premier déploiement"

# Ajouter votre dépôt GitHub (remplacez USERNAME par votre nom d'utilisateur)
git remote add origin https://github.com/USERNAME/caro-delice.git

# Envoyer sur GitHub
git branch -M main
git push -u origin main
```

### Étape 3 : Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Sign Up" et connectez-vous avec GitHub
3. Cliquez sur "Add New Project"
4. Sélectionnez votre dépôt "caro-delice"
5. Vercel détecte automatiquement les paramètres
6. Cliquez sur "Deploy"

**C'est tout !** Vercel vous donnera une URL comme : `https://caro-delice.vercel.app`

## 🎯 Option 2 : Déploiement avec Netlify

1. Allez sur [netlify.com](https://netlify.com)
2. Créez un compte gratuit
3. Dans votre projet, lancez :
   ```bash
   npm run build
   ```
4. Sur Netlify :
   - Cliquez sur "Sites" → "Add new site" → "Deploy manually"
   - Glissez-déposez le dossier `dist` qui vient d'être créé

## 📱 Partager avec vos clients

Une fois déployé, vous obtiendrez une URL (ex: `https://caro-delice.vercel.app`)

**Partagez cette URL avec vos clients !** Ils peuvent :
- L'ouvrir dans leur navigateur mobile
- L'ajouter à l'écran d'accueil (comme une app)
- Commander directement depuis leur téléphone

## ⚠️ Important à savoir

### LocalStorage - Chaque client a ses propres données

- Les commandes sont stockées dans le navigateur de **chaque client**
- Vous ne verrez les commandes que sur **votre ordinateur**
- Chaque client verra seulement **ses propres commandes**

### Pour voir toutes les commandes de tous les clients

Il faudrait une **vraie base de données** avec un backend. Options :
- Firebase (gratuit jusqu'à un certain usage)
- Supabase (gratuit)
- MongoDB Atlas (gratuit)
- Votre propre serveur

## 🔧 Mettre à jour l'application

Après chaque modification de code :

```bash
git add .
git commit -m "Description de la modification"
git push
```

Vercel/Netlify mettront à jour automatiquement !

## 📝 Exemple d'URL finale

Votre application sera accessible à une adresse comme :
- `https://caro-delice.vercel.app`
- `https://les-delices-de-caro.netlify.app`

Vous pouvez même acheter un nom de domaine personnalisé (ex: `www.carodelice.com`) sur Vercel/Netlify.

---

**Besoin d'aide ?** Les services Vercel et Netlify ont d'excellents guides et support.

