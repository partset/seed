# Team Web Development Best Practices

## Purpose

This document defines the standards our team follows when building web applications. The goal is to keep our codebase consistent, maintainable, and easy for every team member to understand.

This guide helps ensure that:

- Developers know where code should live
- The codebase stays organized as the project grows
- Code reviews are consistent and objective
- New developers can quickly understand how our system works

This document should be treated as a **living guide** and can evolve as the team improves its practices.

---

# 1. Team Philosophy

Our engineering decisions should follow these principles:

- Prefer **clarity over cleverness**
- Prefer **simple solutions first**
- Do **not over‑engineer prematurely**
- Optimize for **readability and maintainability**
- Keep code **focused on one responsibility**
- Extract reusable patterns **only after repetition is real**

A good rule of thumb:

> First make it work clearly, then extract once repetition is real.

---

# 2. Git Workflow

## Branch Naming

Branches should follow this format:

```
type/description
```

Descriptions should use **kebab‑case**.

Example:

```
feat/user-auth
fix/login-validation
chore/update-dependencies
```

Common branch types include:

- feat
- fix
- chore

These are common examples, but the team may use others when appropriate.

## Branch Strategy

- The main development branch is **dev**
- The **prod** branch is used only after testing has been completed
- Developers should normally branch from **dev**
- Any exceptions should be discussed beforehand

## Pull Requests

Every change must go through a **Pull Request** so the team can review the code.

A PR must include:

- A description of the change
- Testing instructions

PR size is not restricted, but developers should aim to keep changes understandable.

## Commit Messages

Commits should follow a clear format:

```
feat: add login endpoint
fix: handle empty email
chore: update dependencies
```

Commits can stay short. If the change is complex, additional explanation should be added in the **PR description**.

---

# 3. Frontend Architecture (React + Vite)

## Folder Structure

```
src/
  assets/
  components/
  constants/
  hooks/
  pages/
  services/
  types/
  utils/
```

### Folder Responsibilities

**pages**

Route‑level screens.

**components**

Reusable UI elements and building blocks.

**hooks**

Custom React hooks.

**services**

API logic and external communication.

**utils**

Helper functions and convenience utilities.

**types**

Shared TypeScript types.

**constants**

Static values used throughout the application.

---

# 4. Component Design

## Naming Conventions

Components and pages should use **PascalCase**.

Examples:

```
LoginPage
UserCard
DashboardLayout
```

Helper files should use **lower camel case**.

Example:

```
webHook.ts
```

The filename should match the component name.

## Component Responsibility

Each component should ideally:

- Handle a **single responsibility**
- Remain small and easy to understand

Large components should be broken into smaller components.

Example:

```
components/
  Calendar/
    Calendar.tsx
    CalendarGrid.tsx
    CalendarDate.tsx
```

This keeps logic simple and maintainable.

## Reusable Components

A component should become reusable if the same UI pattern appears **more than two times**.

Good process:

1. Build the first version clearly
2. Confirm repetition exists
3. Extract the shared component

Avoid creating overly generic components prematurely.

---

# 5. State Management

Developers should follow these rules when working with state.

### Use Local State First

If only one component needs the data, use **local component state**.

Example:

```tsx
function PasswordField() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <button onClick={() => setShowPassword((prev) => !prev)}>
      Toggle Password
    </button>
  );
}
```

### Use Context for Shared State

If data is used in multiple areas or needs to persist across several components, use **Context**.

### Lift State When Necessary

State should be lifted when multiple child components require the same data.

Example:

```tsx
function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <SearchResults searchTerm={searchTerm} />
    </>
  );
}
```

---

# 6. API Layer (Frontend)

All API calls should be placed in the **service layer**, not scattered across components.

Example structure:

```
services/
  api/
    users/
      login/
        api.ts
```

Example API function:

```ts
export async function loginUser(email: string, password: string) {
  try {
    const response = await login(email, password);
  } catch (error) {
    handleError(error);
  }
  return response.data;
}
```

Components should call service functions rather than making raw API requests.

---

# 7. Backend Architecture (Node + Express)

## Folder Structure

```
src/
  config/
  controllers/
  middleware/
  routes/
  services/
  utils/
  validators/
```

Each file should ideally have **one responsibility**.

Example:

```
controllers/auth/login.js
```

---

# 8. Backend Layer Responsibilities

## Routes

Routes should remain **thin**.

They should only define endpoints and attach middleware.

Example:

```js
router.post("/login", validateLogin, loginController);
```

## Controllers

Controllers should:

- Receive the request
- Call validation/service logic
- Return the response

Example:

```js
async function loginController(req, res) {
  try {
    const result = await loginService(req.body);
    return res.json({ success: true, data: result, error: "" });
  } catch (error) {
    handleError(error);
  }
}
```

Controllers should **not contain complex business logic**.

## Services

Services contain the application's **business logic**.

Examples of business logic:

- authentication decisions
- calculations
- permission checks
- database coordination

Example:

```js
async function loginService({ email, password }) {
  const user = await userModel.findByEmail(email);

  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) throw new Error("Invalid credentials");

  return generateToken(user);
}
```

---

# 9. Middleware

Middleware should be used for cross‑cutting concerns.

Examples include:

- authentication checks
- request validation
- centralized error handling
- request logging

Validation should run **before controller logic** whenever possible.

Example:

```js
router.post("/login", validateLogin, loginController);
```

---

# 10. Validation

Each feature may have a dedicated validation file.

Example:

```
validators/auth/login.js
```

Example validation middleware:

```js
function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, data: {}, error: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ success: false, data: {}, error: "Password is required" });
  }

  next();
}
```

---

# 11. Error Handling

Backend code should use **try/catch** and forward errors to a centralized handler.

Technical errors should remain internal, while the frontend receives **safe, user‑friendly messages**.

Example centralized error handler:

```js
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  console.error(err);

  return res.status(statusCode).json({
    success: false,
    data: {},
    error: message,
  });
}
```

User‑facing messages should come from a centralized message file.

---

# 12. API Response Format

All responses should follow a consistent structure.

### Success

```json
{
  "success": true,
  "data": {},
  "error": ""
}
```

### Error

```json
{
  "success": false,
  "data": {},
  "error": "Invalid email or password"
}
```

---

# 13. Testing Expectations

Testing should scale with the **importance of the feature**.

### Minimal Testing

Non‑critical components may rely on manual testing.

PRs must include **manual testing instructions**.

### Extensive Testing

Critical features should have automated tests.

Critical features include:

- authentication
- payments
- database writes
- delete actions
- security‑related logic

Bug fixes should include regression tests when possible.

Testing tools may be decided later.

---

# 14. Code Style

Code formatting should use **Prettier**.

Console logs:

- Allowed in **dev**
- Must be removed before merging to **prod**

---

# 15. Code Review

## Reviewer Focus

Reviewers should evaluate:

- main scenarios
- edge cases
- readability
- duplication
- correct folder placement
- naming consistency
- missing loading/error states

Review comments should be categorized as:

- required changes
- suggestions
- questions

Developers should notify the team once review feedback has been addressed.

---

# 16. README Requirements

Each project should include a clean README containing:

- setup instructions
- required environment variables
- how to run the frontend
- how to run the backend
- how to run tests

An `.env.example` file should be provided.

---

# 17. Security

Secrets must always be stored in **.env** files.

`.env` files must be **ignored by git**.

---

# 18. When You Are Unsure

Developers should ask themselves:

- Is there already a pattern for this in the codebase?
- Which layer should this logic live in?
- What happens if this request fails?
- Does this feature require loading or empty states?
- Has this UI or logic appeared more than twice?
- Could another developer understand this file quickly?

Following these questions helps maintain consistency across the team and reduces confusion.

---

# Conclusion

These guidelines exist to help the team write code that is:

- consistent
- maintainable
- easy to review
- beginner‑friendly

The goal is not perfection but **clear, maintainable software that the entire team can understand and improve together**.
