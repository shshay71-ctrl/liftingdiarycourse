# Server Components

## Default: Server Components

All page and layout files are **Server Components** by default. Only add `"use client"` when a component requires browser APIs, event handlers, or React hooks.

---

## CRITICAL: Params and SearchParams Must Be Awaited

This project uses **Next.js 15**, where `params` and `searchParams` are **Promises**. They MUST be awaited before accessing any properties.

- **NEVER** destructure or access `params` / `searchParams` synchronously
- **ALWAYS** `await` them first

### Correct Pattern

```tsx
// Page with a dynamic route segment
interface PageProps {
  params: Promise<{ workoutId: string }>;
}

export default async function EditWorkoutPage({ params }: PageProps) {
  const { workoutId } = await params;

  // use workoutId ...
}
```

```tsx
// Page with searchParams
interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { date } = await searchParams;

  // use date ...
}
```

### Incorrect Pattern — Never Do This

```tsx
// WRONG: params is a Promise in Next.js 15 — accessing it synchronously will fail
export default async function EditWorkoutPage({ params }: { params: { workoutId: string } }) {
  const { workoutId } = params; // ← never do this
}
```

---

## Type Signatures

Always type `params` and `searchParams` as `Promise<...>` in the props interface.

```tsx
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
```

---

## Data Fetching in Server Components

See [data-fetching.md](./data-fetching.md) for the full rules. Key points:

- Fetch data directly in Server Components — no `useEffect`, no client-side fetch
- All database queries go through helpers in `/data`
- Always scope queries to the authenticated user via `auth()` from `@clerk/nextjs/server`
