# Todo-with-backend

A minimal task manager API (Express) demonstrating authentication, validation, and in-memory data storage.

## Project Structure

- `src/app.js` – Express app configuration and route mounting
- `src/server.js` – Starts the HTTP server
- `src/routes/` – Route definitions (`auth.routes.js`, `task.routes.js`)
- `src/controllers/` – Request handlers for auth and tasks
- `src/middleware/` – `auth.middleware.js`, `validate.middleware.js`, `error.middleware.js`
- `src/data/db.js` – In-memory arrays: `users` and `tasks`
- `src/utils/jwt.js` – JWT token generation

## High-level Flow

1. `server.js` loads `app` and starts listening.
2. `app.js` registers `express.json()` and mounts the auth and task routers, then the error handler.
3. `auth` routes (`/api/v1/auth`) handle signup/login. `login` issues a JWT containing `{ userId }`.
4. `tasks` routes (`/api/v1/tasks`) are protected by `auth.middleware` (router-level). The middleware:
   - Reads `Authorization: Bearer <token>` header
   - Verifies the token with `JWT_SECRET`
   - Sets `req.user = { userId: decoded.userId }` on success
5. Controllers use `req.user.userId` to scope data. Example:
   - `createTask` saves tasks with `userId: req.user.userId`.
   - `getAllTasks` filters tasks with `task.userId === req.user.userId` and then applies query filters, sorting, pagination.
6. Validation middleware (`validateTask`, `validateTaskUpdate`) run on specific routes and return `400` for invalid payloads.
7. Any uncaught errors or `next(err)` are handled by `error.middleware` which responds with `500`.

## Endpoints (summary)

- `POST /api/v1/auth/signup` – Create user (body: `name`, `email`, `password`)
- `POST /api/v1/auth/login` – Login (body: `email`, `password`) → returns `{ token }`
- `POST /api/v1/tasks` – Create task (protected, body: `title`, `description?`, `status?`)
- `GET /api/v1/tasks` – List tasks (protected). Query params: `search`, `status`, `sort`, `order`, `page`, `limit`.
- `GET /api/v1/tasks/:id` – Get single task (protected)
- `PATCH /api/v1/tasks/:id` – Update task (protected)
- `DELETE /api/v1/tasks/:id` – Delete task (protected)

## Auth

- Provide header: `Authorization: Bearer <token>` on protected routes.
- Token generated with `generateToken(userId)` and verified by `auth.middleware` using `process.env.JWT_SECRET`.

## Notes & Caveats

- Data is stored in-memory (`src/data/db.js`). Restarting the server clears users and tasks.
- IDs are simple incremental numbers.
- `README` assumes `JWT_SECRET` is set in the environment for sign/verify operations.

## Run locally

1. Install deps:

```bash
npm install
```

2. Create a `.env` with at least:

```
JWT_SECRET=your_secret_here
PORT=5000
```

3. Start server:

```bash
node src/server.js
```

## Debug tips

- If tasks are not returned for an authenticated user, verify:
  - The request includes a valid `Authorization` header.
  - The token decodes to `{ userId }` and that `userId` matches stored `task.userId` (types should match).
- You can make comparisons type-safe by converting both sides to strings: `String(task.userId) === String(req.user.userId)`.

---

If you want, I can add quick example `curl` requests or a Postman collection next.