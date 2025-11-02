# 🔒 Règles Firestore Finales Corrigées

## ✅ Règles complètes et fonctionnelles

Remplacez vos règles Firestore par ceci pour corriger l'erreur de permissions :

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
        // Commande avec customerId correspondant (l'utilisateur connecté)
        resource.data.customerId == request.auth.uid ||
        // Commande sans compte (customerId null) - permet de retrouver les anciennes commandes
        resource.data.customerId == null ||
        // Admin voit tout
        isAdmin()
      );
      // Permettre la création même sans compte (avec téléphone)
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

## 🔍 Explication

Les règles permettent à un utilisateur connecté de lire :
1. ✅ Ses propres commandes (`customerId == request.auth.uid`)
2. ✅ Les commandes sans compte (`customerId == null`) - pour retrouver ses anciennes commandes
3. ✅ Toutes les commandes si admin (`isAdmin()`)

## ⚠️ Important : Créer le document admin

1. Allez dans **Firebase Console** → **Authentication** → **Users**
2. Trouvez votre compte admin et **copiez l'UID**
3. Allez dans **Firestore Database** → **Données**
4. Collection : `users`
5. Créez un document avec :
   - **Document ID** : votre UID (collez-le)
   - **Champ** : `role` (type: string, valeur: `admin`)

## ✅ Après mise à jour

1. Publiez les règles dans Firebase
2. Créez le document admin si nécessaire
3. Rechargez l'application (F5)
4. Les erreurs de permissions devraient disparaître

