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
│   ├── forms/      # Form-related components
│   ├── shared/     # Shared UI components
│   └── edi/        # EDI-specific components
├── hooks/           # Custom React hooks
├── services/        # API services
├── types/           # TypeScript type definitions
└── utils/          # Utility functions
```

## Key Dependencies

- Next.js 14 - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- React Hook Form - Form handling
- Zod - Schema validation
- Jest & React Testing Library - Testing


## Features

- Generate EDI messages from cargo information
- Decode existing EDI messages to human-readable format
- Download EDI messages as files
- Copy EDI content to clipboard
- Real-time validation
- Support for multiple cargo items
- Responsive design for mobile and desktop


## Development

### Running Tests
```bash
npm test
# or
pnpm test
```


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
- Add support for more EDI message types
- Add history of generated/decoded EDI messages

### UI/UX
- Add loading indicators for API calls
- Implement better error handling UI

### Code Quality
- Extract common form logic into reusable hooks
