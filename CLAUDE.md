# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server with HMR.
- `npm run build` — production build to `dist/`.
- `npm run preview` — serve the built bundle locally.
- `npm run lint` — run ESLint (flat config in `eslint.config.js`) over the repo.

There is no test framework wired up; do not invent a `test` script.

## Architecture

This is the **frontend SPA** for Smash Gym, a gym-management app. The Express/Node backend lives in a separate repo and is consumed over HTTP at `https://smash-gym-server-rrsoft.vercel.app/api` (hardcoded in `src/utils/AxiosInstance.js`; the localhost URL for backend dev is commented above it). UI copy is in Spanish.

Stack: React 18 + Vite, React Router v6, Tailwind (custom `font-jaro` family), axios, chart.js / react-chartjs-2, xlsx (Excel export), react-webcam. Font Awesome and the Jaro Google font are pulled in via `<link>` tags in `index.html`, not npm.

### Routing and auth flow

- `src/App.jsx` mounts `<Router>` → `<AuthProvider>` → `<Routes>`. The order matters: `AuthContext` uses `useNavigate`, so it must sit inside the Router.
- `src/utils/AuthContext.jsx` owns the auth state. `login(token, rol)` persists both to `localStorage` and navigates to `/dashboard`; `logout()` clears them and navigates to `/`. The "verify token on load" effect is intentionally a no-op — presence of a token in `localStorage` is treated as authenticated. There is no client-side token validation/expiry check.
- `src/components/AuthGuard.jsx` wraps every protected route and redirects to `/` when `isAuthenticated` is false. Adding a new authenticated page means: create the page in `src/pages/`, then register the route in `App.jsx` wrapped in `<AuthGuard>`.
- `src/components/Login.jsx` is the **only** place that calls the backend with raw `axios` (it hits `/auth/login` directly to obtain the token). Every other call goes through `axiosInstance`.

### API access

- Always import from `src/utils/AxiosInstance.js` for authenticated requests. Its request interceptor injects `Authorization: Bearer <token>` from `localStorage`. Do not re-create axios instances or call `axios` directly inside components.
- Backend route conventions observed in the codebase: `/auth/*` (login, registerUser, getEmployees, update/:id, removeEmployee/:id, addShift, remove/:id), `/clients/*` (getAll, addNew, tryDay/:ci, remove/:id), `/memberships/*` (getAll, addNew, remove/:id), `/attendances/*` (register, getTodays), `/reports/*` (membershipsReport, attendancesReport, clientReport/:ci, membershipsBayDateReport, attendancesByDateReport). Note the typo `membershipsBayDateReport` — the backend uses that exact spelling.

### Role-based UI gating

Destructive actions (delete buttons, employee management) are gated client-side by reading `localStorage.getItem("rol")` and checking `userRole === "admin" || userRole === "sistemas"`. This pattern is duplicated in `ClientsPage`, `MembershipsPage`, `EmployeesPage`, and `AddEmployeesPage`. When adding new restricted UI, follow the same inline check rather than introducing a new abstraction — the backend is the actual authorization boundary.

### Page composition pattern

Each entity page (`Clients`, `Memberships`, `Employees`, etc.) follows the same shape: fetch list on mount → local search/filter state → table with action buttons that open separate modal components (`Add*Modal`, `*DetailModal`, `Edit*`, `Delete*`) located in `src/components/`. Modals receive an `onClose` callback and (when relevant) an `id`/`clientId` prop, and own their own form state and API calls.

### Deployment

- `public/_redirects` contains `/* /index.html 200` — Netlify-style SPA rewrite. Preserve this when deploying anywhere that respects `_redirects`, or supply the equivalent rewrite rule for other hosts.
- The hardcoded production API URL means swapping environments requires editing `AxiosInstance.js` (no env-var plumbing exists today).
