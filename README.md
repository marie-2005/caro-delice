# 🥞 Caro Delice - Application de Commande de Crêpes

Application web moderne permettant aux étudiants de commander des crêpes à l'université.

## ✨ Fonctionnalités

- 📱 **Interface moderne et responsive** - Fonctionne sur mobile et desktop
- 🍽️ **Menu complet** - 8 types de crêpes (sucrées et salées)
- 🛒 **Panier interactif** - Ajoutez, modifiez ou supprimez des articles
- 📝 **Formulaire de commande** - Collecte des informations de contact et point de retrait
- 💰 **Calcul automatique** - Total calculé en temps réel

## 🚀 Installation

1. **Installer les dépendances**
```bash
npm install
```

2. **Lancer l'application en mode développement**
```bash
npm run dev
```

3. **Ouvrir dans le navigateur**
L'application sera accessible sur `http://localhost:5173`

## 📦 Build pour production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/`

## 🎨 Technologies utilisées

- **React 18** - Bibliothèque JavaScript pour l'interface
- **Vite** - Outil de build moderne et rapide
- **CSS3** - Styles modernes avec animations fluides

## 📋 Menu disponible

- Crêpe Sucre - 2.50€
- Crêpe Nutella - 3.50€
- Crêpe Miel - 3.00€
- Crêpe Confiture - 3.00€
- Crêpe Complète - 4.50€
- Crêpe Chèvre Miel - 5.00€
- Crêpe Thon - 4.50€
- Crêpe Chocolat Banane - 4.00€

## 🔧 Personnalisation

Vous pouvez facilement modifier :
- Les articles du menu dans `src/components/Menu.jsx`
- Les styles dans les fichiers CSS de chaque composant
- Les points de retrait dans `src/components/OrderForm.jsx`

## 🌐 Déploiement en ligne

Pour que vos clients puissent utiliser l'application sur leurs téléphones, vous devez la mettre en ligne.

### Option rapide : Vercel (GRATUIT)

1. Créez un compte sur [GitHub](https://github.com) et [Vercel](https://vercel.com)
2. Envoyez votre code sur GitHub
3. Connectez Vercel à votre dépôt GitHub
4. Vercel déploie automatiquement !

**Voir le guide complet :** [DEPLOY.md](./DEPLOY.md)

## ⚠️ Important : LocalStorage

Actuellement, les commandes sont stockées dans le navigateur de chaque client. Cela signifie :
- ✅ Chaque client peut voir **ses propres commandes**
- ❌ Vous ne verrez les commandes que sur **votre navigateur**
- ❌ Les commandes ne sont **pas centralisées**

Pour voir toutes les commandes de tous les clients, il faudrait une base de données (Firebase, Supabase, etc.)

## 📝 Notes

Les commandes sont sauvegardées localement dans le navigateur de chaque client. Pour une solution complète avec gestion centralisée des commandes, vous devrez ajouter :
- Une base de données (Firebase, Supabase, MongoDB)
- Un backend pour gérer les commandes
- Un système de notifications

---

Bon appétit ! 🥞✨

