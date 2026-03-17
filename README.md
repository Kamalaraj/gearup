# GearUp

GearUp is a full-stack tech ordering app built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI components, MongoDB, Mongoose, Zod, Sonner, Nodemailer, and ImageKit.

The flow is simple:

- A customer lands on the app and fills in their details first.
- The customer is saved in MongoDB and then redirected to the product catalog.
- Products can be searched, filtered, paginated, and added to a database-backed cart.
- Cart updates are stored against the same customer.
- The customer checks out with delivery details.
- The order is saved, stock is reduced, the cart is marked as checked out, and an email confirmation is attempted.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style reusable components
- MongoDB with Mongoose
- Zod validation
- Sonner toasts
- Nodemailer for order confirmation mail
- ImageKit for product image uploads

## Project Structure

```text
src/
  app/
    (public)/
      page.tsx
      products/page.tsx
      cart/page.tsx
      checkout/page.tsx
      order-success/page.tsx
    api/
      customers/route.ts
      customers/[id]/route.ts
      products/route.ts
      carts/route.ts
      carts/[id]/route.ts
      carts/[id]/items/[itemId]/route.ts
      orders/route.ts
      orders/[id]/route.ts
  components/
    common/
    forms/
    products/
    cart/
    orders/
    providers/
    ui/
  constants/
  lib/
  models/
  repositories/
  schemas/
  services/
  types/
scripts/
  seed-products.ts
```

## Features

- Customer-first onboarding flow
- MongoDB-backed customer, cart, product, counter, and order models
- Reusable sequence generator for IDs like `USER0001`, `CART0001`, `ORDER0001`, `PROD0001`
- Soft delete fields on the main entities
- Product search, filtering, sorting, and server-side pagination
- Cart add, update, and soft remove flows
- Checkout form with Zod validation
- Order placement with stock deduction
- Order success page with summary
- Email confirmation utility using Nodemailer
- ImageKit-backed product image upload for create and edit
- Delete confirmation modal using AlertDialog

## Environment Variables

Create a `.env.local` file using this example:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/gearup
NEXT_PUBLIC_APP_URL=http://localhost:3000
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_user
SMTP_PASS=your_pass
SMTP_FROM=GearUp <no-reply@gearup.local>
IMAGEKIT_PUBLIC_KEY=public_xxxxx
IMAGEKIT_PRIVATE_KEY=private_xxxxx
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

## Getting Started

1. Install dependencies.

```bash
npm install
```

2. Add your environment variables in `.env.local`.

3. Seed the database with the sample products.

```bash
npm run seed:products
```

4. Start the development server.

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## How the Main Flow Works

### 1. Customer entry

The home page is the first stop. The customer fills in name, email, phone, and address. The app saves that customer in MongoDB, stores the customer id in a cookie, and redirects to the products page.

### 2. Product browsing

The products page supports:

- search by product name
- category filter
- min and max price filtering
- sort by newest, name, or price
- server-side pagination

### 3. Cart

When the customer adds a product, GearUp either creates an active cart or updates the existing one. Quantity changes and removals are persisted in MongoDB. Removals are soft handled on the cart item rather than hard deleted.

### 4. Checkout and order

The checkout page validates delivery details with Zod, creates an order, marks the cart as checked out, reduces stock on the related products, and attempts to send a confirmation email.

### 5. Order success

After a successful order, the customer sees the final order summary and the generated order ID.

## API Summary

- `POST /api/customers`
- `GET /api/customers`
- `GET /api/customers/:id`
- `GET /api/products`
- `GET /api/carts?customerId=...`
- `POST /api/carts`
- `PATCH /api/carts/:id`
- `DELETE /api/carts/:id/items/:itemId`
- `GET /api/orders`
- `POST /api/orders`
- `GET /api/orders/:id`

## Notes

- The project follows a repository and service pattern to keep route handlers thin.
- Queries exclude soft deleted records by default through Mongoose query middleware.
- If SMTP credentials are missing, order placement still succeeds, but the email utility will report that sending was skipped.
- If ImageKit credentials are missing, product image upload will fail until the three ImageKit environment variables are configured.

## Useful Commands

```bash
npm run dev
npm run build
npm run start
```
# gearup
