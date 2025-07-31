# User Transaction Api

REST API with NestJS framework and postgreSQL database

## [Simple-Tour](https://github.com/HasanNugroho/simple-tour)

## Getting Started

### Requirements

- Node.js (v18+)
- PostgreSQL
- (Optional) Docker & Docker Compose

### Install & Run

Download this project:

```shell script
git clone git@github.com:HasanNugroho/simple-tour.git
```

### Manual Installation

Install dependencies

```shell script
npm install
```

Copy environment variables

```shell script
cp .env.example .env
```

```shell script
# Application Configuration
NODE_ENV=development
APP_NAME=Simple Tour
APP_DESC=Backend for Simple Tour
VERSION=1.0.0
PORT=3000

# PostgreSQL Database Configuration
DB_USER=dbUser
DB_PASS=dbPass
DB_NAME=test
DB_PORT=5432
DB_HOST=localhost

# Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=redispass

# JWT Configuration
JWT_SECRET_KEY=Rah4$14
JWT_EXPIRED='2h'
JWT_REFRESH_TOKEN_EXPIRED='2d'
```

Before running this project, make sure to configure your environment variables by copying .env.example and updating it with your own values.

#### Run the App

```shell script
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# running on default port 3000
```

### Run with Docker (Recomended)

```shell script
docker-compose up -d
```

### API Documentation

This project uses **Swagger** for API documentation. you can access the documentation at: **[http://localhost:3000/api](http://localhost:3000/api)**

![documentation](/image.png)

## Additional Features

- Refresh Token: Allows users to obtain a new access token using a valid refresh token without re-login, improving user experience and security.
- Logout: Revokes both access and refresh tokens, ensuring that users are fully logged out and tokens cannot be reused.
- Pagination & Filtering: Implemented on list endpoints (e.g., customers, trips) to efficiently handle large data sets. Supports page number, limit, and filtering options for flexible data retrieval.

## API Endpoints

### Auth

| Method | Endpoint                  | Deskripsi                                         | Autentikasi     |
| ------ | ------------------------- | ------------------------------------------------- | --------------- |
| POST   | `/api/auth/login`         | Login user, return token (access & refresh token) | ❌              |
| POST   | `/api/auth/register`      | Register user baru                                | ❌              |
| GET    | `/api/auth/me`            | Ambil data user yang sedang login                 | ✅ Bearer Token |
| POST   | `/api/auth/logout`        | Logout user, revoke access & refresh token        | ✅ Bearer Token |
| POST   | `/api/auth/refresh-token` | Refresh access token dengan refresh token         | ❌              |

### User

| Method | Endpoint     | Deskripsi         | Autentikasi     |
| ------ | ------------ | ----------------- | --------------- |
| POST   | `/api/users` | Membuat user baru | ✅ Bearer Token |

### Customer

| Method | Endpoint            | Deskripsi                                     | Autentikasi     |
| ------ | ------------------- | --------------------------------------------- | --------------- |
| POST   | `/api/customer`     | Membuat customer baru                         | ✅ Bearer Token |
| GET    | `/api/customer`     | Mendapatkan list customer (dengan pagination) | ✅ Bearer Token |
| GET    | `/api/customer/:id` | Mendapatkan detail customer berdasarkan ID    | ✅ Bearer Token |
| PUT    | `/api/customer/:id` | Update data customer berdasarkan ID           | ✅ Bearer Token |
| DELETE | `/api/customer/:id` | Menghapus customer berdasarkan ID             | ✅ Bearer Token |

### Trip

| Method | Endpoint           | Deskripsi                                                               | Autentikasi                |
| ------ | ------------------ | ----------------------------------------------------------------------- | -------------------------- |
| POST   | `/api/trip`        | Membuat trip baru                                                       | ✅ Bearer Token            |
| GET    | `/api/trip`        | Mendapatkan list trip (dengan pagination)                               | ✅ Bearer Token            |
| GET    | `/api/trip/:id`    | Mendapatkan detail trip berdasarkan ID                                  | ✅ Bearer Token            |
| PUT    | `/api/trip/:id`    | Update data trip berdasarkan ID                                         | ✅ Bearer Token            |
| DELETE | `/api/trip/:id`    | Menghapus trip berdasarkan ID                                           | ✅ Bearer Token            |
| GET    | `/api/trip/my`     | Mendapatkan list trip milik customer yang sedang login                  | ✅ Bearer Token (Customer) |
| GET    | `/api/trip/my/:id` | Mendapatkan detail trip milik customer yang sedang login berdasarkan ID | ✅ Bearer Token (Customer) |

## Structures

```
simple-tour
├── .env
├── .env.example
├── .gitignore
├── .prettierrc
├── .prettierrc.js
├── docker-compose.yml
├── Dockerfile
├── eslint.config.mjs
├── nest-cli.json
├── package-lock.json
├── package.json
├── README.md
├── src
|  ├── app.module.ts
|  ├── applications
|  |  ├── account
|  |  |  └── services
|  |  |     ├── auth.service.ts
|  |  |     └── user.service.ts
|  |  ├── application.module.ts
|  |  ├── customer
|  |  |  └── services
|  |  |     └── customer.service.ts
|  |  └── trip
|  |     └── services
|  |        └── trip.service.ts
|  ├── domains
|  |  ├── account
|  |  |  ├── entity
|  |  |  |  ├── credential.ts
|  |  |  |  └── user.ts
|  |  |  ├── repository
|  |  |  |  └── user.repository.interface.ts
|  |  |  └── service
|  |  |     ├── auth.service.interface.ts
|  |  |     └── user.service.interface.ts
|  |  ├── customer
|  |  |  ├── entity
|  |  |  |  └── customer.ts
|  |  |  ├── repository
|  |  |  |  └── customer.repository.interface.ts
|  |  |  └── service
|  |  |     └── customer.service.interface.ts
|  |  └── trip
|  |     ├── entity
|  |     |  └── trip.ts
|  |     ├── repository
|  |     |  └── trip.repository.interface.ts
|  |     └── service
|  |        └── trip.service.interface.ts
|  ├── infrastructures
|  |  ├── account
|  |  |  ├── entities
|  |  |  |  └── user.entity.ts
|  |  |  └── repository
|  |  |     └── user.repository.ts
|  |  ├── config
|  |  |  ├── app.config.ts
|  |  |  ├── database.config.ts
|  |  |  └── redis.config.ts
|  |  ├── customer
|  |  |  ├── entities
|  |  |  |  └── customer.entity.ts
|  |  |  └── repository
|  |  |     └── customer.repository.ts
|  |  ├── infrastructure.module.ts
|  |  └── trip
|  |     ├── entities
|  |     |  └── trip.entity.ts
|  |     └── repository
|  |        └── trip.repository.ts
|  ├── main.ts
|  ├── presentations
|  |  ├── customer
|  |  |  ├── controller
|  |  |  |  └── customer.controller.ts
|  |  |  └── dto
|  |  |     ├── create-customer.dto.ts
|  |  |     └── update-customer.dto.ts
|  |  ├── trip
|  |  |  ├── controller
|  |  |  |  └── trip.controller.ts
|  |  |  └── dto
|  |  |     ├── create-trip.dto.ts
|  |  |     └── update-trip.dto.ts
|  |  └── user
|  |     ├── controller
|  |     |  ├── auth.controller.ts
|  |     |  └── user.controller.ts
|  |     ├── dto
|  |     |  ├── auth.dto.ts
|  |     |  └── create-user.dto.ts
|  |     └── presentation.module.ts
|  └── shared
|     ├── constant.ts
|     ├── decorators
|     |  ├── customer-access.decorator.ts
|     |  ├── public.decorator.ts
|     |  └── user.decorator.ts
|     ├── dtos
|     |  ├── page-meta.dto.ts
|     |  ├── page-option.dto.ts
|     |  └── response.dto.ts
|     ├── enums
|     |  └── order.enum.ts
|     ├── filters
|     |  └── http-exception.filter.ts
|     └── guards
|        └── auth.guard.ts
├── test
|  ├── app.e2e-spec.ts
|  └── jest-e2e.json
├── tree.txt
├── tsconfig.build.json
└── tsconfig.json
```

## Architecture

This project follows Domain-Driven Design (DDD) with clear separation of concerns:

- Domains (src/domains): Location of business model and service/repository interfaces.
- Applications (src/applications): Implementation of the business logic according to the domain interface.
- Infrastructure (src/infrastructures): Database connections, ORM entities and repository implementation.
- Presentations (src/presentations): Controller and DTO for communication with clients (API).
- Shared (src/shared): Common code such as utilities, decorators, guards and filters.

This structure helps maintain modularity, scalability, and easier code management.

## Credits

- **[NestJS](https://nestjs.com/)** - A framework server-side applications.
- **[TypeORM](https://typeorm.io/)** - An ORM for TypeScript and JavaScript.
- **[Swagger](https://swagger.io/)** - A tool API documentation.
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database system.

## Copyright

Copyright (c) 2025 Burhan Nurhasan Nugroho.
