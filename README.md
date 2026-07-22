# MAALAA FURNITURES Frontend

Furniture e-commerce storefront built with Next.js 16, TypeScript, and Tailwind CSS. Connected to the FastAPI backend at `http://127.0.0.1:8002`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Make sure the backend is running at [http://127.0.0.1:8002/docs](http://127.0.0.1:8002/docs).

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

## API integration

The frontend talks to these backend endpoints:

| Feature | Endpoint |
| ------- | -------- |
| Sign up | `POST /api/v1/auth/signup` |
| Sign in | `POST /api/v1/auth/login` |
| Profile | `GET /api/v1/profile` |
| Categories | `GET /api/v1/categories` |
| Category detail | `GET /api/v1/categories/{slug}` |
| Products by category | `GET /api/v1/categories/{slug}/products` |
| All / featured products | `GET /api/v1/products` |
| Product detail | `GET /api/v1/products/{slug}` |
| Cart | `GET /api/v1/cart` |
| Add to cart | `POST /api/v1/cart/items` |
| Product inquiry | `POST /api/v1/enquiries` |

When the API returns empty data or is unreachable, the app falls back to mock data in `src/lib/mock-data.ts`.

## Environment variables

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8002/api/v1
```

## Project structure

```
src/
├── app/                  # Routes (App Router)
├── components/
│   ├── auth/             # Login & register forms
│   ├── ui/               # Button, Input, Card, Badge
│   ├── layout/           # Header, Footer
│   ├── product/          # ProductCard, ProductGrid
│   └── cart/             # CartItem, CartSummary
├── hooks/                # useAuth, useCart
├── lib/
│   ├── api.ts            # Server-side data fetching
│   ├── api-client.ts     # HTTP client
│   ├── auth-api.ts       # Auth & cart API calls
│   └── mappers.ts        # API → frontend type mappers
├── store/                # Zustand auth & local cart
└── types/                # TypeScript interfaces
```

## Auth & cart behaviour

- **Guest users** — cart stored locally in the browser.
- **Signed-in users** — cart synced with the backend via JWT. Add-to-cart calls the API; cart totals come from the server.
