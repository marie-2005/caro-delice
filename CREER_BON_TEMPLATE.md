# ⚠️ Ce template n'est pas le bon !

Le template "Contactez-nous" (`template_trm10sh`) est un template par défaut d'EmailJS pour les formulaires de contact.

**Vous devez créer un NOUVEAU template** spécifiquement pour les notifications de commandes.

---

## ✅ Créer le BON template

### 1. Cliquez sur "Créer un nouveau modèle" (bouton bleu avec +)

### 2. Remplissez avec ces informations :

**Template Name** : `Nouvelle commande` (PAS "Contactez-nous")

**Objet (Subject)** :
```
🎉 Nouvelle commande #{{order_id}}
```

**Contenu** :
1. Cliquez sur "Modifier le contenu"
2. Choisissez **"Éditeur de code"**
3. Collez ceci :

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

**Vers l'e-mail** (à droite) : `manouscampus2@gmail.com`

### 3. Sauvegardez et notez le NOUVEAU Template ID

---

## 📝 Mettre à jour .env.local

Une fois le nouveau template créé avec le bon contenu :

1. Notez le **nouveau Template ID** (ex: `template_xxxxxxx`)
2. Ouvrez `.env.local`
3. Remplacez `template_trm10sh` par votre **nouveau Template ID**

---

**Le template "Contactez-nous" ne fonctionnera pas pour les notifications de commandes !** ❌

