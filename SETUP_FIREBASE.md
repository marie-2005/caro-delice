# 🔥 Configuration Firebase - Guide Complet

## 📋 Étapes pour configurer Firebase

### Étape 1 : Créer un projet Firebase

1. Allez sur [firebase.google.com](https://firebase.google.com)
2. Cliquez sur "Commencer" ou "Get Started"
3. Connectez-vous avec Google
4. Cliquez sur "Ajouter un projet"
5. Nom du projet : `caro-delice` (ou autre nom)
6. **Désactivez** Google Analytics (pas nécessaire pour commencer)
7. Cliquez "Créer le projet"

### Étape 2 : Activer Authentication

1. Dans le menu gauche, cliquez sur **"Authentication"**
2. Cliquez sur **"Get started"**
3. Cliquez sur l'onglet **"Sign-in method"**
4. Activez **"Email/Password"** :
   - Cliquez sur "Email/Password"
   - Activez le premier toggle
   - Cliquez "Enregistrer"

### Étape 3 : Activer Firestore Database

1. Dans le menu gauche, cliquez sur **"Firestore Database"**
2. Cliquez sur **"Créer une base de données"**
3. Choisissez **"Démarrer en mode test"** (gratuit pour commencer)
4. Choisissez une région (ex: `europe-west`)
5. Cliquez "Activer"

### Étape 4 : Obtenir les clés de configuration

1. Dans le menu gauche, cliquez sur l'icône **⚙️** (Settings) → **"Paramètres du projet"**
2. Descendez jusqu'à **"Vos applications"**
3. Cliquez sur l'icône **</>** (Web)
4. Donnez un nom à l'app (ex: "caro-delice-web")
5. **Copiez les valeurs de configuration** qui apparaissent

### Étape 5 : Ajouter les clés dans votre code

1. Ouvrez le fichier `src/config/firebase.js`
2. Remplacez les valeurs :
   ```javascript
   const firebaseConfig = {
     apiKey: "VOTRE_API_KEY",           // ← Remplacez
     authDomain: "VOTRE_AUTH_DOMAIN",   // ← Remplacez
     projectId: "VOTRE_PROJECT_ID",     // ← Remplacez
     storageBucket: "VOTRE_STORAGE_BUCKET", // ← Remplacez
     messagingSenderId: "VOTRE_MESSAGING_SENDER_ID", // ← Remplacez
     appId: "VOTRE_APP_ID"              // ← Remplacez
   }
   ```

### Étape 6 : Créer le compte Admin

1. Dans Firebase, allez dans **Authentication** → **Users**
2. Cliquez sur **"Add user"**
3. Email : `admin@carodelice.com` (ou votre email)
4. Mot de passe : Choisissez un mot de passe fort
5. **IMPORTANT** : Notez cet email et mot de passe, vous en aurez besoin !

6. Ensuite, dans **Firestore Database** → **Données**, créez une collection `users` :
   - Cliquez "Démarrer une collection"
   - ID de la collection : `users`
   - Document ID : utilisez l'UID de l'utilisateur admin (trouvable dans Authentication → Users)
   - Ajoutez un champ :
     - Nom du champ : `role`
     - Type : `string`
     - Valeur : `admin`
   - Cliquez "Enregistrer"

### Étape 7 : Configurer les règles de sécurité Firestore

1. Dans **Firestore Database** → **Règles**
2. Remplacez les règles par :

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

3. Cliquez "Publier"

---

## ✅ Vérification

Une fois configuré :
1. Installez les dépendances : `npm install`
2. Testez l'app : `npm run dev`
3. Connectez-vous avec votre compte admin

---

## 🔐 Comptes par défaut

- **Admin** : L'email que vous avez créé dans Firebase Authentication avec le rôle `admin`
- **Clients** : S'inscriront automatiquement lors de leur première commande

---

**Besoin d'aide ?** La documentation Firebase est très complète : https://firebase.google.com/docs

