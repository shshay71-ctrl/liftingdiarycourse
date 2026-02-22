# Data Mutations

## CRITICAL: Server Actions Only

ALL data mutations in this application MUST be done via **Server Actions**.

- **NEVER** mutate data via Route Handlers (API routes)
- **NEVER** mutate data directly inside Client Components
- **NEVER** call Drizzle ORM directly from a Server Action — always go through a `/data` helper

---

## Database Mutations: /data Directory

All database mutation logic MUST be encapsulated in helper functions located in the `src/data` directory, mirroring the pattern used for data fetching.

- Each file in `src/data` should group related operations (e.g., `data/workouts.ts`, `data/exercises.ts`)
- Helper functions MUST use **Drizzle ORM** — do NOT write raw SQL under any circumstances
- Server Actions call these helpers; they do not contain db logic themselves

### Example Structure

```
src/
  data/
    workouts.ts      ← contains both query and mutation helpers
    exercises.ts
    sets.ts
  app/
    workouts/
      new/
        page.tsx
        actions.ts   ← Server Actions colocated with the route
```

### Example Data Helper

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export async function createWorkout(name: string, date: Date) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return db.insert(workouts).values({
    name,
    date,
    userId,
  });
}
```

---

## Server Actions: actions.ts

All Server Actions MUST live in a colocated `actions.ts` file next to the route or component that uses them.

- The file MUST begin with `"use server"`
- Actions MUST be `async` functions
- One `actions.ts` per route segment — do not share action files across unrelated routes

### Example Structure

```ts
// src/app/workouts/new/actions.ts
"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.coerce.date(),
});

export async function createWorkoutAction(params: {
  name: string;
  date: string;
}) {
  const parsed = createWorkoutSchema.safeParse(params);

  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  await createWorkout(parsed.data.name, parsed.data.date);
}
```

---

## Typed Parameters

All Server Action parameters MUST be explicitly typed using TypeScript.

- **NEVER** use `FormData` as a parameter type
- Accept plain typed objects or individual typed primitives instead
- If a form triggers the action, extract values client-side and pass typed arguments

### Correct Pattern

```ts
// CORRECT: typed object parameter
export async function updateWorkoutAction(params: {
  id: string;
  name: string;
}) { ... }

// CORRECT: individual typed primitives
export async function deleteWorkoutAction(id: string) { ... }
```

### Incorrect Pattern — Never Do This

```ts
// WRONG: FormData is not allowed
export async function createWorkoutAction(formData: FormData) { ... }
```

---

## Validation with Zod

ALL Server Actions MUST validate their arguments with **Zod** before performing any operation.

- Define a Zod schema for every action's input
- Use `safeParse` and handle validation errors explicitly — do not use `parse` and let it throw unhandled
- Validation must happen before any call to a `/data` helper or any other side effect

### Example

```ts
"use server";

import { z } from "zod";
import { updateWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
});

export async function updateWorkoutAction(params: {
  id: string;
  name: string;
}) {
  const parsed = updateWorkoutSchema.safeParse(params);

  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  await updateWorkout(parsed.data.id, parsed.data.name);
}
```

---

## CRITICAL: No Redirects in Server Actions

**NEVER** call `redirect()` from `next/navigation` inside a Server Action.

- Server Actions MUST return data or throw errors — they must not trigger navigation
- Redirects MUST be handled client-side after the Server Action promise resolves

### Correct Pattern

```ts
// actions.ts
"use server";

export async function createWorkoutAction(params: { name: string; date: string }) {
  // ... validate and mutate
}
```

```tsx
// Client Component
"use client";

import { useRouter } from "next/navigation";
import { createWorkoutAction } from "./actions";

function MyForm() {
  const router = useRouter();

  async function onSubmit(values) {
    await createWorkoutAction(values);
    router.push("/dashboard"); // redirect client-side after action resolves
  }
}
```

### Incorrect Pattern — Never Do This

```ts
// WRONG: redirect() inside a Server Action
"use server";

import { redirect } from "next/navigation";

export async function createWorkoutAction(params: { name: string; date: string }) {
  // ... validate and mutate
  redirect("/dashboard"); // ← never do this
}
```

---

## CRITICAL: User Data Isolation

Mutations must never allow a user to modify another user's data.

- **Always resolve the authenticated user inside the `/data` helper**, not in the Server Action
- **Never trust** an `id` or `userId` value passed in from the client to scope ownership — always verify against the authenticated session inside the helper

### Correct Pattern

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function deleteWorkout(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Scope the delete to both the record id AND the authenticated user
  await db
    .delete(workouts)
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)));
}
```

### Incorrect Pattern — Never Do This

```ts
// WRONG: no user scope — any authenticated user could delete any record
export async function deleteWorkout(id: string) {
  await db.delete(workouts).where(eq(workouts.id, id));
}
```
