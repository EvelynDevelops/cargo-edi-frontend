# Cargo EDI Frontend

A web application for generating and decoding EDI (Electronic Data Interchange) messages for cargo shipments, built with Next.js and TypeScript.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. Configure environment variables:
   ```bash
   # Copy the sample environment file
   cp .env.sample .env
   ```
   The `.env.sample` file contains example configurations:
   ```
   # Choose one of these API URLs based on your needs:
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000        # For local development
   # NEXT_PUBLIC_API_URL=https://cargo-edi-backend.onrender.com  # For production
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm run dev
   ```
   The application will be available at `http://localhost:3000`

## System Requirements

- Node.js 18.x or later
- npm 9.x or later (or pnpm)

## Project Structure

```
cargo-edi-frontend/
├── app/             # Next.js pages and routing
├── components/      # React components
├── hooks/           # Custom React hooks
├── services/        # API services
├── types/           # TypeScript type definitions
└── utils/          # Utility functions
```

## Features

- Generate EDI messages from cargo information
- Decode existing EDI messages to human-readable format
- Download EDI messages as files
- Copy EDI content to clipboard
- Real-time validation
- Support for multiple cargo items

## Key Dependencies

- Next.js 14 - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- React Hook Form - Form handling
- Zod - Schema validation

## Production Build

Build and start the production server:
```bash
npm run build
npm start
```

## Possible Improvements

### Testing
- Add more unit tests for components and util functions

### Features
- Add support for more EDI message types
- Add history of generated/decoded EDI messages

### UI/UX
- Add loading indicators for API calls
- Implement better error handling UI

### Performance
- Add caching for API responses
- Implement lazy loading for non-critical components

### Code Quality
- Extract common form logic into reusable hooks
