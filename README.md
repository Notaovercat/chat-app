# Chat App
This is a chat application built with a Vue 3 Vite PWA frontend and an Express backend. The backend is powered by Prisma ORM with PostgreSQL and uses Redis for caching. Real-time communication is facilitated by Socket.io. Both the frontend and backend are written in TypeScript.

# Structure
The project is structured as a yarn monorepo, with the frontend and backend located in packages/frontend and packages/backend respectively.

# Prerequisites
Before you begin, ensure you have met the following requirements:

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
yarn install
```

Using Chat App
To use the chat app, follow these steps:

Start the database and caching services:
```bash
docker-compose up -d
```
Run the development servers:
```bash
yarn dev:all
```

To build the applications for production, you can use:
```bash
yarn build:all
```

# Configuration
The backend and frontend applications use environment variables for configuration.

For the backend, create a .env file in the packages/backend directory and populate it with the following:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/postgres?schema=public"
CORS_ORIGIN="http://localhost:3000"
JWT_SECRET="secret_shhh"
PORT=3333
REDIS_HOST="localhost"
REDIS_PORT=6379
```

For the frontend, create a .env file in the packages/frontend directory and populate it with the following:

makefile
Copy code
VITE_API_URL="http://localhost:3333"
Contributing to Chat App
To contribute to Chat App, follow these steps:

Fork the repository.
Create a branch: git checkout -b <branch_name>.
Make your changes and commit them: git commit -m '<commit_message>'
Push to the original branch: git push origin <project_name>/<location>
Create the pull request.
Alternatively see the GitHub documentation on creating a pull request.

Contact
If you want to contact me you can reach me at fdgoe@list.ru.

License
This project uses the following license: MIT.

Remember to replace <link to your license> with the actual link to your license file if it exists. If you don't have a license file, you may want to create one.

Also, don't forget to update the instructions if there are any specific steps required for your project.
