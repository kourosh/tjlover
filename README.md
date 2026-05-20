# Trader Lover

A fan site for lovers of Trader Joe's and its products. Users can browse products, search the catalog, and rate items with a star rating.

## Features

- **Product catalog** — browse products with images and descriptions
- **Randomized homepage carousel** — three unique products displayed on each visit
- **Fuzzy search** — find products without knowing the exact name
- **Star ratings** — logged-in users can rate products (one rating per user per product); ratings are averaged and displayed
- **User accounts** — register, log in, and log out
- **Forgot password flow** — sends a reset link via SendGrid (token expires in 1 hour)
- **Admin page** — add new products at `/admin`
- **Amazon affiliate links** — product pages link to Amazon where applicable

## Tech Stack

- **Backend:** Node.js, Express
- **Templating:** EJS with ejs-locals (layouts)
- **Database:** SQLite (development), PostgreSQL (production)
- **ORM:** Sequelize v2
- **Auth:** Passport.js with passport-local, bcryptjs, cookie-session
- **Email:** SendGrid
- **Frontend:** Bootstrap 3, jQuery

## Getting Started

### Prerequisites

- Node.js
- npm

### Install dependencies

```bash
npm install --legacy-peer-deps
```

### Environment variables

Create a `.env` file or export these before starting the server:

| Variable | Description |
|---|---|
| `SENDGRID_API_KEY` | Your SendGrid API key (required for password reset emails) |
| `FROM_EMAIL` | Verified sender address in your SendGrid account |
| `BASE_URL` | Base URL of the site (default: `http://localhost:3000`) |
| `PORT` | Port to listen on (default: `3000`) |
| `DATABASE_URL` | PostgreSQL connection string (production only) |

### Run locally

```bash
node app.js
```

Then open [http://localhost:3000](http://localhost:3000).

## Adding Products

**Via the admin page:** visit `/admin` while the server is running.

**Via a seed script:**

```bash
node scripts/insert-mandarin-orange-chicken.js
```

Seed scripts live in `scripts/` and follow the same pattern — copy any existing one and update the product details.

## Project Structure

```
app.js              # Express app and all routes
models/             # Sequelize models (User, Product, Rating)
views/              # EJS templates
public/             # Static assets (CSS, JS, images)
migrations/         # Sequelize schema migrations
scripts/            # One-off seed scripts for inserting products
config/             # Database config (SQLite dev, Postgres prod)
```
