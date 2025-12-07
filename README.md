# SmartCart

## Introduction
SmartCart is a full-stack marketplace. Buyers can browse a live catalog, filter by price or search, view product details with price history, add to cart, and check out. Sellers can publish listings, see their listings on the inventory page, view price history, and observe dynamic price changes driven by demand. The catalog is seeded from a public Kaggle electronics dataset (Amazon India) to provide real-world product names, categories, ratings, and prices as a starting point.

## Tech Stack
- **Frontend**: Vite, React 18, React Router, Redux Toolkit, Axios, Tailwind utility classes (via styles.css).
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL.
- **Tooling**: Nodemon, Vite dev server, Prisma CLI.

## Usage (install and use)
1) **Install dependencies**
```bash
cd /Users/anirudh/Documents/CIS\ 1962/Final\ Project
cd server && npm install
cd ../client && npm install
```
2) **Configure backend**
```bash
cd /Users/anirudh/Documents/CIS\ 1962/Final\ Project/server
cp .env.example .env                # set DATABASE_URL, PORT (e.g., 5001)
npx prisma migrate dev --schema src/prisma/schema.prisma --name init
npx prisma generate --schema src/prisma/schema.prisma
```
3) **Start backend (keep it running)**
```bash
PORT=5001 npm run dev   # choose a port; remember it for the frontend
```
4) **Start frontend (new terminal)**
```bash
cd /Users/anirudh/Documents/CIS\ 1962/Final\ Project/client
echo "VITE_API_URL=http://localhost:5001" > .env.local   # match backend port
npm run dev
```
5) **Open the app**
- Visit `http://localhost:5173`.
- Browse/filter, view details + price history, add to cart, checkout.
- Inventory: “Inventory” tab → enter title/description/base price (₹)/inventory → publish; your listings show below with remove.
- Orders: “Orders” tab to see past checkouts.
- Seller dashboard: select a product to view price history and metrics.

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
- `calculateDynamicPrice(currentPrice, inventoryLevel, demandScore, timeFactor)` applies demand, inventory, and time weights, then clamps to 95%–130% of base price (current tuning).
- `applyDynamicPricing` persists the new price and logs `PricingHistory`.
- Triggers: item views (including product detail), cart adds (price locked in cart), inventory changes (create/update/checkout). Idle decay gently lowers prices over time.


## Prisma & Database Workflow
- Models include `User`, `Item`, `Inventory`, `Cart`, `CartItem`, `Order`, and `PricingHistory` with owner relationships.
- Default schema targets PostgreSQL. For MySQL, change the `provider` field inside `server/src/prisma/schema.prisma` and update `DATABASE_URL`.
- Helpful commands:
  - `npm run prisma:generate`
  - `npm run prisma:migrate`
  - `npm run prisma:deploy` (deploy migrations in CI/prod)
- Transactions wrap critical flows like checkout to keep inventory, carts, and pricing history consistent.
Happy building! 🚀
