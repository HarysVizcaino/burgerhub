# 🍔 BurgerHub API

BurgerHub is a RESTful API built as part of a full‑stack technical assessment.  
It allows users to create burgers, comment on them, collaborate with other users, and explore data efficiently using pagination, aggregation, caching, and authentication.

---

## 🚀 Tech Stack

- **Node.js / TypeScript**
- **NestJS**
- **MongoDB (Mongoose)**
- **Redis (Cache)**
- **JWT Authentication**
- **Swagger (OpenAPI)**
- **Docker & Docker Compose**

---

## 🧱 Architecture

The API follows a clean and modular structure:

- **Controllers**: HTTP layer only
- **Services**: Business logic
- **Repositories**: Data access and aggregation pipelines
- **DTOs**: Request and response contracts
- **Mappers**: Transform raw documents into API responses
- **Guards & Pipes**: Authentication, authorization, validation
- **Cache Layer**: Redis with explicit invalidation

This structure keeps the codebase maintainable and scalable.

---

## 🔐 Authentication

Authentication is implemented using **JWT**.

### Endpoints
- `POST /auth/register`
- `POST /auth/login`

### Features
- Passwords are hashed using bcrypt
- JWT returned on successful login/register
- Protected routes require `Authorization: Bearer <token>`
- Rate limiting applied to sensitive endpoints

---

## 🍔 Burgers

### Create burger
`POST /burgers` (authenticated)

### List burgers (paginated)
`GET /burgers?page=1&limit=10`

- Pagination with total count
- Aggregation for `commentsCount` and `collaboratorsCount`
- Creator populated
- Cached using Redis

### Get burger details
`GET /burgers/:id`

- Full burger details
- Creator information
- Comments and collaborators count
- Cached using Redis

---

## 💬 Comments

### Add comment
`POST /burgers/:id/comments` (authenticated)

- Invalidates related caches

### List comments
`GET /burgers/:id/comments?page=1&limit=10`

- Paginated response
- Comment author populated
- Clean DTO-based response

---

## 🤝 Collaborators (Bonus)

Burger creators can manage collaborators.

- `POST /burgers/:id/collaborators`
- `DELETE /burgers/:id/collaborators/:userId`

Rules:
- Only the burger creator (or admin) can manage collaborators
- Duplicate collaborators are prevented
- Collaborators count calculated via aggregation

---

## ⚡ Caching (Redis)

Redis is used to optimize read-heavy endpoints.

### Cached endpoints
- `GET /burgers`
- `GET /burgers/:id`

### Strategy
- Service-level caching
- TTL configurable via environment variables
- Cache invalidation on:
  - Creating burgers
  - Adding comments
  - Adding or removing collaborators

---

## 🚦 Rate Limiting

Rate limiting is implemented using `@nestjs/throttler` to protect the API from abuse, especially on authentication endpoints.

---

## 📘 API Documentation

Swagger UI is available at:

`http://localhost:3000/docs`

It includes:
- All endpoints
- Request and response schemas
- JWT authentication support

---

## 🐳 Running the Project (Docker)

### Prerequisites
- Docker
- Docker Compose

### Start all services
```bash
docker compose up -d --build
```

This will start:
- MongoDB
- Mongo Express
- Redis
- BurgerHub API

---

## 🔧 Environment Variables

Example `.env` file:

```env
PORT=3000
MONGO_URI=mongodb://mongo:27017/burgerhub
JWT_SECRET=supersecret
JWT_EXPIRES_IN=1d
REDIS_HOST=redis
REDIS_PORT=6379
CACHE_TTL=60
```

---

## 🔮 Possible Improvements

Given more time, the following improvements could be added:

- **Unit testing** (services and repositories)
- **Integration testing** (API endpoints)
- Advanced cache invalidation strategies
- Role-based permissions refinement
- API versioning

---

## 👤 Author

**Harys Vizcaino**  
Senior Backend / Full‑Stack Engineer  
Dominican Republic
