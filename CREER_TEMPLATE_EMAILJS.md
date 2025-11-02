# 📧 Créer votre Template Email - ÉTAPE PAR ÉTAPE

## 🎯 Vous êtes au bon endroit !

Vous êtes sur la page **"Modèles d'e-mails"** (Email Templates en français).

---

## ✅ ÉTAPE 1 : Créer le template

1. **Cliquez sur le bouton bleu** : **"Créer un nouveau modèle"** (en haut, avec le signe +)
2. Une nouvelle page s'ouvrira

---

## ✅ ÉTAPE 2 : Remplir les informations

### A. Informations de base

- **Template Name** (Nom du modèle) : `Nouvelle commande`
- **Subject** (Sujet) : **Collez ceci** :
```
🎉 Nouvelle commande #{{order_id}}
```

### B. Contenu de l'email

Dans le champ **Content** (ou "Contenu"), **collez exactement ceci** :

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

---

## ✅ ÉTAPE 3 : Configurer les variables

1. **Dans l'éditeur de template**, cherchez un onglet ou bouton **"Variables"** ou **"Settings"**
2. **Ajoutez ces variables** (cliquez sur "+" ou "Add Variable") :

```
to_email
order_id
customer_name
customer_phone
customer_email
total
items
status
delivery_type
payment_method
notes
date
message
```

**Important** : La variable `to_email` sera automatiquement remplie avec votre email admin défini dans `.env.local`

---

## ✅ ÉTAPE 4 : Sauvegarder

1. **Cliquez sur "Save"** ou **"Enregistrer"**
2. **Notez le Template ID** qui apparaît (ex: `template_xxxxxxx`)
   - Il est visible dans l'URL ou à côté du nom du template

---

## ✅ ÉTAPE 5 : Finaliser la configuration

Maintenant vous avez besoin de 3 informations :

1. ✅ **Service ID** : `service_aaqs9dk` (vous l'avez déjà)
2. ⏳ **Template ID** : Récupéré à l'étape 4
3. ⏳ **Public Key** : À récupérer dans "Account" → "General"

---

## 📝 Mettre à jour .env.local

Une fois que vous avez les 3 infos, ajoutez dans `.env.local` :

```env
VITE_EMAILJS_PUBLIC_KEY=votre_public_key
VITE_EMAILJS_SERVICE_ID=service_aaqs9dk
VITE_EMAILJS_TEMPLATE_ID=votre_template_id
VITE_ADMIN_EMAIL=votre-email@gmail.com
```

---

## 🎯 Si vous ne trouvez pas certaines options

**L'interface EmailJS peut varier légèrement.** Si vous ne voyez pas :
- Les variables → Cherchez "Settings" ou "⚙️" à côté du template
- Le Template ID → Il est souvent dans l'URL de la page ou affiché à côté du nom du template

**Dites-moi où vous bloquez et je vous aiderai !**

