# 🌊 Configuration Wave Business - ÉTAPE PAR ÉTAPE

## Étape 1 : Obtenir vos clés API Wave

1. **Accédez au portail développeur Wave** :
   - 👉 **https://developer.waveapps.com** (portail officiel)
   - Ou connectez-vous via l'**application mobile Wave Business**
   
2. **Créez un compte développeur** (si vous n'en avez pas)
3. **Créez une nouvelle application** dans le portail développeur
4. **Obtenez votre clé API** (API Key / Bearer Token)
5. **Notez votre Business ID** (ID de votre compte Wave Business)
6. **Copiez et notez** :
   - ✅ **API Key** (clé API principale)
   - ✅ **Business ID** (ID de votre compte marchand)

⚠️ **GARDEZ CES CLÉS SECRÈTES ! Ne les partagez jamais !**

---

## Étape 2 : Créer le fichier .env.local

1. Dans la **racine** de votre projet (même niveau que `package.json`)
2. Créez un fichier nommé : `.env.local`
3. Ajoutez-y **exactement** ceci (remplacez par vos vraies clés) :

```
VITE_WAVE_API_KEY=votre_cle_api_wave_ici
VITE_WAVE_BUSINESS_ID=votre_business_id_ici
VITE_WAVE_API_URL=https://api.waveapps.com/v1
```

4. **Remplacez** `votre_client_id_ici`, etc. par vos **vraies clés** (sans espaces, sans guillemets)

---

## Étape 3 : Redémarrer l'application

Après avoir créé `.env.local` :

1. **Arrêtez** l'application (Ctrl+C dans le terminal)
2. **Redémarrez** : `npm run dev`
3. Les clés seront chargées automatiquement

---

## Étape 4 : Tester

1. Passez une commande dans l'application
2. Sélectionnez **Wave** comme mode de paiement
3. Cliquez sur **"Payer avec Wave"**
4. Vous devriez être redirigé vers Wave ou voir un lien de paiement

---

## ⚠️ Important

- Le fichier `.env.local` est **déjà** dans `.gitignore` (ne sera PAS publié sur GitHub)
- **NE COMMITEZ JAMAIS** vos clés API sur GitHub !
- Si vous voulez déployer, vous devrez ajouter les clés dans Vercel (Variables d'environnement)

---

## 📋 Documentation Wave

Consultez la documentation officielle pour les détails de l'API :
- **Portail Développeur** : https://developer.waveapps.com
- **Documentation API** : https://docs.wave.com/business
- **API Checkout** : https://docs.wave.com/checkout
- **Support Wave** : Contactez le support Wave Business si nécessaire

---

## 🔍 Si vous ne trouvez pas le portail développeur

1. **Contactez le support Wave Business** :
   - Via l'application mobile Wave
   - Par email : support@wave.sn (Sénégal) ou support@wave.ci (Côte d'Ivoire)
   - Demandez à activer l'accès API pour votre compte Business

2. **Alternative temporaire** :
   - Vous pouvez utiliser les **liens de paiement Wave manuels** (le système les génère automatiquement)
   - Les clients recevront un lien qu'ils peuvent utiliser pour payer via l'app Wave

---

**Commencez par l'Étape 1 : Obtenir vos clés API Wave !**

Une fois que vous avez vos clés, créez le fichier `.env.local` et redémarrez l'application.

