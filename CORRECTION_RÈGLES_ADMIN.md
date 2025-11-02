# 🔧 Correction des Règles Firestore pour l'Admin

## 🔴 Le problème

Les règles actuelles vérifient le rôle admin avec :
```javascript
get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
```

Cela peut échouer si :
- Le document utilisateur n'existe pas dans `users`
- Il y a une erreur lors de la lecture du document

## ✅ Solution : Règles corrigées

Remplacez vos règles Firestore par ceci :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Fonction helper pour vérifier si l'utilisateur est admin
    function isAdmin() {
      return request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Les commandes : clients voient leurs commandes, admin voit tout
    match /orders/{orderId} {
      allow read: if request.auth != null && (
        // Commande avec customerId correspondant
        resource.data.customerId == request.auth.uid ||
        // Commande sans compte (customerId null)
        resource.data.customerId == null ||
        // Admin voit tout (vérification sécurisée)
        isAdmin()
      );
      allow create: if true;
      allow update, delete: if request.auth != null && isAdmin();
    }
    
    // Les utilisateurs : lecture de son propre profil, admin voit tout
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || isAdmin());
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🔍 Points importants

1. **Fonction `isAdmin()`** : Vérifie d'abord que le document existe avant de lire le rôle
2. **`exists()`** : S'assure que le document utilisateur existe avant d'essayer de lire son rôle
3. **Admin voit tout** : Si `isAdmin()` retourne `true`, l'admin peut lire toutes les commandes

## 📋 Vérifications à faire

1. **Vérifier que le document utilisateur existe** :
   - Allez dans Firebase → Firestore Database → Données
   - Collection : `users`
   - Vérifiez qu'il y a un document avec votre UID (trouvable dans Authentication → Users)
   - Le champ `role` doit être `admin`

2. **Si le document n'existe pas** :
   - Créez-le manuellement dans Firestore
   - Document ID : votre UID (ex: copiez depuis Authentication)
   - Champ `role` : `admin` (string)

## ✅ Après mise à jour

1. Publiez les nouvelles règles
2. Rechargez l'application (F5)
3. Connectez-vous en tant qu'admin
4. Allez dans "Admin" → Vous devriez voir TOUTES les commandes

