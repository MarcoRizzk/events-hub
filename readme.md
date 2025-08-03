# Events Management Application

## Setup & Run Instructions

### Using Docker (recommended)

1. Install [Docker](https://docs.docker.com/get-docker/) and Docker Compose.
2. Clone the repository:
   ```bash
   cd events-management
   ```
3. Start the full stack:
   ```bash
   docker compose up --build
   ```
   The following services will be available:
   - **Backend API** – http://localhost:3000
   - **Frontend (Next.js)** – http://localhost:5000
   - **PostgreSQL** – localhost:5432 (`postgres` / `postgres`)
   - **pgAdmin** – http://localhost:8888 (login: `root@postgres.com` / `postgres`)

4- register user and start using the app and create events and rsvp to others events.

The containers watch the source folders (`backend/src`, `frontend/src`) so any code changes trigger hot-reload without rebuilding the image.

### Local development without Docker

1. Install **Node.js >= 20** and **pnpm** (or npm).
2. Create a `.env` file in `backend` and `frontend` (see `.env.docker` for examples).
3. In two terminals:

   ```bash
   # Backend
   cd backend
   npm install
   npm run start:dev

   # Frontend
   cd frontend
   npm install
   npm run dev
   ```

4. Ensure you have a local PostgreSQL instance running that matches the credentials in `.env` or use Docker just for the database.

---

## Technology Choices & Reasoning

- Backend:

  - Tech: NestJS 11 + TypeScript

  - Why: Modular architecture, first-class TypeScript support, built-in DI & validation.

- Database ORM:

  - Tech: Sequelize

  - Why: Mature, feature-rich ORM that integrates well with Postgres and supports TypeScript decorators via sequelize-typescript.

- Auth:

  - Tech: JWT (via @nestjs/jwt) + BCrypt

  - Why: Stateless authentication & secure password hashing.

- Frontend:

  - Tech: Next.js 14 (App Router, Turbopack)

  - Why: File-system routing, React 18, fast dev server, SEO-friendly.

- Containerisation:

  - Tech: Docker & Docker Compose

  - Why: Simplifies onboarding; reproducible dev & prod environments.

- Database:

  - Tech: PostgreSQL 16

  - Why: Open-source, reliable relational DB; strong JSON & indexing support.

## What I Would Improve With More Time

- Add unit, integration & e2e test suites (Jest + Supertest + Playwright).
- Add params to swagger docs.
- CI/CD pipeline (GitHub Actions ➜ Docker registry ➜ cloud hosting).
- adding payment gateway (e.g. Stripe).
- Role-based access control and fine-grained permissions.
- Adding real-time notifications (e.g. WebSockets).
- Adding email notifications (e.g. SendGrid).
- Adding loaders for better experience.
- Adding sorting for better experience.
- Adding search for better experience.

---

## Assumptions

- Users authenticate via JSON Web Tokens included in the `Authorization: Bearer <token>` header.
- Minimal error handling for brevity – client should handle non-200 responses.
- Dates are sent and stored in ISO 8601 UTC strings.
- Pagination defaults to `page=1&limit=20` when omitted.
- using transaction for events and rsvps.
- .env files uploaded for running the project easily.

---

## API Endpoint Documentation

The API is prefixed with `/events/v1` (e.g. `http://localhost:3000/events/v1`). All responses are JSON.

### Auth

| Method | Endpoint         | Body (JSON)                                             | Response                      |
| ------ | ---------------- | ------------------------------------------------------- | ----------------------------- |
| GET    | `/auth/me`       | `Authorization: Bearer <token>`                         | 200 OK `{ user }`             |
| POST   | `/auth/register` | `{ "email": "user@example.com", "password": "secret" }` | 201 Created `{ user, token }` |
| POST   | `/auth/login`    | `{ "email": "user@example.com", "password": "secret" }` | 200 OK `{ user, token }`      |
| POST   | `/auth/logout`   | `Authorization: Bearer <token>`                         | 200 OK                        |

### Events

| Method | Endpoint           | Description                 | Auth Required |
| ------ | ------------------ | --------------------------- | ------------- |
| GET    | `/events`          | List events (paginated).    | no            |
| GET    | `/events/my`       | List my events (paginated). | yes           |
| GET    | `/events/:id/rsvp` | RSVP to my event.           | yes           |
| GET    | `/events/:id`      | Retrieve single event.      | no            |
| GET    | `/me`              | Retrieve single event.      | no            |
| GET    | `/events/rsvp/my`  | Retrieve my RSVPs.          | yes           |
| POST   | `/events`          | Create event.               | yes           |
| POST   | `/events/:id/rsvp` | RSVP to event.              | yes           |
| DELETE | `/events/:id/rsvp` | Un-RSVP to event.           | yes           |

#### Endpoint Details

Below is an expanded description of every REST endpoint outlined above. All endpoints are prefixed with `/events/v1`.

##### Auth

- **`GET /auth/me`** – Returns the currently authenticated user’s profile.

  - Headers: `Authorization: Bearer <token>`
  - Response: `{ id, email, createdAt, updatedAt }`

- **`POST /auth/register`** – Registers a new account.

  - Body: `{ email: string, password: string, name: string, phoneNumber: string starts wit + }`
  - Response: `{ user, token }`

- **`POST /auth/login`** – Logs a user in and returns a JWT.

  - Body: `{ email: string, password: string }`
  - Response: `{ user, token }`

- **`POST /auth/logout`** – Invalidates the JWT on the client (stateless on the server).
  - Headers: `Authorization: Bearer <token>`
  - Response: `200 OK`

##### Events

- **`GET /events`** – Public list of upcoming events.

  - Query params: `page` (default `1`), `limit` (default `20`).
  - Response: `{ data: Event[],  total, page, totalPages, limit }`

- **`GET /events/my`** – Events created by the authenticated user.

  - Requires auth header.
  - Same pagination as above.

- **`GET /events/:id`** – Retrieves a single event by ID.

  - Returns `404` if not found.

- **`POST /events`** – Creates a new event.

  - Headers: auth.
  - Body example:
    ```jsonc
    {
      "title": "CascadeConf 2025",
      "description": "Agentic AI conference in Silicon Valley.",
      "location": "San Jose, CA",
      "date": "2025-09-12T09:00:00Z",
      "maxAttendees": 100
    }
    ```
  - Response: `201 Created { event }`

- **`GET /events/:id/rsvp`** – Lists RSVPs for an event you own.

  - Only accessible to the event owner.
  - Response: `Rsvp[]`

- **`POST /events/:id/rsvp`** – RSVP to an event.

  - Auth required.
  - Response: `201 Created`

- **`DELETE /events/:id/rsvp`** – Cancel your RSVP.

  - Auth required.
  - Response: `204 No Content`

- **`GET /events/rsvp/my`** – Lists all events the user has RSVPed to.
  - Auth required.
  - Response: `Event[]`

> 📖 Not full Swagger/OpenAPI documentation is available once the backend is running at
> `http://localhost:3000/api-docs`.

---

Happy hacking! 👍
