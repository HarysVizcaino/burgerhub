# 🍔 BurgerHub – Full Stack Technical Assessment

This repository contains a **full-stack technical assessment** composed of:

- **Backend API** built with **NestJS**
- **Mobile application** built with **Expo (React Native)**

Both projects live in the same repository as a **simple monorepo**, as requested.

---

## 📂 Repository Structure

```
burgerhub/
 ├─ backend/   # NestJS API
 ├─ mobile/    # Expo mobile app
 └─ README.md  # Root documentation
```

---

## 🚀 Backend (NestJS)

The backend provides a RESTful API for managing burgers, comments, collaborators, and authentication.

### Key features
- JWT authentication
- Burgers, comments, and collaborators
- Pagination and aggregation
- Redis caching with invalidation
- Rate limiting
- Swagger documentation
- Dockerized infrastructure

### How to run the backend
```bash
cd backend
docker compose up -d --build
```

Swagger will be available at:
```
http://localhost:3000/docs
```

For more details, see:
```
backend/README.md
```

---

## 📱 Mobile App (Expo)

The mobile app is built with **Expo** and consumes the BurgerHub API.

### How to run the mobile app
```bash
cd mobile
npm install
npx expo start
```

### API base URL
The API base URL is configured using Expo environment variables:

```env
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:3000
```

- Android Emulator: `http://10.0.2.2:3000`
- iOS Simulator: `http://localhost:3000`
- Physical device: `http://<your-local-ip>:3000`

---

## 🛠 Requirements

- Node.js (v18+ recommended)
- Docker & Docker Compose
- Expo CLI

---

## 🎯 Notes

- Environment variables are managed via `.env` files and are not committed.
- Redis is used only for read-heavy endpoints to improve performance.
- Cache invalidation is applied on write operations.
- The project is intentionally kept simple and readable for assessment purposes.

---

## 👤 Author

**Harys Vizcaino**  
Senior Backend / Full-Stack Engineer  
Dominican Republic
