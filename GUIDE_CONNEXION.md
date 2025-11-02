# 🔐 Guide du Système de Connexion - Les Délices de Caro

## 📋 Principe général

Votre application a **3 types d'utilisateurs** :

1. **Visiteur non connecté** (client sans compte)
2. **Client connecté** (avec compte)
3. **Admin** (vous)

---

## 1️⃣ VISITEUR NON CONNECTÉ (Client sans compte)

### ✅ Peut faire :
- ✅ **Voir le menu** des crêpes
- ✅ **Ajouter des articles** au panier
- ✅ **Commander** (avec nom + téléphone uniquement)
- ✅ Les commandes sont sauvegardées dans Firebase

### ❌ Ne peut PAS faire :
- ❌ **Voir ses commandes** passées (car pas de compte)
- ❌ Suivre le statut de ses commandes

### 📝 Comment ça marche :
1. Client ouvre l'application
2. Ajoute des crêpes au panier
3. Clique "Panier" → "Commander"
4. Remplit : Nom, Téléphone, Mode de paiement
5. Commande créée → **Mais le client ne peut plus la voir après !**

**💡 Pourquoi ?** Sans connexion, on ne peut pas lier la commande au client.

---

## 2️⃣ CLIENT CONNECTÉ (Avec compte)

### ✅ Peut faire :
- ✅ **Tout ce qu'un visiteur peut faire** (commander)
- ✅ **Voir ses commandes** passées
- ✅ **Suivre le statut** de ses commandes
- ✅ Voir uniquement SES commandes (pas celles des autres)

### 📝 Comment ça marche :
1. Client clique sur **"Connexion"** (en haut à droite)
2. Crée un compte : Email + Mot de passe
3. Se connecte
4. Commande normalement
5. Va dans **"Mes Commandes"** pour voir ses commandes

**💡 Avantage :** Toutes ses commandes sont liées à son compte et visibles.

---

## 3️⃣ ADMIN (Vous)

### ✅ Peut faire :
- ✅ **Voir TOUTES les commandes** de tous les clients
- ✅ **Changer le statut** des commandes (en attente → en préparation → prête → livrée)
- ✅ **Supprimer** des commandes
- ✅ Tout ce qu'un client peut faire

### 📝 Comment se connecter :
1. Cliquez sur le bouton **"🔐 Admin"** (en haut à droite)
2. Connectez-vous avec votre email admin + mot de passe
3. Vous voyez le badge **"Admin"** à côté de votre email
4. Le bouton "Mes Commandes" devient **"Admin"**
5. Vous voyez toutes les commandes dans la page Admin

---

## 🎯 Résumé des Scénarios

### Scénario 1 : Client commande sans compte
```
Client → Menu → Ajoute au panier → Commande (nom + tel) → ✅ Commande créée
MAIS → Client ne peut plus voir sa commande après (pas de compte)
```

### Scénario 2 : Client se connecte puis commande
```
Client → "Connexion" → Crée compte → Se connecte → Commande → 
"Mes Commandes" → ✅ Voit toutes ses commandes
```

### Scénario 3 : Admin se connecte
```
Admin → "🔐 Admin" → Se connecte → Voit toutes les commandes → 
Peut changer statuts → Gère les commandes
```

---

## ❓ Questions fréquentes

### **Q : Les clients sont-ils OBLIGÉS de se connecter pour commander ?**
**R : NON !** Ils peuvent commander sans compte. Mais ils ne pourront pas voir leurs commandes après.

### **Q : Pourquoi se connecter alors ?**
**R :** Pour pouvoir voir l'historique de ses commandes et suivre leur statut.

### **Q : L'admin peut-il commander ?**
**R :** Oui ! L'admin peut tout faire. Il peut même commander pour tester.

### **Q : Un client peut-il voir les commandes des autres ?**
**R : NON !** Grâce aux règles Firebase, chaque client voit uniquement SES commandes.

---

## 🔒 Sécurité

- Les règles Firestore garantissent que :
  - Les clients voient seulement leurs commandes
  - L'admin voit tout
  - Personne ne peut modifier les commandes des autres

---

## 💡 Recommandation

**Pour une meilleure expérience client :** Encouragez vos clients à créer un compte pour qu'ils puissent suivre leurs commandes !

Mais **laissez-leur le choix** : ils peuvent toujours commander sans compte.

