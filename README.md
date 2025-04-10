# Cargo EDI Generator (Frontend)

This is the frontend of the Cargo EDI Generator project, built with **Next.js + TypeScript**. It allows users to enter cargo shipment data, validates the input, and sends it to a backend for EDI (Electronic Data Interchange) message generation.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **UI**: Tailwind CSS
- **Deployment**: Vercel

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/cargo-edi-frontend.git
cd cargo-edi-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root folder with the following variable:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

Replace the value with your deployed backend URL (e.g., from Render).

### 4. Run the development server

```bash
npm run dev
```

The app should now be running at [http://localhost:3000](http://localhost:3000).

## Features

- Add and remove multiple cargo items
- Field-level validation with red error indicators
- Alphanumeric-only enforcement for key fields
- EDI generation via backend API
- Clipboard copy and `.edi` file download support
- Responsive UI for all screen sizes

## Deployment

This app is ready for Vercel deployment. Simply connect your GitHub repo to Vercel and define the environment variable `NEXT_PUBLIC_API_URL`.

