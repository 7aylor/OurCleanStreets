# 🌎 [OurCleanStreets](https://ourcleanstreets.quest/)

## 🌱 Purpose & Vision

OurCleanStreets (OCS) is a crowdsourcing litter clean up app designed to encourage communities to keep their neighborhoods free of litter and trash. It was made as the capstone project for a Master of Science in Software Engineering degree at Arizona State University. OCS empowers communities to take charge of their environment:

- Quickly view mapping data to determine which areas in your community need cleanup attention
- Track your cleanup activities and contribute to the community map
- Level up as you continue to contribute to your community
- Promote community engagement and cleaner, safer environment for all

Built to support transparency, community action, and environmental awareness.

---

## 🖥️ apps/client — React Frontend

The frontend is a modern, responsive React application featuring:

- React Router for routing
- React Leaflet for interactive mapping
- TailwindCSS for styling

Key features:

- Authentication (login, signup, password reset)
- Report litter by interacting with a real-time map
- Track cleanup activities and view route data
- User dashboard for managing account details
- Unlock achievement the more you clean!

---

## ⚙️ apps/server — Express + Prisma Backend

The backend serves as a secure and scalable REST API built with:

- Express.js
- Prisma ORM
- PostgreSQL
- JWT authentication with refresh tokens
- Zod schema validation

API functionality includes:

- User authentication
- Password reset and profile updates
- Interaction with OpenRouteService for map routing
- Cleanup activity logging
- User achievement calculation

---

## 📦 apps/types — Shared TypeScript Types

This package contains all shared TypeScript interfaces used by the monorepo

---

## 📦 apps/library — Shared Utility Library

All shared functions in the monorepo live here

---

## CI / CD

## 🧑‍💻 Local Development Setup

### Installation

- Download and install the latest LTS version of[NodeJS](https://nodejs.org/en/download) for your Operating System
- Install [pnpm](https://pnpm.io/installation)
- Download or clone the github repo for [OCS](https://github.com/7aylor/OurCleanStreets) `git clone https://github.com/7aylor/OurCleanStreets.git`
- Copy the provided .env files into their respective application root folders. These are environment variables that the application needs at runtime.
- cd into the OCS directory `cd /my/files/ocs`
- At the root of the OCS project, run `pnpm install`
- cd into the OCS server directory `cd ocs/apps/server`
- run `pnpm start`
- in another terminal window, cd into the OCS client directory `cd /ocs/apps/client`
- run `pnpm start`
- Open a web browser and navigate to [http://localhost:5173/](http://localhost:5173/)
- Use the application
