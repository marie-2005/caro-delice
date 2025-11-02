# 📱 Configuration des Notifications SMS

## Options Disponibles

### Option 1 : Twilio (Recommandé - Payant mais Fiable)

Twilio est le service le plus fiable pour envoyer des SMS.

#### Étapes :

1. **Créer un compte Twilio** : https://www.twilio.com/try-twilio
2. **Obtenir vos credentials** :
   - Account SID
   - Auth Token
   - Numéro de téléphone Twilio (gratuit pour les tests)
3. **Ajouter dans `.env.local`** :
   ```
   VITE_TWILIO_ACCOUNT_SID=votre_account_sid
   VITE_TWILIO_AUTH_TOKEN=votre_auth_token
   VITE_TWILIO_PHONE_NUMBER=+1234567890
   VITE_ADMIN_PHONE=+221XXXXXXXXX
   ```
4. **⚠️ IMPORTANT** : Pour des raisons de sécurité, Twilio nécessite un backend.
   - Créez un endpoint backend `/api/send-sms` qui utilise Twilio
   - OU utilisez un service proxy comme Netlify Functions ou Vercel Serverless Functions

#### Exemple Backend (Node.js) :

```javascript
// api/send-sms.js
const twilio = require('twilio')
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { to, message } = req.body

  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    })

    return res.status(200).json({ success: true, sid: result.sid })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
```

---

### Option 2 : EmailJS + Email-to-SMS Gateway (Gratuit mais Limité)

Certains opérateurs permettent d'envoyer des SMS via email.

#### Étapes :

1. **Configurer EmailJS** (comme pour les emails)
2. **Créer un template SMS dans EmailJS** :
   - To Email: `{{to_email}}`
   - Subject: `SMS Notification`
   - Message: `{{message}}`
3. **Ajouter dans `.env.local`** :
   ```
   VITE_EMAILJS_SMS_TEMPLATE_ID=votre_template_sms_id
   VITE_EMAILJS_SERVICE_ID=votre_service_id
   VITE_EMAILJS_PUBLIC_KEY=votre_public_key
   VITE_ADMIN_PHONE=+221XXXXXXXXX
   ```

#### ⚠️ Limitations :
- Ne fonctionne pas avec tous les opérateurs
- Format : `+221XXXXXXXXX@operator.gateway.com`
- Orange Sénégal : Non supporté officiellement
- Tigo : Variable selon région

---

### Option 3 : SMS API Gratuite (Alternative)

#### Services Gratuits :
- **Textbelt** : https://textbelt.com/ (Limité, nécessite API key)
- **SMS API** : https://www.smsapi.com/ (Gratuit avec limitations)

#### Exemple avec Textbelt :

```javascript
const response = await fetch('https://textbelt.com/text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phone: '+221XXXXXXXXX',
    message: 'Votre message',
    key: 'votre_api_key'
  })
})
```

---

## Configuration dans Vercel

1. Allez dans **Settings** → **Environment Variables**
2. Ajoutez toutes les variables `VITE_*` nécessaires
3. Redéployez l'application

---

## Test

Pour tester les SMS :

1. Configurez vos variables d'environnement
2. Créez une commande test
3. Vérifiez les logs de la console pour les erreurs
4. Vérifiez que vous recevez les SMS

---

## Recommandation

**Pour la production**, utilisez **Twilio** avec un backend sécurisé. C'est le plus fiable et professionnel.

**Pour les tests**, vous pouvez utiliser EmailJS ou un service gratuit, mais les résultats peuvent être incohérents.

