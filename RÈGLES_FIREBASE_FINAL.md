# Regles Firestore FINALES - SANS ERREUR

## Version simple qui fonctionne

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAdmin() {
      return request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.rôle == 'admin');
    }
    
    match /orders/{orderId} {
      allow read: if request.auth != null && (
        isAdmin() ||
        resource.data.customerId == request.auth.uid ||
        resource.data.customerId == null
      );
      allow create: if true;
      allow update, delete: if request.auth != null && isAdmin();
    }
    
    match /users/{userId} {
      allow read: if request.auth != null && (
        request.auth.uid == userId || isAdmin()
      );
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Instructions

1. Copiez TOUT le code ci-dessus
2. Firebase Console > Firestore Database > Regles
3. Supprimez toutes les regles actuelles
4. Collez les nouvelles regles
5. Cliquez "Publier"
6. Rechargez l'application (F5)

