# 🚀 Mettre à Jour l'Application Déployée

## 📋 Étapes pour mettre à jour votre application

### 1. Vérifier les fichiers modifiés

```bash
git status
```

### 2. Ajouter tous les fichiers modifiés

```bash
git add .
```

### 3. Créer un commit avec les modifications

```bash
git commit -m "Mise à jour: Firebase, admin, règles de sécurité"
```

### 4. Pousser vers GitHub

```bash
git push
```

### 5. Vercel redéploie automatiquement !

Vercel détecte automatiquement le push sur GitHub et redéploie l'application en quelques minutes.

---

## ✅ Vérification

1. Attendez 2-3 minutes après le `git push`
2. Allez sur votre lien Vercel (ex: https://caro-delice.vercel.app)
3. L'application devrait être mise à jour avec toutes les nouvelles fonctionnalités

---

## 📝 Résumé des modifications à déployer

- ✅ Intégration Firebase (Authentification + Firestore)
- ✅ Système de rôles (admin/client)
- ✅ Gestion des commandes avec Firebase
- ✅ Admin peut voir toutes les commandes
- ✅ Admin peut changer les statuts
- ✅ Panier masqué pour admin
- ✅ Recherche par téléphone (désactivée pour éviter erreurs)
- ✅ Options de livraison (sur place / livraison)

---

**Une fois que vous avez fait `git push`, Vercel déploie automatiquement !**

