# SmartCart

SmartCart is a full-stack, AI-ready marketplace where buyers watch prices react to real-time demand signals while sellers control inventory and receive pricing insights.

## Features
- **Live catalog** – React + Redux polls the API for fresh item data and pushes real-time cart interactions.
- **Dynamic pricing engine** – Every view, cart add, or inventory change runs a tunable formula that logs to Prisma `PricingHistory`.
- **Buyer journey** – Browse, inspect product details with pricing history, manage cart, and complete checkout.
- **Seller workflow** – Dashboard KPIs, item management, and analytics placeholders wired for future charts + AI insights.
- **Extensible AI hooks** – OpenAI service stub ready for insights once an API key is configured.

## Tech Stack
- **Frontend**: Vite, React 18, React Router, Redux Toolkit, Axios.
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL (swap provider if needed), JSON Web Tokens, bcrypt.
- **Tooling**: Nodemon, Vite dev server, OpenAI Node SDK (stubbed).

## Project Structure
```
├── client
│   ├── src
│   │   ├── api (axios helpers)
│   │   ├── components (UI building blocks)
│   │   ├── pages (buyer + seller views)
│   │   ├── slices (Redux Toolkit)
│   │   └── store (global state)
│   ├── index.html
│   └── package.json
├── server
│   ├── src
│   │   ├── app.js / server.js (Express entry)
│   │   ├── config (Prisma client)
│   │   ├── controllers / routes / services / middleware
│   │   ├── pricing (dynamic engine)
│   │   └── prisma/schema.prisma
│   ├── .env.example
│   └── package.json
└── README.md
```

## Dynamic Pricing Engine
Located at `server/src/pricing/dynamicPricing.js`:
- `calculateDynamicPrice(currentPrice, inventoryLevel, demandScore, timeFactor)` applies demand, inventory, and time weights, then clamps values to +/-15% of the base price.
- `applyDynamicPricing` persists the new price, writes an entry to `PricingHistory`, and is invoked whenever an item is viewed, added to a cart, or inventory shifts (new listing, updates, checkout deductions).
- `pricingService` orchestrates the triggers and keeps `views` & `cartAdds` counters in sync for richer demand scoring.

## Running the Backend
1. **Install dependencies**
   ```bash
   cd /Users/anirudh/Documents/CIS\ 1962/Final\ Project/server
   npm install
   ```
2. **Configure environment**
   ```bash
   cp .env.example .env
   # edit DATABASE_URL, JWT_SECRET, optional OPENAI_API_KEY
   ```
3. **Prisma setup**
   ```bash
   npx prisma generate --schema src/prisma/schema.prisma
   npx prisma migrate dev --schema src/prisma/schema.prisma --name init
   ```
4. **Start the API**
   ```bash
   npm run dev
   ```
   Express listens on `PORT` (default `5000`) and exposes `/auth`, `/items`, `/cart`, `/orders`, `/pricing` plus `/health`.

## Running the Frontend
1. ```bash
   cd /Users/anirudh/Documents/CIS\ 1962/Final\ Project/client
   npm install
   npm run dev
   ```
2. Vite serves on `http://localhost:5173` with a dev proxy to the API (configure `VITE_API_URL` if desired).

## Prisma & Database Workflow
- Models include `User`, `Item`, `Inventory`, `Cart`, `CartItem`, `Order`, and `PricingHistory` with owner relationships.
- Default schema targets PostgreSQL. For MySQL, change the `provider` field inside `server/src/prisma/schema.prisma` and update `DATABASE_URL`.
- Helpful commands:
  - `npm run prisma:generate`
  - `npm run prisma:migrate`
  - `npm run prisma:deploy` (deploy migrations in CI/prod)
- Transactions wrap critical flows like checkout to keep inventory, carts, and pricing history consistent.

## OpenAI Integration
- Stub located at `server/src/services/openaiService.js`.
- Set `OPENAI_API_KEY` inside `.env` to enable the real client.
- TODOs mark where to replace the mock response with `await openai.responses.create(...)`.
- Frontend hits `/pricing/insights/:itemId` for seller dashboards.

## Milestones
1. **MVP Infrastructure** – Express API, Prisma schema, Vite client, Redux store, auth/cart/order flows (done).
2. **Data & Pricing Fidelity** – Seed scripts, advanced demand heuristics, background schedulers.
3. **AI Insights GA** – Wire OpenAI requests, cache responses, surface confidence scores.
4. **Observability** – Metrics around pricing adjustments, cart conversion, inventory health.
5. **Production Hardening** – CI/CD, containerization, rate limiting, e2e tests.

Happy building! 🚀
