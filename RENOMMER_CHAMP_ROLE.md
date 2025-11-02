# 🔧 Renommer le champ rôle → role

## Problème
Le caractère accentué `rôle` cause des erreurs dans les règles Firestore.

## Solution : Renommer le champ

### Option 1 : Renommer dans Firestore (RECOMMANDÉ)

1. Allez dans **Firestore Database** → Collection `users`
2. Ouvrez le document `SD6dcG0wmkdvfLQEBQYyIBRkOs53`
3. Cliquez sur le champ `rôle` pour le modifier
4. Renommez-le en `role` (sans accent)
5. Gardez la valeur `admin`
6. Enregistrez

### Option 2 : Utiliser ces règles (vérifie les deux champs)

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

## Recommandation

**Renommez le champ `rôle` → `role` dans Firestore**, puis utilisez les règles ci-dessus (Option 2).

Cela évite les problèmes d'encodage et c'est la convention standard.

