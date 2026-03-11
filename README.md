# FarmConnect — Digital Farmers Marketplace

A full-stack marketplace connecting farmers directly with consumers. Buy fresh produce, participate in live auctions, and support local agriculture.

## Features

- **Marketplace** — Browse and buy farm-fresh produce by category, location, and price
- **Live Bidding** — Real-time auction system with 5% minimum bid increments
- **Farmer Dashboard** — List products, track orders, manage earnings
- **Consumer Dashboard** — Order history, bid tracking, delivery status
- **Admin Panel** — User approval, product moderation, platform analytics
- **Role-based Access** — Farmer, Consumer, and Admin roles with JWT authentication

## Tech Stack

| Layer      | Technology                              |
|------------|----------------------------------------|
| Frontend   | React 19, Vite, Framer Motion          |
| Backend    | Node.js, Express 5                     |
| Database   | MongoDB with Mongoose                  |
| Auth       | JWT + bcrypt                           |
| Storage    | Local file uploads (Multer)            |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone and install

```bash
git clone <repo-url>
cd Digital-Farmers-Market

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure environment

```bash
# Backend — copy and edit
cp backend/.env.example backend/.env

# Frontend — copy and edit
cp frontend/.env.example frontend/.env
```

### 3. Seed admin account

```bash
cd backend
npm run seed
```

### 4. Run development servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Production Build

```bash
# Build frontend
cd frontend
npm run build

# Start backend (serves frontend from dist/)
cd ../backend
NODE_ENV=production npm start
```

## Project Structure

```
backend/
├── config/         # Database connection
├── controllers/    # Route handlers
├── middleware/      # Auth, error handling, file uploads
├── models/         # Mongoose schemas
├── routes/         # Express routes
├── uploads/        # Product images
└── utils/          # Admin seeder

frontend/
├── public/         # Static assets + favicon
└── src/
    ├── api/        # Axios instance
    ├── components/ # Reusable UI components
    ├── context/    # Auth context
    ├── hooks/      # Custom hooks
    └── pages/      # Route pages
```

## API Endpoints

| Method | Endpoint                        | Auth     | Description              |
|--------|--------------------------------|----------|--------------------------|
| POST   | /api/auth/register             | Public   | Register user            |
| POST   | /api/auth/login                | Public   | Login                    |
| GET    | /api/products                  | Public   | List approved products   |
| GET    | /api/products/:id              | Public   | Product details          |
| POST   | /api/products                  | Farmer   | Create product           |
| POST   | /api/bids                      | Consumer | Place bid                |
| POST   | /api/orders/direct             | Consumer | Direct purchase          |
| GET    | /api/admin/stats               | Admin    | Platform analytics       |
| PUT    | /api/admin/products/:id/approve| Admin    | Approve product          |

## License

ISC
