---
description: 'File naming, import patterns, and code organization conventions'
applyTo: '**/*.ts, **/*.tsx'
---

# Code Conventions

## File Naming

### Components
- **Files**: `kebab-case` (e.g., `button.tsx`, `card-header.tsx`)
- **Components**: `PascalCase` (e.g., `Button`, `CardHeader`)
- **Test files**: Match component file (e.g., `button.stories.tsx`)

### Utilities and Helpers
- **Files**: `kebab-case` (e.g., `format-date.ts`, `api-client.ts`)
- **Functions**: `camelCase` (e.g., `formatDate`, `apiClient`)

### Constants
- **Files**: `kebab-case` (e.g., `api-constants.ts`)
- **Exports**: `SCREAMING_SNAKE_CASE` (e.g., `API_BASE_URL`, `MAX_RETRY_COUNT`)

## Export Conventions

### No Default Exports

**Always use named exports**:

```tsx
// ✅ Correct
export function Button({ children, ...props }: ButtonProps) {
  return <button {...props}>{children}</button>;
}

// ❌ Incorrect
export default function Button({ children, ...props }: ButtonProps) {
  return <button {...props}>{children}</button>;
}
```

**Why**: Named exports enable better IDE support, easier refactoring, and prevent naming inconsistencies.

### Barrel Exports (index.ts)

**File**: `index.ts` (NOT `.tsx`)

```ts
// ✅ Correct
export { Button } from './button';
export type { ButtonProps } from './button';

// ❌ Incorrect (don't use default)
export { default } from './button';

// ❌ Incorrect (don't use .tsx extension)
// File should be index.ts, not index.tsx
```

## Import Conventions

### Component Imports

**Import from component directory**, not barrel index:

```tsx
// ✅ Correct - direct import
import { Card } from '../card';
import { Button } from '../button';

// ❌ Incorrect - don't use barrel for internal imports
import { Card } from '../card/index';

// ❌ Incorrect - don't import from parent barrel
import { Card, Button } from '../';
```

### Path Aliases

Use `@/` alias for absolute imports from `src/`:

```tsx
// ✅ Correct - absolute import from src/
import { cn } from '@/lib/utils';
import { Button } from '@/components/button';

// ❌ Incorrect - relative imports from src/ root
import { cn } from '../../lib/utils';
```

### Import Order

Organize imports in this order:

```tsx
// 1. External dependencies
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

// 2. Internal absolute imports (using @/)
import { cn } from '@/lib/utils';

// 3. Relative imports (same directory or parent)
import { Card } from '../card';
import { Button } from './button';

// 4. Types (if not inline with imports)
import type { ButtonProps } from './button.types';

// 5. Styles (if separate CSS files used)
import './button.css';
```

## Folder Structure

### Component Organization

```
src/components/
├── button/
│   ├── button.tsx
│   ├── button.stories.tsx
│   └── index.ts
├── card/
│   ├── card.tsx
│   ├── card.stories.tsx
│   └── index.ts
└── section-with-card/
    ├── section-with-card.tsx
    ├── section-with-card.stories.tsx
    └── index.ts
```

**Keep flat when possible** - avoid deep nesting unless components are truly scoped to a parent.

### Utilities and Helpers

```
src/lib/
├── utils.ts              # General utilities (cn, etc.)
├── format-date.ts        # Specific utility functions
└── api-client.ts         # API-related utilities
```

## TypeScript Conventions

### Use `interface` for Props

```tsx
// ✅ Correct
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

// ❌ Incorrect (use interface, not type)
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};
```

### Export Types When Needed

Export component prop types when they're consumed by parent components:

```tsx
// button.tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', ...props }: ButtonProps) {
  // ...
}

// card.tsx
import type { ButtonProps } from '../button';

interface CardProps {
  title: string;
  buttonProps?: ButtonProps;  // Reuse Button's props type
}
```

## Code Organization

### Component Structure

```tsx
// 1. Imports
import { cn } from '@/lib/utils';

// 2. Type definitions
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

// 3. Component implementation
export function Button({ 
  variant = 'primary',
  className,
  children,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'base-classes',
        variant === 'primary' && 'primary-classes',
        variant === 'secondary' && 'secondary-classes',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// 4. Sub-components (if any, keep in same file if tightly coupled)
function ButtonIcon({ icon }: { icon: React.ReactNode }) {
  return <span className="button-icon">{icon}</span>;
}
```

### Utility Functions

```tsx
// format-date.ts

/**
 * Formats a date string into a human-readable format
 * @param date - ISO date string or Date object
 * @param format - Format style: 'short' | 'long' | 'relative'
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date,
  format: 'short' | 'long' | 'relative' = 'short'
): string {
  // Implementation
}

/**
 * Checks if a date is in the past
 */
export function isDateInPast(date: string | Date): boolean {
  // Implementation
}
```

## Best Practices

### Component Props

- Extend HTML attributes when applicable
- Use optional props with sensible defaults
- Document props with TSDoc
- Spread `{...props}` to pass through HTML attributes

### Function Naming

- **Components**: `PascalCase` (e.g., `Button`, `CardHeader`)
- **Hooks**: `camelCase` starting with `use` (e.g., `useAuth`, `useLocalStorage`)
- **Utilities**: `camelCase` (e.g., `formatDate`, `parseJson`)
- **Event handlers**: `handle` prefix (e.g., `handleClick`, `handleSubmit`)

### Constants

- Use `SCREAMING_SNAKE_CASE` for true constants
- Group related constants in files or objects
- Document magic numbers with constants

```tsx
// ✅ Good
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
} as const;

// ❌ Avoid magic numbers
if (width > 768) { ... }  // What is 768?

// ✅ Better
if (width > BREAKPOINTS.MD) { ... }
```

### Comments and Documentation

- Add TSDoc for public APIs and complex functions
- Use inline comments for non-obvious logic
- Avoid stating the obvious
- Document "why" not "what" when code is self-explanatory

```tsx
// ❌ Obvious comment
// Set the count to 0
setCount(0);

// ✅ Useful comment
// Reset count to prevent overflow issues in legacy systems
setCount(0);
```

## Linting and Formatting

- Run `pnpm lint:fix` to auto-fix issues
- Configure editor to format on save
- Follow ESLint rules (see `eslint.config.mjs`)
- TypeScript strict mode is enabled

## Summary

- **Files**: `kebab-case`
- **Components**: `PascalCase`
- **Functions**: `camelCase`
- **Constants**: `SCREAMING_SNAKE_CASE`
- **No default exports** - always use named exports
- **Import from component directory**, not barrel index
- **Use `@/` alias** for absolute imports from `src/`
- **Use `interface` for props**, extend HTML attributes
- **Document public APIs** with TSDoc
- **Run linting** before committing
