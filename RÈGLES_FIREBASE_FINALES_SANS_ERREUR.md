# 🔒 Règles Firestore Finales (SANS ERREUR)

## ✅ Version corrigée (syntaxe correcte)

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
    
    match /orders/{orderId} {
      // Admin en PREMIER pour qu'il voie TOUT
      allow read: if request.auth != null && (
        isAdmin() ||
        resource.data.customerId == request.auth.uid ||
        resource.data.customerId == null
      );
      allow create: if true;
      allow update, delete: if request.auth != null && isAdmin();
    }
    
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || isAdmin());
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## ⚠️ Correction apportée

J'ai enlevé `let userDoc =` car Firestore ne supporte pas `let` dans les fonctions de règles.

Maintenant la fonction `isAdmin()` appelle directement `get()` deux fois (une pour chaque champ possible).

## 📋 Étapes

1. **Copiez TOUTES les règles ci-dessus** (du début à la fin)
2. Allez dans **Firebase Console** → **Firestore Database** → **Règles**
3. **Remplacez** toutes les règles par celles ci-dessus
4. Cliquez **"Publier"**
5. **Rechargez** l'application (F5)

## ✅ Test

Après publication, vous devriez :
- ✅ Plus d'erreur de syntaxe
- ✅ Plus d'erreur de permissions dans la console
- ✅ Toutes les commandes visibles
- ✅ Contrôles admin fonctionnels

---

**Copiez-collez exactement ces règles et publiez-les !**

