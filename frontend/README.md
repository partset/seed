# Project Name

## Overview

This project is a full-stack web application built with:

- **Frontend:** React + Vite
- **Backend:** Node.js + Express

The goal of this project is to provide a scalable and maintainable web application while following our team's engineering best practices.

The project separates responsibilities between frontend UI, backend logic, and API communication.

---

# Project Structure

## Frontend

```
src/
│
├── assets/
├── components/
├── constants/
├── hooks/
├── pages/
├── services/
├── types/
└── utils/
```

### Folder Purpose

**components**  
Reusable UI components.

**pages**  
Route-level screens.

**hooks**  
Custom React hooks.

**services**  
API requests and external communication.

**utils**  
Helper functions and convenience utilities.

**types**  
Shared TypeScript types.

**constants**  
Static values used across the application.

---

## Backend

```
src/
│
├── config/
├── controllers/
├── middleware/
├── routes/
├── services/
├── utils/
└── validators/
```

### Folder Purpose

**routes**  
Defines API endpoints.

**controllers**  
Handles request/response flow.

**services**  
Contains business logic and database coordination.

**validators**  
Input validation.

**middleware**  
Cross-cutting logic such as authentication, validation, and error handling.

**utils**  
Shared utility functions.

---

# Setup Instructions

## 1. Clone the Repository

```bash
git clone <repo-url>
cd <project-folder>
```

---

## 2. Install Dependencies

Install dependencies for both frontend and backend.

If the project uses separate folders:

```bash
cd frontend
npm install

cd ../backend
npm install
```

---

# Environment Variables

Create a `.env` file in the backend root.

Example `.env.example`:

```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

⚠️ **Do not commit `.env` files.**  
They are ignored by git.

---

# Running the Application

## Run Frontend

```bash
npm run dev
```

Frontend will usually run at:

```
http://localhost:5173
```

---

## Run Backend

```bash
npm run dev
```

Backend will usually run at:

```
http://localhost:5000
```

---

# Updating Your Local Repository

If you already have the repository cloned but need to update it with the latest changes from GitHub, follow these steps.

## 1. Save or Commit Any Local Changes

Check your current status:

```bash
git status
```

If you have local work you want to keep:

```bash
git add .
git commit -m "chore: save local work"
```

---

## 2. Switch to the Dev Branch

```bash
git checkout dev
```

---

## 3. Pull the Latest Changes

```bash
git pull origin dev
```

---

## 4. Update Your Feature Branch (If You Have One)

```bash
git checkout feat/your-branch-name
git merge dev
```

Resolve any conflicts before continuing development.

---

# Quick Update Workflow

```bash
git checkout dev
git pull origin dev
```

---

# When You Should Update

You should update your local repository:

- Before starting new work
- Before opening a pull request
- After large changes are merged into `dev`
- When your branch falls behind the latest code

---

# Running Tests

Run tests with:

```bash
npm test
```

Critical features such as authentication, database writes, delete actions, and security-related logic should include automated tests.

---

# Development Workflow

## Branching

Branches should follow the format:

```
type/description
```

Examples:

```
feat/user-auth
fix/login-validation
chore/update-dependencies
```

Developers should branch from `dev`.

The `prod` branch is used after testing has been completed.

---

## Pull Requests

All changes must go through a Pull Request.

PRs must include:

- Description of the change
- Testing instructions

---

## Commit Messages

Commits should follow this format:

```
feat: add login endpoint
fix: handle empty email
chore: update dependencies
```

Commits can remain short. If a change is complex, additional explanation should be included in the PR description.

---

# Code Style

- Code formatting uses **Prettier**
- Console logs are allowed in development
- Console logs must be removed before merging into `prod`

---

# Security

- Secrets must be stored in `.env`
- `.env` files must not be committed to git
- User-facing errors should be safe and user-friendly

---

# Questions

When unsure about an implementation:

- Check existing patterns in the codebase
- Ask which layer the logic belongs in
- Consider error states and edge cases
- Ask if the code will likely be reused
- Ensure another developer can understand the file quickly

---

# License

Add your project license here if applicable.
