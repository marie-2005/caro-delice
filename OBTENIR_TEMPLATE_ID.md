# 🔍 Comment obtenir votre Template ID EmailJS

## ⚠️ IMPORTANT : Vous DEVEZ créer le template d'abord !

Le Template ID n'existe pas encore car vous n'avez pas créé le template d'email.

---

## ✅ ÉTAPE 1 : Créer le Template (si pas encore fait)

1. **Allez dans EmailJS** → **"Modèles d'e-mails"** (Email Templates)
2. **Cliquez sur "Créer un nouveau modèle"** (bouton bleu avec +)
3. **Remplissez** :
   - **Template Name** : `Nouvelle commande`
   - **Objet (Subject)** : `🎉 Nouvelle commande #{{order_id}}`
   - **Contenu** : Cliquez sur "Modifier le contenu" → Choisissez "Éditeur de code" → Collez ceci :

```
Bonjour,

Vous avez reçu une nouvelle commande !

📦 Commande #{{order_id}}
👤 Client: {{customer_name}}
📞 Téléphone: {{customer_phone}}
📧 Email: {{customer_email}}

💰 Total: {{total}} FCFA
📋 Statut: {{status}}

🛒 Articles:
{{items}}

📍 {{delivery_type}}
💳 Paiement: {{payment_method}}

Notes: {{notes}}

🕐 Date: {{date}}

---
Les Délices de Caro
```

4. **Dans "Vers l'e-mail"** (à droite) : Mettez `manouscampus2@gmail.com`
5. **Cliquez sur "Save"** ou "Enregistrer"

---

## ✅ ÉTAPE 2 : Trouver le Template ID

Après avoir créé et sauvegardé le template :

1. **Retournez dans "Modèles d'e-mails"**
2. **Cliquez sur votre template** "Nouvelle commande"
3. **Le Template ID est visible** :
   - **Dans l'URL** : `https://dashboard.emailjs.com/admin/template/XXXXX/template_xxxxxxx`
     → Le `template_xxxxxxx` est votre Template ID
   - **OU à côté du nom** du template dans la liste

---

## ✅ ÉTAPE 3 : Mettre à jour .env.local

Une fois que vous avez le Template ID :

1. **Ouvrez le fichier `.env.local`** (à la racine du projet)
2. **Remplacez** `TEMPLATE_ID_A_REMPLACER` par votre vrai Template ID
3. **Exemple** :
```env
VITE_EMAILJS_TEMPLATE_ID=template_abc123xyz
```

---

## 🎯 Résumé

1. ✅ Créez le template dans EmailJS
2. ✅ Récupérez le Template ID (dans l'URL ou à côté du nom)
3. ✅ Mettez-le dans `.env.local`
4. ✅ Redémarrez l'application
5. ✅ Testez !

**Sans Template ID, les notifications ne fonctionneront pas !** ⚠️

