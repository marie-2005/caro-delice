# 🔒 Règles Firestore Simplifiées pour l'Admin

## ✅ Règles qui MARCHENT pour voir TOUTES les commandes

Remplacez vos règles Firestore par ceci (version simplifiée et testée) :

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
    
    // Les commandes
    match /orders/{orderId} {
      // Lire : ses propres commandes OU toutes si admin OU commandes sans compte si connecté
      allow read: if request.auth != null && (
        resource.data.customerId == request.auth.uid ||
        isAdmin() ||
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

## ⚠️ IMPORTANT : Vérifier le document Admin

**Le document admin DOIT exister dans Firestore !**

1. Allez dans **Firebase Console** → **Authentication** → **Users**
2. Trouvez votre compte admin (celui avec lequel vous vous connectez)
3. **Copiez l'UID** (cliquez sur votre compte pour voir l'UID)
4. Allez dans **Firestore Database** → **Données** → Collection `users`
5. **Créez ou vérifiez** qu'il y a un document avec :
   - **Document ID** : votre UID (collez-le exactement)
   - **Champ** : `role` (type: string)
   - **Valeur** : `admin` (en minuscules)

## ✅ Étapes pour corriger

1. **Vérifiez/créez le document admin** (étape ci-dessus)
2. **Remplacez les règles** par celles ci-dessus
3. **Publiez les règles** (bouton "Publier")
4. **Rechargez l'application** (F5)
5. **Reconnectez-vous** en tant qu'admin
6. Allez dans "Admin" → Vous devriez voir **TOUTES** les commandes

## 🔍 Vérification

Si ça ne marche toujours pas :
1. Ouvrez la console du navigateur (F12)
2. Regardez s'il y a des erreurs
3. Vérifiez que votre UID correspond bien au document dans `users`
4. Vérifiez que le champ `role` est bien `admin` (pas `Admin` ou `ADMIN`)

