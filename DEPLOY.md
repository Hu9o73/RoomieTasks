# RoomieTasks Deployment Guide

This guide helps you deploy the RoomieTasks application using pre-built Docker images.

## Requirements
- Docker and Docker Compose
- 4GB+ RAM recommended
- 10GB+ free disk space

## Deployment Steps

1. **Download the deployment files**:
   ```bash
   # Download docker-compose file and environment example
   curl -O https://github.com/Hu9o73/RoomieTasks/main/docker-compose.deploy.yml
   curl -O https://github.com/Hu9o73/RoomieTasks/main/.env.example
   ```

2. **Configure environment variables**:
   ```bash
   # Copy the example file to .env
   cp .env.example .env
   
   # Edit the .env file with your values
   nano .env
   ```
   
   Make sure to set these variables:
   - `DOCKER_USERNAME`: Your Docker Hub username or the one where images are hosted
   - `TAG`: Version tag of the images to use (e.g., v1.0.0 or latest)
   - `JWT_SECRET`: A secure random string for JWT token signing
   - `DB_PASSWORD`: A secure password for MySQL databases

3. **Start the application**:
   ```bash
   docker-compose -f docker-compose.deploy.yml up -d
   ```

4. **Access the application**:
   Open http://localhost in your web browser

## Verifying Network Isolation

The deployment uses three isolated Docker networks:
- `frontend-network`: Connects frontend with both services
- `user-service-network`: Isolates user service and its database
- `task-service-network`: Isolates task service and its database

To verify this isolation:
```bash
# List networks
docker network ls

# Inspect user service network
docker network inspect roomietasks_user-service-network

# Verify you can't connect from task service to user database
docker exec -it roomietasks-task-service-1 sh
ping userdb  # Should fail
```

## Data Persistence

Data is stored in named volumes:
- `roomietasks-userdb-data`: Stores user data
- `roomietasks-taskdb-data`: Stores task data

To backup these volumes:
```bash
# Create backup directory
mkdir -p backups

# Backup user database
docker run --rm -v roomietasks-userdb-data:/data -v $(pwd)/backups:/backups alpine tar cvf /backups/userdb-backup.tar /data

# Backup task database
docker run --rm -v roomietasks-taskdb-data:/data -v $(pwd)/backups:/backups alpine tar cvf /backups/taskdb-backup.tar /data
```

## Troubleshooting

- **Services keep restarting**: Check logs with `docker-compose -f docker-compose.deploy.yml logs`
- **Database connection issues**: Databases might need time to initialize
- **Permission errors**: Ensure Docker has proper permissions to create and manage volumes
- **Frontend can't connect to backend**: Check network settings and environment variables

## Security Best Practices

1. **Change default passwords** in the .env file
2. **Implement HTTPS** using a reverse proxy like Nginx or Traefik
3. **Enable database backups** on a regular schedule
4. **Restrict access** to Docker socket and management APIs
5. **Update images** regularly to include security patches