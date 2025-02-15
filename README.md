# NestJS Todo App

## Prerequisites

Before you begin, ensure you have the following installed:

- Docker
- Node.js (v18 or later)
- yarn or pnpm
- Git

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/kingkinfajarr/todo-be.git
cd todo-be
change .env.example to .env
```

### Local Development (Without Docker)

```bash
# Install dependencies (optional if using Docker)
pnpm install
# or
yarn install

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start the application in development mode
yarn start:dev
# or
pnpm start:dev
```

### With Docker

```bash
# Build and start the services
docker-compose up --build

# To run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f api

# Stop the services
docker-compose down
```

### API Documentation

- [API Doc](http://localhost:3000/api)
