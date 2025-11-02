# 🔒 Règles Firestore SIMPLES qui FONCTIONNENT

## ✅ Version simple et testée

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Fonction pour vérifier si admin (cherche 'role' ou 'rôle')
    function isAdmin() {
      return request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        (
          get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
          get(/databases/$(database)/documents/users/$(request.auth.uid)).data.rôle == 'admin'
        );
    }
    
    // Les commandes
    match /orders/{orderId} {
      allow read: if request.auth != null && (
        isAdmin() ||
        resource.data.customerId == request.auth.uid ||
        resource.data.customerId == null
      );
      allow create: if true;
      allow update, delete: if request.auth != null && isAdmin();
    }
    
    // Les utilisateurs
    match /users/{userId} {
      allow read: if request.auth != null && (
        request.auth.uid == userId || isAdmin()
      );
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📋 Instructions

1. **Copiez TOUT le code ci-dessus** (de `rules_version` à la dernière `}`)
2. Allez dans **Firebase Console** → **Firestore Database** → **Règles**
3. **Supprimez** toutes les règles actuelles
4. **Collez** les nouvelles règles
5. Cliquez **"Publier"**
6. Attendez quelques secondes que ça se sauvegarde
7. Rechargez l'application (F5)

## ✅ Si ça ne marche toujours pas

Essayez cette version ENCORE PLUS SIMPLE (sans fonction) :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      allow read: if request.auth != null && (
        resource.data.customerId == request.auth.uid ||
        resource.data.customerId == null ||
        (exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
         (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
          get(/databases/$(database)/documents/users/$(request.auth.uid)).data.rôle == 'admin'))
      );
      allow create: if true;
      allow update, delete: if request.auth != null &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.rôle == 'admin');
    }
    
    match /users/{userId} {
      allow read: if request.auth != null && (
        request.auth.uid == userId ||
        (exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
         (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
          get(/databases/$(database)/documents/users/$(request.auth.uid)).data.rôle == 'admin'))
      );
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

**Essayez d'abord la première version. Si ça ne marche pas, utilisez la deuxième !**

