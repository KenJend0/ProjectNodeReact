# PoloManager

## Description

**PoloManager** is a web application designed to efficiently manage water polo teams. The application provides distinct features for managers, coaches, and players, such as:
- Team and coach management.
- Player statistics tracking.
- Event scheduling and planning.

As a high-level athlete, I chose this project to combine my technical skills with my passion for sports. I represented the French national team at the European U23 Championships in 2022 and am the current French Elite Vice Champion. This experience inspired me to develop a tool tailored for water polo teams to streamline their operations and improve team collaboration.

## Key Features

- **ag-Grid** integration for managing players and their data.
- Player statistics visualization using **Highcharts**.
- Authentication with roles-based access control (manager, coach, player).
- Advanced functionalities such as role management and dynamic updates.

## Project Dependencies

### Backend
- `express`: Web framework for the backend.
- `jsonwebtoken`: Used for secure authentication.
- `pg`: PostgreSQL client for database interaction.
- `swagger-ui-express`: Provides a Swagger UI for the REST API.
- `bcrypt`: Handles password encryption for secure storage.

### Frontend
- `react`: Framework for building the user interface.
- `react-router-dom`: Enables navigation between components.
- `ag-grid-react`: Displays and manages tabular data in the frontend.
- `highcharts`: Creates dynamic charts for data visualization.
- `axios`: Handles HTTP requests to the backend.

## Installation et configuration
### Prérequis
- Node.js (v16 ou plus récent)
- PostgreSQL (ou base de données équivalente)

### Installation
```bash
git clone https://github.com/KenJend0/ProjectNodeReact.git
cd frontend
npm install
cd ../backend
npm install
```

## Usage
### Manager Dashboard
- Assign coaches to teams.
- Monitor team performance and player statistics.
- Manage schedules and messages.
### Coach Dashboard
- Add and update player details.
- View schedules and manage training plans.
### Player Dashboard
View personal statistics and team updates.
## Demo
A demonstration video showcasing the application's features is provided in the /Video folder.
