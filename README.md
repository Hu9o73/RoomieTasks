![RoomieTasks](./Frontend/public/LogoPack/RoomieTasks.png)

# RoomieTasks

A containerized web application for managing household tasks in shared living spaces.

## Project Overview

RoomieTasks is a microservices-based application that helps roommates organize, assign, and track household chores and responsibilities. The application is built with a focus on containerization technologies, demonstrating proper network isolation, data persistence, and CI/CD integration.

## Architecture

The application consists of:

- **Frontend**: Angular-based web interface
- **User Service**: Handles authentication and user profiles
- **Task Service**: Manages tasks, assignments, and tracking
- **Databases**: Separate MySQL databases for each service

## Features

- User registration and authentication
- Create and join households via invite codes
- Create, assign, and track tasks
- View tasks in a list or calendar format
- Task analytics and statistics
- Role-based access control

## Requirements

- Docker and Docker Compose
- Git

## Running the Application

### Development Environment

1. Clone the repository:
   ```
   git clone https://github.com/Hu9o73/RoomieTasks.git
   cd roomietasks
   ```

2. Start the application:

   ```
   docker-compose up
   ```

3. Access the application:
   - Frontend: http://localhost:4200
   - User Service API: http://localhost:3000
   - Task Service API: http://localhost:3001


## Network Isolation

The application uses three separate Docker networks:

- `frontend-network`: Allows the frontend to communicate with both backend services
- `user-service-network`: Isolates the user service and its database
- `task-service-network`: Isolates the task service and its database

This ensures that each service can only access its own database, and the databases are not accessible from outside their respective networks.

## Data Persistence

All data is persisted using named Docker volumes:

- `roomietasks-userdb-data`: Stores user data
- `roomietasks-taskdb-data`: Stores task data

These volumes ensure that data survives container restarts and even host system reboots.

## CI/CD Pipeline

The project includes a GitHub CI pipeline that:

1. Runs linting and security scanning on Dockerfiles
2. Builds Docker images for all services
3. Pushes images to Docker Hub with proper versioning

## Development

Hot reload is enabled for the frontend during development. Any changes made to the Angular code will be automatically reflected in the browser without needing to restart the container.


## Security

- JWT-based authentication
- Network isolation between services
- Regular security scanning via CI/CD pipeline
- Input validation to prevent common web vulnerabilities