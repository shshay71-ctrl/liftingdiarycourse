# UI Coding Standards

## Component Library

**ALL UI components must use [shadcn/ui](https://ui.shadcn.com/) exclusively.**

- Do **NOT** create custom UI components.
- Do **NOT** use any other component library (e.g. Radix primitives directly, MUI, Chakra, etc.).
- Every interactive or presentational element must be built from shadcn/ui components.
- If a shadcn/ui component does not exist for a use case, compose the UI using existing shadcn/ui components only.

### Adding Components

Install shadcn/ui components via the CLI:

```bash
npx shadcn@latest add <component-name>
```

Components are added to `src/components/ui/`. Do not modify these generated files.

---

## Date Formatting

All date formatting must use **[date-fns](https://date-fns.org/)**.

### Format

Dates must be displayed in the following format:

```
do MMM yyyy
```

| Date         | Display        |
|--------------|----------------|
| 2025-09-01   | 1st Sep 2025   |
| 2025-08-02   | 2nd Aug 2025   |
| 2026-01-03   | 3rd Jan 2026   |
| 2024-06-04   | 4th Jun 2024   |

### Usage

```ts
import { format } from "date-fns";

format(date, "do MMM yyyy"); // e.g. "1st Sep 2025"
```

Do not use `Date.prototype.toLocaleDateString()`, `Intl.DateTimeFormat`, or any other date formatting utility.
