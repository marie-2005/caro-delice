# 🧪 Tester les Notifications - Étapes

## 🔍 Après avoir redémarré l'application

### 1. Ouvrez la console du navigateur (F12)

### 2. Passez une commande test

### 3. Regardez les messages dans la console

**Vous devriez voir** :

**✅ Si ça fonctionne** :
```
🔍 Debug EmailJS Config: { publicKey: "L2OS5qR2NOm...", serviceId: "service_aaqs9dk", ... }
📧 Envoi de notification email...
✅ Notification email envoyée avec succès: {...}
```

**❌ Si ça ne fonctionne pas** :
```
🔍 Debug EmailJS Config: { publicKey: "MANQUANT", serviceId: "MANQUANT", ... }
⚠️ EmailJS non configuré - Notification non envoyée
```
→ Le fichier `.env.local` n'est pas chargé

**OU** :
```
🔍 Debug EmailJS Config: { ... (tout est OK) }
📧 Envoi de notification email...
❌ Erreur lors de l'envoi de la notification: ...
```
→ Problème avec EmailJS (vérifiez le template/service)

---

## 📧 Vérifier votre email

1. Vérifiez **manouscampus2@gmail.com**
2. Vérifiez aussi les **spams/courrier indésirable**
3. Cherchez un email de **EmailJS** ou avec le sujet "🎉 Nouvelle commande"

---

## 🆘 Dites-moi ce que vous voyez dans la console

Copiez-collez les messages que vous voyez après avoir passé une commande, et je vous aiderai à résoudre le problème !

