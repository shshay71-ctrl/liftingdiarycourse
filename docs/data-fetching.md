# Data Fetching

## CRITICAL: Server Components Only

ALL data fetching in this application MUST be done via **Server Components**.

- **NEVER** fetch data in Client Components (`"use client"`)
- **NEVER** fetch data via Route Handlers (API routes)
- **NEVER** use `useEffect` + `fetch` patterns
- **NEVER** use SWR, React Query, or any client-side data fetching library

If a component needs data, it must either be a Server Component itself, or receive the data as props passed down from a Server Component ancestor.

## Database Queries: /data Directory

All database queries MUST be encapsulated in helper functions located in the `/data` directory.

- Each file in `/data` should group related queries (e.g., `data/workouts.ts`, `data/exercises.ts`)
- Helper functions MUST use **Drizzle ORM** — do NOT write raw SQL under any circumstances
- Import and call these helpers from Server Components directly

### Example Structure

```
src/
  data/
    workouts.ts
    exercises.ts
    sets.ts
  app/
    dashboard/
      page.tsx  ← Server Component that calls data helpers
```

### Example Helper Function

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

### Example Server Component Usage

```tsx
// src/app/dashboard/page.tsx
import { getWorkoutsForUser } from "@/data/workouts";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  const workouts = await getWorkoutsForUser(session.user.id);

  return <WorkoutList workouts={workouts} />;
}
```

## CRITICAL: User Data Isolation

Every query in `/data` MUST scope results to the currently authenticated user. A logged-in user must **never** be able to access another user's data.

### Rules

1. **Always resolve the current user inside the helper function** — do not rely on the caller to pass a trusted `userId` from client-side input.
2. **Always filter by `userId`** using the authenticated session, not a URL param or request body value.
3. **Never expose a query that returns data without a user scope** (unless the data is truly public and non-sensitive).

### Correct Pattern

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function getWorkouts() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, session.user.id));
}
```

### Incorrect Pattern — Never Do This

```ts
// WRONG: userId comes from untrusted input, not the session
export async function getWorkouts(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

By resolving the user inside the helper, even if a caller attempts to pass a different ID, the query will always use the authenticated user's identity.
