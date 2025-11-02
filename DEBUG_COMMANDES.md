# 🔍 Déboguer les Commandes qui Disparaissent

## Problème
Les commandes disparaissent quand vous vous déconnectez et reconnectez.

## Solutions à vérifier

### 1. Vérifier dans Firebase Console que les commandes existent

1. Allez dans **Firestore Database** → **Données**
2. Vérifiez que la collection `orders` existe
3. Vérifiez qu'il y a des documents dedans
4. Ouvrez une commande et vérifiez qu'elle a bien :
   - `customerId` (l'UID de l'utilisateur connecté)
   - `customerEmail` (l'email)
   - `createdAt` (la date)

### 2. Vérifier les règles de sécurité Firestore

1. Allez dans **Firestore Database** → **Règles**
2. Les règles doivent permettre la lecture des commandes avec votre `customerId`

### 3. Créer l'index composite si nécessaire

Si vous voyez une erreur dans la console du navigateur qui dit "index required" :

1. Allez dans **Firestore Database** → **Index**
2. Cliquez sur le lien dans l'erreur OU
3. Cliquez "Créer un index"
4. Collection : `orders`
5. Champs à indexer :
   - `customerEmail` (Ascending)
   - `customerId` (Ascending)
   - `createdAt` (Descending)
6. Cliquez "Créer"

### 4. Vérifier dans la console du navigateur

1. Ouvrez les outils de développement (F12)
2. Allez dans l'onglet "Console"
3. Cherchez des erreurs en rouge
4. Si vous voyez une erreur Firestore, copiez-la ici

---

## Pourquoi ça peut arriver ?

1. **Commande sans compte** : Si vous commandez sans vous connecter, la commande n'a pas de `customerId`. Quand vous vous connectez après, vous ne la voyez que si vous avez utilisé le même email.

2. **Email différent** : Si vous commandez avec un email, puis créez un compte avec un autre email, vous ne verrez pas l'ancienne commande.

3. **Index manquant** : Firestore nécessite parfois un index pour les requêtes complexes.

---

## Solution temporaire : Toujours demander l'email

Pour que les commandes soient toujours retrouvables, même sans compte, on peut rendre l'email obligatoire dans le formulaire de commande.

