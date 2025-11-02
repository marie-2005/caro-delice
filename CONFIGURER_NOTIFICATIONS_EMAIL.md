# 📧 Configuration des Notifications Email

## ✅ Recevez un email à chaque nouvelle commande !

Ce système utilise **EmailJS** (gratuit jusqu'à 200 emails/mois) pour vous envoyer une notification par email à chaque nouvelle commande.

---

## 🔧 ÉTAPE 1 : Créer un compte EmailJS

1. **Allez sur** : https://www.emailjs.com
2. **Créez un compte gratuit** (200 emails/mois gratuits)
3. **Confirmez votre email**

---

## 📝 ÉTAPE 2 : Configurer EmailJS

### 2.1 Ajouter un service Email

1. Dans EmailJS, allez dans **"Email Services"**
2. Cliquez sur **"Add New Service"**
3. Choisissez votre service email :
   - **Gmail** (recommandé si vous avez Gmail)
   - **Outlook** (si vous avez Outlook)
   - **Yahoo** (si vous avez Yahoo)
   - Ou **Custom SMTP** (pour n'importe quel email)

4. **Suivez les instructions** pour connecter votre email
5. **Notez le Service ID** (ex: `service_xxxxxxx`)

### 2.2 Créer un modèle d'email

1. Allez dans **"Email Templates"**
2. Cliquez sur **"Create New Template"**
3. **Nom du template** : "Nouvelle commande"
4. **Sujet de l'email** :
```
🎉 Nouvelle commande #{{order_id}}
```

5. **Contenu de l'email** (corps) :

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

6. **Important** : Dans EmailJS, cliquez sur **"Settings"** du template et ajoutez les variables suivantes dans l'ordre :
   - `to_email` (votre email admin - sera rempli automatiquement)
   - `order_id`
   - `customer_name`
   - `customer_phone`
   - `customer_email`
   - `total`
   - `items`
   - `status`
   - `delivery_type`
   - `payment_method`
   - `notes`
   - `date`
   - `message`

7. **Variables disponibles** :
   - `{{order_id}}` - ID de la commande
   - `{{customer_name}}` - Nom du client
   - `{{customer_phone}}` - Téléphone
   - `{{customer_email}}` - Email
   - `{{total}}` - Montant total
   - `{{items}}` - Liste des articles
   - `{{status}}` - Statut de la commande
   - `{{delivery_type}}` - Type de livraison
   - `{{payment_method}}` - Mode de paiement
   - `{{notes}}` - Notes du client
   - `{{date}}` - Date de la commande

6. **Cliquez sur "Save"**
7. **Notez le Template ID** (ex: `template_xxxxxxx`)

### 2.3 Obtenir la Public Key

1. Allez dans **"Account"** → **"General"**
2. **Copiez votre Public Key** (ex: `xxxxxxxxxxxxxxx`)

---

## ⚙️ ÉTAPE 3 : Configurer dans votre application

1. **Installez EmailJS** dans votre projet :

```bash
npm install @emailjs/browser
```

2. **Créez ou modifiez** le fichier `.env.local` à la racine du projet :

```env
# EmailJS Configuration
VITE_EMAILJS_PUBLIC_KEY=votre_public_key_ici
VITE_EMAILJS_SERVICE_ID=votre_service_id_ici
VITE_EMAILJS_TEMPLATE_ID=votre_template_id_ici

# Email de l'admin (où recevoir les notifications)
VITE_ADMIN_EMAIL=votre-email@example.com
```

3. **Remplacez** :
   - `votre_public_key_ici` → Votre Public Key EmailJS
   - `votre_service_id_ici` → Votre Service ID
   - `votre_template_id_ici` → Votre Template ID
   - `votre-email@example.com` → Votre email où recevoir les notifications

---

## 🚀 ÉTAPE 4 : Redémarrer l'application

```bash
npm run dev
```

---

## ✅ ÉTAPE 5 : Tester

1. Passez une commande test dans l'application
2. Vérifiez votre boîte email
3. Vous devriez recevoir une notification ! 📧

---

## 🔔 Résultat

**À chaque nouvelle commande, vous recevrez automatiquement :**
- Un email avec les détails de la commande
- Le nom et téléphone du client
- La liste des articles
- Le montant total
- Le mode de paiement
- Les informations de livraison

---

## 📱 Alternative : Notifications SMS

Si vous préférez recevoir des **SMS** au lieu d'emails, on peut configurer :
- **Twilio** (payant mais très fiable)
- **Vonage** (anciennement Nexmo)
- **MessageBird**

**Dites-moi si vous voulez que je configure les SMS !**

---

## 🆘 Problèmes courants

### EmailJS non configuré
- Vérifiez que toutes les variables sont dans `.env.local`
- Redémarrez l'application après modification de `.env.local`

### Emails non reçus
- Vérifiez vos spams
- Vérifiez que le service email est bien connecté dans EmailJS
- Vérifiez les logs de la console du navigateur

### Limite gratuite dépassée
- EmailJS gratuit = 200 emails/mois
- Au-delà, abonnement à partir de $15/mois
- Ou passez à un service SMS payant

---

**Une fois configuré, vous recevrez une notification à chaque commande !** 🎉

