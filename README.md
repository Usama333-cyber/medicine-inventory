# Medicine Inventory Management System

A client-side pharmacy inventory app for tracking medicine stock and expiry dates. Medicine data is saved in the browser with `localStorage`; no backend is required.

## Features

- Add and edit medicines with validation for required fields, non-negative price and quantity, and expiry date after manufacturing date.
- View the inventory in a responsive table, search by medicine name, and filter by expiry status.
- Sort the inventory by expiry date.
- Color-code medicine rows by status:
  - **Expired:** expiry date is in the past.
  - **Expiring soon:** expiry date is within the next 30 days.
  - **Safe:** expiry date is more than 30 days away.
- Delete a medicine after confirming the action.
- Dashboard cards show total medicines, expired medicines, medicines expiring soon, and low-stock items (quantity below 10).

## Medicine information

Each record contains:

- Medicine name
- Batch number
- Category
- Price
- Quantity in stock
- Manufacturing date
- Expiry date

## Run locally

1. Install [Node.js](https://nodejs.org/) and npm.
2. From the project directory, install dependencies:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

4. Open the local URL printed by Vite in your browser.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create a production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |

## Data storage

The app stores the medicine array in browser `localStorage` under the key `pharmacy_medicines`. Data is specific to the browser profile and app origin; it is not shared across browsers or devices. If no saved data exists, the app initializes with demo medicines. Clearing the browser's site data removes the saved inventory.

## Tech stack

- React
- Vite
- Bootstrap
- Browser `localStorage`
