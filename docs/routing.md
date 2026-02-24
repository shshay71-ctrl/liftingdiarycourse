# Routing

## Route Structure

All application routes live under `/dashboard`. There are no other application routes — the root `/` page is only a landing/marketing page.

```
/dashboard                        # Main dashboard
/dashboard/workout/new            # Create a new workout
/dashboard/workout/[workoutId]    # View/edit a specific workout
```

---

## Protected Routes

All `/dashboard` routes are **protected** and require the user to be authenticated. Route protection is enforced via **Next.js middleware** using Clerk — do NOT implement per-page auth checks as a substitute for middleware.

See [auth.md](./auth.md) for the full middleware setup and Clerk usage rules.

```ts
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

---

## Rules

- **NEVER** add routes outside of `/dashboard` for authenticated app functionality
- **NEVER** rely on per-page `auth()` checks as the sole protection mechanism — middleware is the enforcer
- **ALWAYS** use `auth.protect()` in middleware for `/dashboard(.*)` routes
- Dynamic segments (e.g. `[workoutId]`) must follow the async `params` pattern — see [server-components.md](./server-components.md)
