# ✅ Créer le BON Index Firestore

## 📋 L'index qu'il faut créer

Votre code utilise cette requête :
- `customerPhone` (égalité)
- `customerId` (égalité) 
- `createdAt` (tri décroissant)

**L'index doit être :**

### Configuration de l'index :

1. Allez dans **Firestore Database** → **Index** → **"Créer un index"**

2. Remplissez exactement comme ça :
   - **Collection ID** : `orders`
   
   - **Champ 1** :
     - Nom du champ : `customerPhone`
     - Mode de tri : **Croissant** (Ascending)
   
   - **Champ 2** :
     - Nom du champ : `customerId`
     - Mode de tri : **Croissant** (Ascending)
   
   - **Champ 3** :
     - Nom du champ : `createdAt`
     - Mode de tri : **Décroissant** (Descending)

3. Cliquez **"Créer"**

4. Attendez 2-5 minutes que l'index soit **"Activé"**

---

## ⚠️ Important

L'index que vous voyez actuellement (avec `customerld` et `_name_`) n'est **PAS** le bon.

Il faut créer un **NOUVEL** index avec `customerPhone`, `customerId`, et `createdAt`.

---

## ✅ Après création

1. Vérifiez que le nouvel index est **"Activé"**
2. Rechargez votre application (F5)
3. L'erreur devrait disparaître

---

**Note** : Vous pouvez avoir plusieurs index dans Firestore, ce n'est pas un problème. Chaque requête utilise son propre index.

