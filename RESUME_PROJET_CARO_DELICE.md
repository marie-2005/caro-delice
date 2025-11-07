# Résumé du Projet - Caro Delice

## Conception et réalisation d'un site web de gestion de commandes de crêpes en ligne

Ce projet visait à améliorer la gestion globale des commandes de crêpes pour les étudiants d'une université en mettant en place une application web moderne, performante et évolutive. Celle-ci devrait permettre la gestion des commandes, des clients, des paiements en ligne, des stocks, des codes promo et des points fidélité. Nous avons utilisé **React** pour le frontend, **Firebase** (Authentication et Firestore) pour le backend et la base de données, **EmailJS** pour les notifications email, et **Vite** comme outil de build.

### Fonctionnalités principales

**Pour les clients :**
- Parcours du menu avec photos et descriptions
- Panier interactif avec gestion des quantités
- Commande avec ou sans compte utilisateur
- Paiement en ligne (Wave Mobile Money, Orange Money, Tremo) ou sur place
- Suivi des commandes en temps réel
- Système de points fidélité (1 point = 10 FCFA, 100 points = 1 crêpe gratuite)
- Application de codes promo
- Favoris et profil utilisateur
- Notifications automatiques par email et SMS

**Pour les administrateurs :**
- Dashboard avec statistiques et graphiques de ventes
- Gestion complète des commandes (visualisation, modification de statut, suppression)
- Gestion des stocks avec alertes de stock faible
- Gestion des codes promo
- Configuration des horaires d'ouverture
- Impression automatique des tickets de commande
- Notifications pour nouvelles commandes

### Technologies utilisées

- **Frontend :** React 18, Vite, CSS3
- **Backend :** Firebase Authentication, Cloud Firestore
- **Services tiers :** EmailJS (emails), SMS Service, Wave Mobile Money API
- **Outils :** Recharts (graphiques), Service Worker (PWA)



