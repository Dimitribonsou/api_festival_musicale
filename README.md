# API Festival Musicale

Cette API permet de gérer les réservations pour un festival musical.  
Elle est développée avec **Node.js**, **Express** et utilise **Sequelize** pour l'accès à la base de données.

## Fonctionnalités

- Création, consultation, modification et suppression de réservations
- Gestion des événements et des utilisateurs (à compléter selon le projet)
- API RESTful

## Installation

1. Clone le dépôt :
   ```bash
   git clone <url-du-repo>
   cd api_festival_musicale
   ```

2. Installe les dépendances :
   ```bash
   npm install
   ```

3. Configure les variables d'environnement dans un fichier `.env` :
   ```
   PORT=3000
   DB_USER=...
   DB_PASSWORD=...
   DB_NAME=...
   DB_HOST=...
   ```

4. Lance le serveur :
   ```bash
   npm start
   ```

## Utilisation

- Accède à l'API sur [http://localhost:3000/api](http://localhost:3000/api)
- Exemple de route :  
  - `GET /api/reservations` : liste des réservations
  - `POST /api/reservations` : créer une réservation

## Structure du projet

```
src/
  ├── Data/
  │     └── Métier/
  │           └── models/         # Modèles Sequelize
  ├── Données/
  ├── Présentation/
  │     └── Routes/               # Définition des routes Express
  └── index.ts                    # Point d'entrée de l'application
```

## Technologies

- Node.js
- Express
- Sequelize
- TypeScript

---

