# 📝 Comment créer le dépôt GitHub

## Étapes à suivre :

1. **Allez sur GitHub.com**
   - Connectez-vous avec votre compte (marie-2005)

2. **Créer un nouveau dépôt**
   - Cliquez sur le bouton "+" en haut à droite
   - Sélectionnez "New repository"

3. **Remplir les informations**
   - **Repository name** : `caro-delice`
   - **Description** : (optionnel) "Application de commande de crêpes"
   - **Visibilité** : Cochez "Public" (gratuit) ou "Private"
   - **NE COCHEZ PAS** "Add a README file"
   - **NE COCHEZ PAS** "Add .gitignore"
   - **NE COCHEZ PAS** "Choose a license"
   
4. **Créer le dépôt**
   - Cliquez sur le bouton vert "Create repository"

5. **Une fois créé**, vous verrez des instructions. **IGNOREZ-LES**, nous allons utiliser les commandes suivantes :

---

## Après avoir créé le dépôt sur GitHub

Retournez dans PowerShell et exécutez :

```powershell
cd "C:\Users\HP\Desktop\TS-INFO3\CARO DELICE"
git remote remove origin
git remote add origin https://github.com/marie-2005/caro-delice.git
git push -u origin main
```

Voilà ! Votre code sera en ligne sur GitHub.

