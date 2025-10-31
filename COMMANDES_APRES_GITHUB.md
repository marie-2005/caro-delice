# ✅ Commandes à exécuter APRÈS avoir créé le dépôt sur GitHub

## 📋 Étape 1 : Créer le dépôt sur GitHub

1. Allez sur [github.com/new](https://github.com/new)
2. Nom : `caro-delice`
3. Cochez "Public"
4. **NE COCHEZ RIEN D'AUTRE**
5. Cliquez "Create repository"

## 📋 Étape 2 : Dans PowerShell, exécutez ces commandes

```powershell
cd "C:\Users\HP\Desktop\TS-INFO3\CARO DELICE"
git remote add origin https://github.com/marie-2005/caro-delice.git
git push -u origin main
```

Si vous êtes connecté à GitHub, ça devrait fonctionner !

## 🔐 Si vous avez une erreur d'authentification

GitHub a supprimé les mots de passe. Vous devez utiliser un **Personal Access Token** :

1. Allez sur [github.com/settings/tokens](https://github.com/settings/tokens)
2. Cliquez "Generate new token" → "Generate new token (classic)"
3. Donnez un nom : "Carro Delice"
4. Cochez "repo" (toutes les permissions repo)
5. Cliquez "Generate token"
6. **COPIEZ LE TOKEN** (vous ne le verrez qu'une fois !)
7. Quand git demande le mot de passe, collez le token au lieu du mot de passe

---

**Une fois le code sur GitHub, suivez les instructions dans QUICK_START.md pour déployer sur Vercel !**

