# 🔍 Diagnostic EmailJS - Si ça ne fonctionne pas

## ✅ Vérifications à faire

### 1. Vérifier le fichier .env.local

**Le fichier doit être à la racine du projet** (même niveau que `package.json`)

**Contenu exact attendu** :
```env
# EmailJS Configuration
VITE_EMAILJS_PUBLIC_KEY=L2OS5qR2NOmM4Dljm
VITE_EMAILJS_SERVICE_ID=service_aaqs9dk
VITE_EMAILJS_TEMPLATE_ID=template_trm10sh

# Email où recevoir les notifications
VITE_ADMIN_EMAIL=manouscampus2@gmail.com
```

**Vérifiez** :
- Pas d'espaces avant/après les `=`
- Pas de guillemets autour des valeurs
- Pas de caractères spéciaux non nécessaires

---

### 2. Vérifier la console du navigateur

Après avoir passé une commande, regardez la console (F12) :

**Si vous voyez** : `🔍 Debug EmailJS Config:`
- Vérifiez que toutes les valeurs sont présentes (pas "MANQUANT")
- Si "MANQUANT" → Le fichier `.env.local` n'est pas chargé

**Si vous voyez** : `📧 Envoi de notification email...`
- Mais pas de `✅ Notification email envoyée`
- → Il y a une erreur EmailJS (vérifiez les logs)

---

### 3. Vérifier le template EmailJS

Dans EmailJS, allez dans votre template "Nouvelle commande" :

1. **Vérifiez que le contenu contient les variables** :
   - `{{order_id}}`
   - `{{customer_name}}`
   - `{{customer_phone}}`
   - etc.

2. **Vérifiez que "Vers l'e-mail" est bien** : `manouscampus2@gmail.com`

3. **Testez le template** :
   - Dans EmailJS, cliquez sur "Envoyer un email de test"
   - Vérifiez que vous recevez bien l'email de test

---

### 4. Vérifier le service Gmail

Dans EmailJS, allez dans "Services de messagerie" :

1. **Vérifiez que le service Gmail est actif**
2. **Vérifiez le Service ID** : doit être `service_aaqs9dk`

---

### 5. Redémarrer complètement

1. **Fermez complètement** le terminal (pas juste Ctrl+C)
2. **Ouvrez un nouveau terminal**
3. **Allez dans le dossier du projet**
4. **Lancez** : `npm run dev`

---

### 6. Vérifier les spams

- Vérifiez votre dossier **spam/courrier indésirable** dans Gmail
- Cherchez les emails de `noreply@emailjs.com` ou votre compte

---

## 🆘 Si rien ne fonctionne

**Regardez la console** (F12) et dites-moi :
- Les messages que vous voyez après avoir passé une commande
- Les erreurs éventuelles (en rouge)

**Je pourrai alors vous aider plus précisément !**

