# HMS Frontend Application

This directory contains the user interface for the Hospital Management System. It is a modern, blazing-fast Single Page Application (SPA) built with React, TypeScript, and Vite.

## 🚀 Tech Stack Highlights

- **React 19:** Utilizing the latest React features and concurrent rendering.
- **TypeScript:** Enforcing static typing for highly reliable, maintainable code.
- **Vite:** Next-generation frontend tooling providing lightning-fast Hot Module Replacement (HMR) and optimized production builds.
- **Material UI (MUI) v9:** A robust, customizable component library following Material Design principles, styled with Emotion.
- **Redux Toolkit:** The official, opinionated, batteries-included toolset for efficient Redux state management.
- **React Router DOM v7:** Declarative routing for React applications.
- **Axios:** Promise-based HTTP client for making API requests to the backend microservices (via the API Gateway).

## 📂 Project Structure

```text
frontend/
├── public/              # Static assets (favicon, images, etc.) that skip Vite's build pipeline
├── src/
│   ├── assets/          # Project assets (images, global CSS/SCSS)
│   ├── components/      # Reusable, stateless UI components (Buttons, Modals, Cards)
│   ├── features/        # Feature-based modules (e.g., Auth, Patients, Appointments)
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Page layout wrappers (Sidebar, Header, Footer)
│   ├── pages/           # Route-level components
│   ├── services/        # API calls (Axios instances, RTK Query)
│   ├── store/           # Redux store configuration and root reducers
│   ├── types/           # Global TypeScript definitions and interfaces
│   ├── utils/           # Helper functions and formatters
│   ├── App.tsx          # Root React component
│   └── main.tsx         # Application entry point
├── index.html           # Main HTML template
├── package.json         # Project metadata and dependencies
├── tsconfig.json        # TypeScript compiler configuration
└── vite.config.ts       # Vite bundler configuration
```

## ⚙️ Setup & Installation

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+ recommended) installed on your machine.

### Local Development

1. **Install Dependencies**
   Navigate to the `frontend` directory and run:
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy the `.env.example` file to `.env` and update it with your local configurations (e.g., the URL for the Backend API Gateway).
   ```bash
   cp .env.example .env
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The application will start, typically accessible at `http://localhost:5173`. Vite will instantly reflect any file changes.

### Production Build

To compile the application for production, run:
```bash
npm run build
```
This command runs the TypeScript compiler and then Vite's build process, outputting static, minified assets into the `dist/` directory.

You can preview the production build locally using:
```bash
npm run preview
```

## 🐳 Docker Support

The frontend is fully containerized. A multi-stage `Dockerfile` is provided that builds the Vite application and serves the static files using a lightweight Nginx web server.

When running `docker-compose up` from the project root, the frontend will be built and exposed on port `3000`.

## 🎨 UI/UX Guidelines

- **Component Driven:** Build components in isolation. Keep them small, reusable, and focused on a single responsibility.
- **Theming:** Use the MUI `ThemeProvider` to maintain consistent colors, typography, and spacing across the app. Avoid hardcoding styles.
- **State Management:** Use local component state (via `useState`) for UI-specific state. Use Redux Toolkit for global, shared data (e.g., authenticated user details, loaded patients list).
