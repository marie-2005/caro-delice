# 🔧 Créer l'Index Firestore (si nécessaire)

Si vous voyez une erreur dans la console du navigateur mentionnant un "index", suivez ces étapes :

## Méthode 1 : Lien automatique (le plus simple)

1. Quand l'erreur apparaît, elle contient un lien
2. Cliquez sur ce lien
3. Firebase ouvre automatiquement la page pour créer l'index
4. Cliquez "Créer l'index"
5. Attendez quelques minutes que l'index soit créé
6. Rechargez l'application

## Méthode 2 : Créer manuellement

1. Allez dans **Firestore Database** → **Index**
2. Cliquez "Créer un index"
3. Remplissez :
   - **Collection ID** : `orders`
   - **Champs à indexer** :
     - Champ 1 : `customerPhone` - Ordre : Ascending
     - Champ 2 : `customerId` - Ordre : Ascending  
     - Champ 3 : `createdAt` - Ordre : Descending
4. Cliquez "Créer"
5. Attendez que l'index soit prêt (peut prendre quelques minutes)

---

**Note** : L'index est nécessaire uniquement si vous avez des commandes sans compte (`customerId = null`) qui doivent être retrouvées par téléphone. Si toutes vos commandes ont un `customerId`, l'index n'est pas nécessaire.

