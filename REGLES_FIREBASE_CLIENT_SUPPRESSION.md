# Regles Firestore avec Suppression Client

## Regles a mettre dans Firebase

Les clients peuvent maintenant supprimer leurs propres commandes si le statut est "en attente".

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /orders/{orderId} {
      allow read: if request.auth != null && (
        isAdmin() ||
        resource.data.customerId == request.auth.uid ||
        resource.data.customerId == null
      );
      allow create: if true;
      allow update: if request.auth != null && isAdmin();
      allow delete: if request.auth != null && (
        isAdmin() ||
        (resource.data.customerId == request.auth.uid && resource.data.status == 'en attente')
      );
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

## Changement important

La ligne `allow delete` permet maintenant :
- Admin : peut supprimer toutes les commandes
- Client : peut supprimer seulement ses propres commandes ET seulement si le statut est "en attente"

## Instructions

1. Allez dans Firebase Console > Firestore Database > Regles
2. Remplacez toutes les regles par celles ci-dessus
3. Cliquez "Publier"
4. Rechargez l'application (F5)

