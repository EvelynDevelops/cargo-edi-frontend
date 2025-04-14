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
   
   Create a new `.env` file and copy the contents from the `.env.sample` file into it.
   The `.env.sample` file contains example configurations that you can modify according to your needs.

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


## Key Dependencies

- Next.js 14 - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- React Hook Form - Form handling
- Zod - Schema validation
- Jest & React Testing Library - Testing


## Development

## Production Build

Build and start the production server:
```bash
npm run build
npm start
```

## Possible Improvements

### Testing
- Add more unit tests for components and util functions
- Add integration tests for form submissions
- Add end-to-end tests for critical user flows

### Features
- Implement form state persistence to prevent data loss on page refresh
- Add ability to save and load form templates

### UI/UX
- Add form state recovery after accidental page refresh
- Implement auto-save functionality for form data

### Code Quality
- Extract common form logic into reusable hooks
- Implement form state management with local storage or session storage
