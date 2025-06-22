# Project Documentation

## Overview

This project is a TV Shows Dashboard built with Vue.js (Composition API), TypeScript, and Tailwind CSS. It fetches data from the TVMaze API and provides an interactive, responsive UI for browsing and searching TV shows by genre, with sorting based on ratings.

Key features:

* **Vue Composition API** for modular, maintainable component logic.
* **TypeScript** for static typing and improved developer experience.
* **Tailwind CSS** for a utility-first, responsive design.
* **Debounced search bar** to efficiently fetch TV show data by name.
* **Genre-based filtering** with horizontal lists of TV shows per genre.
* **Sorting** TV shows by rating within each genre.
* **Vue Test Utils** for unit testing components.
* **Dockerized** development environment to eliminate dependency issues.
* **Hosted on Vercel** for seamless continuous deployment.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Getting Started](#getting-started)
3. [Development](#development)
4. [Testing](#testing)
5. [Docker](#docker)
6. [Deployment](#deployment)
7. [Architecture & Design Decisions](#architecture--design-decisions)
8. [API Integration](#api-integration)
9. [Project Structure](#project-structure)
10. [License](#license)

---

## Prerequisites

* **Node.js** v22.x
* **npm** v8.x (or higher)
* **Docker** (for containerized development)

Ensure you have the correct Node.js version installed. You can use a version manager like [nvm](https://github.com/nvm-sh/nvm) to install Node v22:

```bash
   nvm install 22
   nvm use 22
```

---

## Getting Started

1. **Clone the repository**

```bash
   git clone https://github.com/Sparsh47/vue-assignment.git
````

2. **Install dependencies**
```bash
  npm ci
````

3. **Run the development server**

```bash
   npm run dev
````

4. **Open in browser**
   Navigate to `http://localhost:5173`.

---

## Development

- Source code lives in the `/src` directory.
- Vue components use the Composition API for better logic reuse and type safety.
- Tailwind CSS configuration can be found in `tailwind.config.js`.
- Environment variables and Vite configuration in `vite.config.ts`.

### Notable Features
- **Debounced Search**: The search input uses a 300ms debounce to limit API calls.
- **Genre Filtering**: Shows are fetched and grouped by genre using TVMaze’s show index endpoint.
- **Rating Sort**: Within each genre list, shows are sorted descending by average rating.

---

## Testing

Unit tests are written with Vue Test Utils and Jest.

- **Run tests**
```bash
  npm test
````

* **Test coverage**

```bash
  npm run test\:coverage
````

Ensure tests pass before committing any changes.

---

## Docker

A Dockerfile is provided to containerize the application and avoid dependency issues:

```dockerfile
   FROM node:22-alpine
   WORKDIR /app
   COPY package.json package-lock.json ./
   RUN npm ci
   COPY . .
   EXPOSE 5173
   CMD ["npm", "run", "dev"]
````

### Build & Run with Docker

```bash
# Build the image
  docker build -t tv-dashboard:dev .

# Run the container
  docker run --rm -p 5173:5173 tv-dashboard:dev
```

---

## Deployment

This application is hosted on Vercel for continuous deployment and fast global delivery.

* **Live Demo**: [https://shows-website-alpha.vercel.app/](https://shows-website-alpha.vercel.app/)
* **GitHub Repository**: [https://github.com/Sparsh47/vue-assignment](https://github.com/Sparsh47/vue-assignment)

### Vercel Setup

1. Log in to Vercel and import the GitHub repository.
2. Configure project settings:

   * Root directory: `/`
   * Build command: `npm run build`
   * Output directory: `dist`
3. Add any necessary environment variables in Vercel Dashboard under **Settings > Environment Variables**.
4. Deploy: Vercel will automatically trigger a deployment on every push to `main`.

---

## Architecture & Design Decisions

### Vue Composition API

* Encourages separation of concerns through reusable composables.
* Improves type inference and auto-completion in TypeScript.

### TypeScript

* Provides static type checking, reducing runtime errors.
* Enhances IDE support and developer productivity.

### Tailwind CSS

* Utility-first approach for rapid UI development.
* Customizable design tokens in `tailwind.config.js`.

### Testing with Vue Test Utils

* Focus on unit testing individual components and composables.
* Ensures UI logic works as expected and prevents regressions.

### Dockerization

* Guarantees a consistent development environment across machines.
* Avoids version mismatches and simplifies onboarding.

---

## API Integration

This application uses the [TVMaze API](http://www.tvmaze.com/api):

* **Show Index** endpoint to fetch all shows and derive genre lists.
* **Search** endpoint with debouncing for user-initiated queries.

Data handling:

1. Fetch show index once on load.
2. Extract unique genres and group shows.
3. Sort each genre group by `rating.average`.
4. Filter by genre when navigating between lists.

---
