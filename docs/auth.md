# Authentication

## Provider: Clerk

This application uses **[Clerk](https://clerk.com/)** for all authentication. Do **NOT** implement any custom authentication logic, roll your own session handling, or use any other auth library (e.g. NextAuth, Auth.js, Lucia).

---

## Setup

The entire app is wrapped in `<ClerkProvider>` in the root layout. This must remain in place for all Clerk components and server helpers to function.

```tsx
// src/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

---

## Middleware

All routes are protected via `clerkMiddleware()` in `src/middleware.ts`. Do **NOT** remove or bypass the middleware.

```ts
// src/middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

---

## Getting the Current User (Server-Side)

Use `auth()` from `@clerk/nextjs/server` to retrieve the current user's `userId` in Server Components, data helpers, and Server Actions.

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();

if (!userId) {
  throw new Error("Unauthorized");
}
```

### Rules

- **ALWAYS** import `auth` from `@clerk/nextjs/server` — never from `@clerk/nextjs`
- **ALWAYS** check that `userId` is present and throw/redirect if it is not
- **NEVER** trust a `userId` passed from the client (URL params, form data, request body) — always resolve it server-side via `auth()`

---

## UI Components

Use Clerk's pre-built components for all auth-related UI. Do **NOT** build custom sign-in, sign-up, or user profile UI.

| Component | Purpose |
|-----------|---------|
| `<SignInButton>` | Triggers sign-in flow (use `mode="modal"`) |
| `<SignUpButton>` | Triggers sign-up flow (use `mode="modal"`) |
| `<UserButton>` | Pre-built user profile / sign-out menu |
| `<SignedIn>` | Renders children only when the user is authenticated |
| `<SignedOut>` | Renders children only when the user is not authenticated |

```tsx
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

<SignedOut>
  <SignInButton mode="modal" />
  <SignUpButton mode="modal" />
</SignedOut>
<SignedIn>
  <UserButton />
</SignedIn>
```

---

## Import Reference

| What | Import from |
|------|-------------|
| `auth()` | `@clerk/nextjs/server` |
| `clerkMiddleware()` | `@clerk/nextjs/server` |
| UI components (`ClerkProvider`, `SignedIn`, `UserButton`, etc.) | `@clerk/nextjs` |
