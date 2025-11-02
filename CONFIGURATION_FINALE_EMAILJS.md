# ✅ Configuration Finale EmailJS - VOS CLÉS

## 🎯 Vos informations EmailJS

- ✅ **Public Key** : `L2OS5qR2NOmM4Dljm`
- ✅ **Service ID** : `service_aaqs9dk`
- ⏳ **Template ID** : À récupérer depuis votre template créé
- ⏳ **Admin Email** : Votre email Gmail où recevoir les notifications

---

## 📝 Fichier .env.local à créer/modifier

**Créez ou modifiez** le fichier `.env.local` à la racine du projet avec ce contenu :

```env
# EmailJS Configuration
VITE_EMAILJS_PUBLIC_KEY=L2OS5qR2NOmM4Dljm
VITE_EMAILJS_SERVICE_ID=service_aaqs9dk
VITE_EMAILJS_TEMPLATE_ID=votre_template_id_ici

# Email où recevoir les notifications
VITE_ADMIN_EMAIL=votre-email@gmail.com
```

**À remplacer** :
- `votre_template_id_ici` → Le Template ID que vous avez créé (ex: `template_xxxxxxx`)
- `votre-email@gmail.com` → Votre adresse Gmail où vous voulez recevoir les notifications

---

## 🔍 Où trouver le Template ID ?

1. Allez dans **"Modèles d'e-mails"** (Email Templates)
2. **Cliquez sur le template** que vous avez créé ("Nouvelle commande")
3. Le **Template ID** est visible :
   - Dans l'URL de la page (après `/template/`)
   - Ou à côté du nom du template (ex: `template_xxxxxxx`)

---

## ✅ Étapes finales

1. **Récupérez votre Template ID** (voir ci-dessus)
2. **Créez/modifiez** `.env.local` avec vos informations
3. **Redémarrez l'application** :
```bash
npm run dev
```
4. **Testez** en passant une commande
5. **Vérifiez votre boîte email** 📧

---

## 🎉 C'est tout !

Une fois le Template ID ajouté dans `.env.local`, vous recevrez automatiquement un email à chaque nouvelle commande !

