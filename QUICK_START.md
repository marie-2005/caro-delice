# ⚡ Démarrage Rapide - Mettre l'app en ligne

## 🎯 Solution la plus simple (5 minutes)

### Étape 1 : Créer un compte GitHub (si pas déjà fait)
👉 [github.com/signup](https://github.com/signup)

### Étape 2 : Créer un dépôt GitHub

1. Cliquez sur le "+" en haut à droite
2. "New repository"
3. Nom : `caro-delice`
4. Cochez "Public"
5. Cliquez "Create repository"

### Étape 3 : Envoyer votre code sur GitHub

Ouvrez PowerShell dans le dossier de votre projet :

```powershell
git init
git add .
git commit -m "Première version"
git branch -M main
git remote add origin https://github.com/VOTRE_NOM/caro-delice.git
git push -u origin main
```

(Remplacez `VOTRE_NOM` par votre nom d'utilisateur GitHub)

### Étape 4 : Déployer sur Vercel

1. Allez sur [vercel.com/signup](https://vercel.com/signup)
2. Connectez-vous avec GitHub
3. Cliquez "Add New Project"
4. Sélectionnez votre dépôt `caro-delice`
5. Cliquez "Deploy"

**🎉 C'est fait !** Vous obtiendrez une URL comme `https://caro-delice.vercel.app`

### Étape 5 : Partager avec vos clients

Envoyez l'URL à vos clients ! Ils peuvent :
- ✅ Ouvrir sur leur téléphone
- ✅ Commander directement
- ✅ L'ajouter à l'écran d'accueil (option "Ajouter à l'écran d'accueil")

## 📱 Tester sur votre téléphone

1. Ouvrez l'URL sur votre téléphone
2. Testez une commande
3. Les commandes seront visibles dans la page "Commandes" (sur votre ordinateur uniquement)

## ⚠️ Rappel important

Les commandes sont stockées dans le navigateur de chaque client. Pour voir toutes les commandes de tous les clients, il faudrait ajouter une base de données (Firebase, Supabase, etc.)

---

**Problème ?** Consultez [DEPLOY.md](./DEPLOY.md) pour plus de détails.

