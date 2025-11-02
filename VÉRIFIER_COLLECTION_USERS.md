# 🔍 Vérifier la Collection Users

## ❌ Problème détecté

Dans vos captures, je vois :
- ✅ Collection **"orders"** (présente)
- ❌ Collection **"users"** (MANQUANTE)

La collection `users` doit exister avec votre document admin dedans !

## ✅ Solution : Créer la collection `users`

### Méthode 1 : Créer directement le document

1. Dans **Firestore Database**, regardez la colonne de **GAUCHE** (liste des collections)
2. Cliquez sur **"Commencer une collection"** (en haut)
3. **ID de la collection** : `users` (sans majuscule)
4. Cliquez **"Suivant"**
5. **ID du document** : `SD6dcG0wmkdvfLQEBQYyIBRkOs53`
6. Cliquez **"Ajouter un champ"** :
   - Nom : `role`
   - Type : `string`
   - Valeur : `admin`
7. Cliquez **"Enregistrer"**

### Vérification

Après création, dans la colonne de GAUCHE, vous devriez voir :
- **orders** (collection existante)
- **users** (nouvelle collection) ← Elle doit apparaître ici !

## ✅ Après création

1. Rechargez l'application (F5)
2. Reconnectez-vous
3. Allez dans "Admin"
4. Vous devriez voir toutes les commandes !

---

**Vérifiez la colonne de gauche dans Firestore - voyez-vous la collection "users" ?**

