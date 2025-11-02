# 🔒 Règles Firestore Corrigées (avec accent)

## ✅ Problème

Les règles Firestore cherchent `role` mais votre champ s'appelle `rôle` (avec accent).

## ✅ Solution : Règles corrigées

Remplacez vos règles Firestore par ceci (la fonction `isAdmin()` cherche maintenant les deux versions) :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Fonction helper pour vérifier si l'utilisateur est admin
    function isAdmin() {
      return request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.rôle == 'admin');
    }
    
    // Les commandes
    match /orders/{orderId} {
      // Admin en PREMIER pour qu'il voie TOUT
      allow read: if request.auth != null && (
        isAdmin() ||
        resource.data.customerId == request.auth.uid ||
        resource.data.customerId == null
      );
      // Créer : tout le monde peut créer une commande
      allow create: if true;
      // Modifier/Supprimer : seulement admin
      allow update, delete: if request.auth != null && isAdmin();
    }
    
    // Les utilisateurs
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || isAdmin());
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📋 Étapes

1. Allez dans **Firebase Console** → **Firestore Database** → **Règles**
2. **Remplacez** toutes les règles par celles ci-dessus
3. Cliquez **"Publier"**
4. **Rechargez** l'application (F5)

## ✅ Après publication

Vous devriez voir :
- ✅ Plus d'erreur de permissions dans la console
- ✅ Badge "Admin" à côté de votre email
- ✅ Onglet "Admin" au lieu de "Mes Commandes"
- ✅ **TOUTES** les commandes visibles
- ✅ Contrôles (select + bouton ×) sur chaque commande

---

**Publiez ces règles et dites-moi si ça fonctionne !**

