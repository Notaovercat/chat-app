# Chat App

![My Skills](https://skillicons.dev/icons?i=ts,nodejs,express,vue,tailwind,prisma,redis)

This is a chat application built with a Vue 3 Vite PWA frontend and an Express backend. The backend is powered by Prisma ORM with PostgreSQL and uses Redis for caching. Real-time communication is facilitated by Socket.io. Both the frontend and backend are written in TypeScript.

# Structure

The project is structured as a pnpm run monorepo, with the frontend and backend located in packages/frontend and packages/backend respectively.

# Prerequisites

## Before you begin, ensure you have met the following requirements:

You have installed Node.js and Yarn
You have a Unix-based terminal ready for command line operations (Linux, Mac, or WSL on Windows)
You have Docker installed to setup the database and caching services

# Installing Chat App

To install the application, follow these steps:

Clone the repository

```bash
git clone https://github.com/Notaovercat/chat-app.git
```

Install dependencies

```bash
pnpm install
```

# Using Chat App

To use the chat app, follow these steps:

Start the database and caching services:

```bash
docker-compose up -d
```

Run the development servers:

```bash
pnpm run dev:all
```

To build the applications for production, you can use:

```bash
pnpm run build:all
```

To start backend server, you can use:

```bash
pnpm run start:back
```

To start frontend server, you can use:

```bash
pnpm run start:front
```

# Configuration

## The backend and frontend applications use environment variables for configuration.

For the backend, create a .env file in the packages/backend directory and populate it with the following or similar:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/postgres?schema=public"
CORS_ORIGIN="http://localhost:3000"
JWT_SECRET="your_secret_word"
PORT=3333
REDIS_HOST="localhost"
REDIS_PORT=6379
```

For the frontend, create a .env file in the packages/frontend directory and populate it with the following or similar:

```bash
VITE_API_URL="http://localhost:3333"
```
