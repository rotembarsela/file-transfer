# File Transfer Project

This project is a file transfer application with a Go backend server, a React frontend, and a PostgreSQL database. It allows users to upload files, generate unique download links, and handle file transfers efficiently.

## **Table of Contents**

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
  - [Running in Development Mode](#running-in-development-mode)
  - [Running in Production Mode](#running-in-production-mode)
- [Stopping the Services](#stopping-the-services)

## **Prerequisites**

Ensure you have the following installed on your system:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

## **Environment Variables**

The project uses the following environment variables for configuration:

- **`DATABASE_URL`**: Connection string for the PostgreSQL database in the format `postgres://<username>:<password>@<host>:<port>/<database>?sslmode=disable`
- **`NODE_ENV`**: Specifies the environment (`development` or `production`)

## **Running the Project**

### **Running in Development Mode**

1. **Set Environment Variables for Development**:
   By default, `NODE_ENV` is set to `development` when running in development mode.

2. **Run the Development Environment**:
   Use the following command to start the development environment:

   ```bash
   NODE_ENV=development BUILD_TARGET=dev docker compose --profile dev up --build
   ```

   This command will:

   - Start the React frontend app in development mode with hot-reloading.
   - Start the Go backend server with live-reloading using Air.
   - Initialize the PostgreSQL database.

3. **Access the Application**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8080

### **Running in Production Mode**

1. **Set Environment Variables for Production:**
   In production mode, `NODE_ENV` should be set to `production`.

2. **Run the Production Environment:**
   Use the following command to start the production environment:

   ```bash
   NODE_ENV=production BUILD_TARGET=prod docker compose --profile prod up --build
   ```

   This command will:

   - Start the React frontend app in development mode with hot-reloading.
   - Start the Go backend server with live-reloading using Air.
   - Initialize the PostgreSQL database.

3. **Access the Application**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8080

## **Stopping the Services**

To stop the services, use the following command:

```bash
docker compose down
```

To stop and remove all containers, networks, and volumes:

```bash
docker compose down -v
```
