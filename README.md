# Backend Debugging Challenge

A working NestJS + Prisma + PostgreSQL API with real, reproducible bugs
hiding in it. You have **60 minutes** to find and fix as many as you can.

## Setup

```bash
docker-compose up -d          # starts Postgres on localhost:5432
cp .env.example .env
npm install
npm run prisma:migrate        # creates the schema
npm run seed                  # 500 users, 2000 products, 20k orders
npm run start:dev
```

The API listens on `http://localhost:3000` by default.

## Endpoints

| Method | Path | Notes |
|---|---|---|
| POST | `/users` | create a user |
| GET | `/users` | list users |
| GET | `/products` | list products |
| GET | `/products/search?q=` | search products by name |
| GET | `/products/manual` | returns a product manual text blob |
| GET | `/inventory/:productId` | current stock for a product |
| POST | `/inventory/:productId/reserve` | body: `{ quantity }` |
| POST | `/inventory/:productId/restock` | body: `{ quantity, userId, refundAmount }` |
| POST | `/orders` | body: `{ userId, items: [{ productId, quantity }] }` |
| GET | `/orders` | list orders |
| POST | `/orders/bulk-import` | body: array of `{ userId, totalAmount, status? }` |
| GET | `/reports/sales-by-user?startDate=&endDate=&sortBy=` | aggregate report |
| GET | `/reports/last` | most recently computed report |

## Objective

Find and fix as many bugs as you can in the time box. For each one, write
down:

- what it is and where
- why it matters in production
- a fix
- how you'd verify the fix actually works

Working code that boots and returns correct responses at the end is a
plus, but a well-explained bug you didn't have time to fix is still worth something. Prioritize.
