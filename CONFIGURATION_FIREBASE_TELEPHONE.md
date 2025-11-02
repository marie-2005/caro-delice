# 📱 Configuration Firebase pour le système par Téléphone

## ✅ Ce qu'il faut configurer dans Firebase

### 1. 🔒 **Règles de sécurité Firestore** (OBLIGATOIRE)

Les règles actuelles sont presque bonnes, mais il faut les ajuster pour permettre la lecture des commandes sans compte par téléphone.

#### Étapes :

1. Allez dans **Firebase Console** → **Firestore Database** → **Règles**
2. Remplacez les règles par ceci :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Les commandes : clients voient leurs commandes, admin voit tout
    match /orders/{orderId} {
      allow read: if request.auth != null && (
        // Commande avec customerId correspondant
        resource.data.customerId == request.auth.uid ||
        // Commande sans compte (customerId null) - on permet la lecture
        // Le filtrage par téléphone se fait côté application
        resource.data.customerId == null ||
        // Admin voit tout
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
      // Permettre la création même sans compte (avec téléphone)
      allow create: if true;
      allow update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Les utilisateurs : lecture de son propre profil, admin voit tout
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Cliquez **"Publier"**

---

### 2. 📊 **Index composite Firestore** (SEULEMENT si nécessaire)

Cet index est nécessaire uniquement si vous avez des commandes sans compte (`customerId = null`) qui doivent être retrouvées par téléphone.

#### Quand créer l'index ?

- ✅ **OUI** : Si vous voyez une erreur dans la console du navigateur qui dit "index required" ou "failed-precondition"
- ❌ **NON** : Si tout fonctionne normalement sans erreur

#### Méthode 1 : Lien automatique (RECOMMANDÉ)

1. Si une erreur apparaît dans la console du navigateur avec un lien
2. Cliquez sur ce lien
3. Firebase ouvre automatiquement la page pour créer l'index
4. Cliquez **"Créer l'index"**
5. Attendez quelques minutes que l'index soit créé (statut "En cours" → "Activé")
6. Rechargez l'application

#### Méthode 2 : Créer manuellement

1. Allez dans **Firestore Database** → **Index**
2. Cliquez **"Créer un index"**
3. Remplissez :
   - **Collection ID** : `orders`
   - **Champs à indexer** :
     - Champ 1 : `customerPhone` - Ordre : **Ascending**
     - Champ 2 : `customerId` - Ordre : **Ascending**  
     - Champ 3 : `createdAt` - Ordre : **Descending**
4. Cliquez **"Créer"**
5. Attendez que l'index soit prêt (peut prendre 2-5 minutes)

---

## 📋 Checklist de vérification

- [ ] ✅ Règles Firestore mises à jour et publiées
- [ ] ✅ Index créé (si nécessaire, après avoir vu une erreur)
- [ ] ✅ Test : Passer une commande sans compte
- [ ] ✅ Test : Se connecter et vérifier que les anciennes commandes apparaissent

---

## 🔍 Comment vérifier que ça fonctionne ?

1. **Test sans compte** :
   - Passer une commande avec votre nom et téléphone (sans créer de compte)
   - Notez le numéro de téléphone utilisé

2. **Test avec compte** :
   - Créer un compte ou vous connecter
   - Passer une commande avec le même numéro de téléphone
   - Vérifier que vous voyez TOUTES vos commandes (même celles passées sans compte)

3. **Vérification dans Firebase** :
   - Allez dans **Firestore Database** → **Données** → Collection `orders`
   - Vérifiez que les commandes ont bien `customerPhone` et `customerId` (null pour les commandes sans compte)

---

## ⚠️ Notes importantes

- Les règles permettent maintenant de lire les commandes sans compte (`customerId = null`)
- Le filtrage par téléphone se fait dans le code de l'application (pas dans les règles Firestore)
- L'index n'est créé automatiquement que si nécessaire (quand vous voyez une erreur)

---

**Besoin d'aide ?** Si vous voyez une erreur, copiez-la et dites-moi !

