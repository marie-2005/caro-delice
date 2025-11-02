# 🔧 Créer le Document Admin - Guide Pas à Pas

## ✅ Votre UID

Votre UID est : `SD6dcG0wmkdvfLQEBQYyIBRkOs53`

## 📋 Étapes pour créer le document admin

### 1. Allez dans Firestore Database

1. Ouvrez **Firebase Console**
2. Cliquez sur **Firestore Database** dans le menu gauche

### 2. Vérifiez si la collection `users` existe

1. Regardez la colonne de gauche
2. Si vous voyez **"users"** dans la liste → passez à l'étape 3
3. Si vous ne voyez **PAS** "users" → créez-la d'abord (voir étape 2bis)

### 2bis. Créer la collection `users` (si elle n'existe pas)

1. Cliquez sur **"Commencer une collection"** (en haut à gauche)
2. **ID de la collection** : `users`
3. Cliquez **"Suivant"**
4. Continuez à l'étape 3

### 3. Créer le document admin

1. Cliquez sur la collection **"users"** (dans la colonne de gauche)
2. Cliquez sur **"Ajouter un document"** (en haut de la colonne du milieu)
3. **ID du document** : Collez votre UID exactement
   ```
   SD6dcG0wmkdvfLQEBQYyIBRkOs53
   ```
   ⚠️ **IMPORTANT** : Copiez-collez exactement, pas d'espace avant ou après !

4. Cliquez **"Ajouter un champ"** :
   - **Nom du champ** : `role`
   - **Type** : `string` (chaîne)
   - **Valeur** : `admin`
   ⚠️ **IMPORTANT** : `admin` en minuscules, pas `Admin` ni `ADMIN` !

5. Cliquez **"Enregistrer"**

### 4. Vérification

Votre document devrait ressembler à ça :
```
Collection: users
Document ID: SD6dcG0wmkdvfLQEBQYyIBRkOs53
Champ: role = admin
```

## ✅ Après création

1. Rechargez votre application (F5)
2. Reconnectez-vous en tant qu'admin
3. Allez dans **"Admin"** (onglet en haut)
4. Vous devriez maintenant voir **TOUTES** les commandes !

---

## 🆘 Si ça ne marche toujours pas

Vérifiez :
1. Le document ID est **exactement** `SD6dcG0wmkdvfLQEBQYyIBRkOs53` (pas d'espaces)
2. Le champ `role` a la valeur **exactement** `admin` (en minuscules)
3. Vous êtes bien connecté avec le compte `manouscampus2@gmail.com`
4. Les règles Firestore ont été publiées avec `isAdmin()` en premier

---

**Dites-moi une fois que c'est fait !**

