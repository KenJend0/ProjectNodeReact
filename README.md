# PoloManager

## Description
PoloManager est une application web conçue pour gérer des équipes de water-polo. Elle inclut des fonctionnalités pour les managers, coachs et joueurs, comme :
- Gestion des équipes et des entraîneurs.
- Suivi des statistiques des joueurs.
- Calendrier des événements avec planification.

## Fonctionnalités principales
- Utilisation d'**ag-Grid** pour gérer les joueurs.
- Visualisation des statistiques des joueurs avec **Highcharts**.
- Authentification et rôles (manager, coach, joueur).

## Captures d'écran
### Page de connexion
![Page de connexion](./screenshots/login.png)

### Tableau des joueurs
![Gestion des joueurs](./screenshots/players-grid.png)

## Installation et configuration
### Prérequis
- Node.js (v16 ou plus récent)
- PostgreSQL (ou base de données équivalente)

### Installation
```bash
git clone https://github.com/<votre-utilisateur>/<nom-du-repo>.git
cd frontend
npm install
cd ../backend
npm install
