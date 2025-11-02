# 📍 COMMENT TROUVER LES VARIABLES D'ENVIRONNEMENT DANS VERCEL

## 🎯 Étapes Détaillées

### Étape 1 : Aller sur votre projet Vercel

1. **Allez sur** : [vercel.com](https://vercel.com)
2. **Connectez-vous** avec votre compte
3. **Cliquez sur votre projet** "caro-délice" (ou le nom que vous avez donné)

---

### Étape 2 : Trouver "Settings"

Une fois dans votre projet, **regardez la barre de navigation en haut** :

```
┌─────────────────────────────────────────────────────┐
│  Overview | Deployments | Analytics | Settings ←─── CLIQUEZ ICI !
└─────────────────────────────────────────────────────┘
```

**OU** cherchez dans le menu latéral gauche :

```
🏠 Overview
📦 Deployments
📊 Analytics
⚙️ Settings  ←─── CLIQUEZ ICI !
🔗 Domains
```

---

### Étape 3 : Ouvrir "Environment Variables"

Dans la page **Settings**, vous verrez plusieurs sections :

```
┌─────────────────────────────────────┐
│  General                             │
│  Domains                             │
│  Environment Variables ←─── CLIQUEZ ICI ! │
│  Git                                  │
│  Deployment Protection              │
│  Security                             │
│  ...                                  │
└─────────────────────────────────────┘
```

**Cliquez sur "Environment Variables"**

---

### Étape 4 : Ajouter les variables

Vous verrez une section comme ça :

```
┌─────────────────────────────────────────────────────┐
│  Environment Variables                               │
│                                                       │
│  [Add New] ←─── BOUTON EN HAUT À DROITE              │
│                                                       │
│  (Liste vide si aucune variable n'est encore ajoutée) │
└─────────────────────────────────────────────────────┘
```

**Cliquez sur le bouton "Add New"** (en haut à droite ou dans le tableau)

---

### Étape 5 : Remplir le formulaire

Un formulaire s'ouvre avec 3 champs :

```
┌─────────────────────────────────────┐
│  Add Environment Variable            │
│                                      │
│  Key: [_______________]               │
│  Value: [______________]             │
│                                      │
│  Environments:                      │
│  ☐ Preview                          │
│  ☑ Production                       │
│  ☐ Development                       │
│                                      │
│  [Cancel]  [Add] ←─── CLIQUEZ ICI ! │
└─────────────────────────────────────┘
```

**Pour chaque variable :**

1. **Key** : Collez le nom (ex: `VITE_EMAILJS_PUBLIC_KEY`)
2. **Value** : Collez la valeur (ex: `L2OS5qR2NOmM4Dljm`)
3. **Cochez "Production"** (et "Preview" si vous voulez)
4. **Cliquez "Add"**

---

## 📝 Les 4 Variables à Ajouter

Ajoutez-les **une par une** :

### Variable 1
- **Key** : `VITE_EMAILJS_PUBLIC_KEY`
- **Value** : `L2OS5qR2NOmM4Dljm`
- **Environments** : ☑ Production

### Variable 2
- **Key** : `VITE_EMAILJS_SERVICE_ID`
- **Value** : `service_v9szy47`
- **Environments** : ☑ Production

### Variable 3
- **Key** : `VITE_EMAILJS_TEMPLATE_ID`
- **Value** : `template_trm10sh`
- **Environments** : ☑ Production

### Variable 4
- **Key** : `VITE_ADMIN_EMAIL`
- **Value** : `manouscampus2@gmail.com`
- **Environments** : ☑ Production

---

## 🔍 Si vous ne voyez toujours pas "Settings"

### Option A : Vérifier que vous êtes sur le bon projet

1. **En haut de la page**, vérifiez le nom du projet
2. Si ce n'est pas "caro-délice", cliquez sur le menu déroulant pour sélectionner le bon projet

### Option B : Vérifier les permissions

Si vous voyez un message "You don't have permission", cela signifie que vous n'êtes pas le propriétaire du projet.

**Solution :** Connectez-vous avec le compte qui a créé le projet.

---

## 📱 Interface Mobile

Sur mobile, l'interface est différente :

1. **Ouvrez** le menu hamburger (☰) en haut à gauche
2. **Scrolllez** jusqu'à "Settings"
3. **Cliquez** sur "Settings"
4. **Trouvez** "Environment Variables"

---

## 🖼️ À quoi ça ressemble (description)

L'interface Vercel a généralement :
- **Barre de navigation en haut** : Overview, Deployments, Analytics, Settings
- **Menu latéral gauche** (sur grand écran) : Liste des options
- **Zone centrale** : Contenu de la page

**Settings** est toujours accessible depuis la barre principale en haut.

---

## ✅ Après avoir ajouté les variables

1. **Redéployez** manuellement :
   - Allez dans **"Deployments"**
   - Cliquez sur **"..."** (trois points) du dernier déploiement
   - Cliquez sur **"Redeploy"**

2. **Attendez** 1-2 minutes

3. **Testez** votre application !

---

**Si vous ne trouvez toujours pas, faites une capture d'écran de votre page Vercel et je vous guiderai plus précisément !**

