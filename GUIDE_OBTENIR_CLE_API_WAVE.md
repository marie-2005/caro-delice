# 🔑 Guide pour Obtenir vos Clés API Wave

## ✅ Vous êtes sur le bon site !

Vous êtes sur : **https://developer.waveapps.com** ✅

---

## 📝 ÉTAPES DÉTAILLÉES

### Étape 1 : Se connecter ou s'inscrire

1. Cliquez sur **"S'enregistrer"** (si nouveau compte)
   - OU **"Connexion"** si vous avez déjà un compte Wave Business

2. Utilisez les **identifiants de votre compte Wave Business**

---

### Étape 2 : Naviguer vers les Applications/API

Une fois connecté, cherchez :

1. **Menu latéral** ou **onglet** nommé :
   - "Applications"
   - "API"  
   - "Intégrations"
   - "Developer Tools"

2. Cliquez dessus pour accéder à la section

---

### Étape 3 : Créer une nouvelle application

1. Cherchez un bouton :
   - **"Nouvelle application"**
   - **"Create Application"**
   - **"Add Application"**
   - **"Créer"**

2. Cliquez pour créer une nouvelle application

3. Remplissez le formulaire :
   - **Nom** : "Caro Delice App" (ou ce que vous voulez)
   - **Description** : "Application de commande en ligne"
   - **Type** : "Web Application" ou "Public API"

---

### Étape 4 : Récupérer vos clés

Après création, vous devriez voir :

1. **API Key** (ou "Bearer Token", "Access Token")
   - Copiez cette clé ✅

2. **Business ID** (ou "Merchant ID", "Account ID")
   - Copiez cet ID ✅

3. **Client Secret** (si disponible)
   - Certaines API n'utilisent que l'API Key

---

### Étape 5 : Vérifier les permissions

Assurez-vous que votre application a les permissions :
- ✅ **Checkout/Paiements**
- ✅ **Créer des sessions de paiement**
- ✅ **Vérifier le statut des paiements**

---

## 🆘 Si vous ne trouvez pas

### Option 1 : Chercher dans la Documentation

1. Cliquez sur **"Documentation"** dans le menu
2. Cherchez :
   - "Getting Started"
   - "Authentication"
   - "API Keys"
   - "Quick Start"

### Option 2 : Contacter le support

1. Cliquez sur **"Signaler un problème"**
2. Ou contactez : support@wave.sn (Sénégal) / support@wave.ci (Côte d'Ivoire)
3. Demandez : "Comment obtenir mes clés API pour intégrer Wave dans mon site web ?"

---

## 💾 Une fois que vous avez vos clés

1. **Créez le fichier `.env.local`** dans la racine du projet
2. **Ajoutez-y** :
   ```
   VITE_WAVE_API_KEY=votre_cle_api_ici
   VITE_WAVE_BUSINESS_ID=votre_business_id_ici
   VITE_WAVE_API_URL=https://api.waveapps.com/v1
   ```
3. **Redémarrez** l'application : `npm run dev`

---

## ⚠️ IMPORTANT

- **NE PARTAGEZ JAMAIS** vos clés API
- **NE COMMITEZ PAS** le fichier `.env.local` sur GitHub
- Gardez vos clés dans un endroit sûr

---

**Allez-y, connectez-vous et cherchez la section "Applications" !** 🚀

