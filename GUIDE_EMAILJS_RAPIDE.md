# 🚀 Guide Rapide EmailJS - Configuration en 3 minutes

## ✅ ÉTAPE 1 : Service Gmail (ce que vous voyez maintenant)

1. **Dans la fenêtre que vous voyez** :
   - Le **Service ID** est déjà prérempli : `service_aaqs9dk` ✅
   - **Nom** : "Gmail" (déjà bon)
   - ✅ Cochez "Envoyer un email de test pour vérifier la configuration"

2. **Cliquez sur "Connecter le compte"** (bouton bleu)
   - Une fenêtre Google s'ouvrira
   - **Connectez-vous avec votre compte Gmail** (celui où vous voulez recevoir les notifications)
   - **Autorisez** l'autorisation "Envoyer un email en votre nom"

3. **Cliquez sur "Créer un service"** (en bas à droite)
   - Votre service Gmail sera créé !
   - **Notez le Service ID** : `service_aaqs9dk` (vous l'avez déjà)

---

## ✅ ÉTAPE 2 : Créer le Template d'Email

1. **Allez dans "Email Templates"** (dans le menu EmailJS)
2. **Cliquez sur "Create New Template"**

3. **Remplissez** :
   - **Template Name** : "Nouvelle commande"
   
   - **Subject** (Sujet) :
   ```
   🎉 Nouvelle commande #{{order_id}}
   ```
   
   - **Content** (Corps de l'email) - **Copiez-collez ceci** :
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

4. **Cliquez sur "Save"**
5. **Notez le Template ID** (ex: `template_xxxxxxx`)

---

## ✅ ÉTAPE 3 : Récupérer votre Public Key

1. **Allez dans "Account"** → **"General"** (en haut à droite)
2. **Trouvez "Public Key"**
3. **Copiez-la** (ex: `xxxxxxxxxxxxxxx`)

---

## ✅ ÉTAPE 4 : Configurer dans votre application

1. **Créez le fichier `.env.local`** à la racine du projet (si pas déjà créé)

2. **Ajoutez ces lignes** :
```env
# EmailJS Configuration
VITE_EMAILJS_PUBLIC_KEY=votre_public_key_ici
VITE_EMAILJS_SERVICE_ID=service_aaqs9dk
VITE_EMAILJS_TEMPLATE_ID=votre_template_id_ici

# Votre email où recevoir les notifications
VITE_ADMIN_EMAIL=votre-email@gmail.com
```

3. **Remplacez** :
   - `votre_public_key_ici` → Votre Public Key (étape 3)
   - `votre_template_id_ici` → Votre Template ID (étape 2)
   - `votre-email@gmail.com` → Votre adresse Gmail

---

## ✅ ÉTAPE 5 : Redémarrer et tester

1. **Redémarrez l'application** :
```bash
npm run dev
```

2. **Passez une commande test** dans l'application

3. **Vérifiez votre boîte Gmail** 📧

---

## 🎯 Résumé des IDs à noter

- ✅ **Service ID** : `service_aaqs9dk` (vous l'avez déjà)
- ⏳ **Template ID** : À récupérer après création du template
- ⏳ **Public Key** : À récupérer dans Account → General

---

## ✅ C'est tout !

Une fois ces étapes terminées, vous recevrez automatiquement un email à chaque nouvelle commande ! 🎉

**Besoin d'aide ?** Consultez `CONFIGURER_NOTIFICATIONS_EMAIL.md` pour plus de détails.

