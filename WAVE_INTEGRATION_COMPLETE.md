# 🌊 Intégration Wave Business - Guide Complet

## Étape 1 : Obtenir vos clés API Wave

1. **Connectez-vous** à https://app.wave.com (votre compte Wave Business)
2. Allez dans **Paramètres** → **API** ou **Intégrations**
3. Créez une **nouvelle application/clé API**
4. **Copiez** :
   - **Client ID** (ou Public Key)
   - **Client Secret** (ou Private Key)
   - **Merchant ID** (si disponible)

⚠️ **GARDEZ CES CLÉS SECRÈTES !**

---

## Étape 2 : Créer le fichier .env.local

1. Dans la racine de votre projet, créez un fichier `.env.local`
2. Ajoutez-y :

```
VITE_WAVE_CLIENT_ID=votre_client_id_ici
VITE_WAVE_CLIENT_SECRET=votre_client_secret_ici
VITE_WAVE_MERCHANT_ID=votre_merchant_id_ici
VITE_WAVE_ENVIRONMENT=production
```

3. Remplacez les valeurs par vos vraies clés API

⚠️ **Ce fichier ne sera PAS publié sur GitHub**

---

## Étape 3 : Vérifier .gitignore

Assurez-vous que `.env.local` est dans `.gitignore` :

```
.env.local
```

---

## Étape 4 : Documentation Wave

Consultez la documentation officielle :
- **Documentation Wave** : https://docs.wave.com
- **API Checkout** : Pour les paiements en ligne

---

## 📝 Après avoir vos clés API

Une fois que vous avez vos clés, dites-moi et je vais :
1. Créer le service Wave dans votre application
2. Intégrer le bouton de paiement
3. Gérer la confirmation de paiement
4. Mettre à jour automatiquement le statut des commandes

---

**Commencez par obtenir vos clés API Wave, puis dites-moi quand c'est fait !**

