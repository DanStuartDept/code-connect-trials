---
description: 'Component structure, props patterns, and TypeScript documentation requirements'
applyTo: 'src/components/**'
---

# Component Architecture

## Directory Structure

Components live in `src/components/[component-name]/` with this exact structure:

```
component-name/
├── component-name.tsx       # kebab-case file, PascalCase component
├── component-name.stories.tsx
└── index.ts                 # NOT .tsx - named exports only
```

## Props Interface Requirements

**Always use `interface` for props** (not `type`):

```tsx
/**
 * Props for the Button component
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant @default 'primary' */
  variant?: 'primary' | 'secondary';
  /** Button content */
  children: React.ReactNode;
}
```

### Requirements:
- ✅ Use `interface` (not `type`)
- ✅ Extend appropriate HTML attributes (e.g., `React.ButtonHTMLAttributes<HTMLButtonElement>`)
- ✅ Add comprehensive TSDoc with `@extends` notation
- ✅ Document each prop with description and `@default` value if applicable
- ✅ Make props optional with `?` when sensible defaults exist

## Passing Child Component Props

**Use dedicated props objects** instead of flattening child component props:

### ✅ Correct:
```tsx
interface CardProps {
  title: string;
  description: string;
  /** Props passed to the action button */
  buttonProps?: React.ComponentProps<typeof Button>;
}

// Usage
<Card
  title="Hello"
  description="World"
  buttonProps={{ variant: 'secondary', onClick: handleClick }}
/>
```

### ❌ Incorrect:
```tsx
interface CardProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonVariant?: 'primary' | 'secondary';
  onButtonClick?: () => void;
}
```

**Why**: Flattened props create prop explosion, tight coupling, and duplication. Dedicated props objects maintain component boundaries and enable easier refactoring.

## Component Implementation

```tsx
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
```

### Key Patterns:
- Destructure props with defaults
- Use `cn()` from `@/lib/utils` for conditional className merging
- Spread `{...props}` to pass through remaining HTML attributes
- Components are `w-full` by default - parents control width

## Index File (Barrel Export)

**File**: `index.ts` (NOT `.tsx`)

```ts
export { Button } from './button';
export type { ButtonProps } from './button';
```

**Only export types if they need to be consumed externally** (e.g., for `buttonProps` pattern).

## Import Conventions

Import components from their directory, not barrel index:

```tsx
// ✅ Correct
import { Card } from '../card';
import { Button } from '../button';

// ❌ Incorrect (don't use barrel index for internal imports)
import { Card } from '../card/index';
```

## Component Composition

When composing components:
- Keep components focused and single-purpose
- Use composition over configuration
- Prefer render props or children for flexibility
- Avoid prop drilling - use context when needed

## TypeScript Best Practices

- Export component function and props interface
- Use discriminated unions for variant-based props
- Leverage `React.ComponentProps<typeof Component>` for prop forwarding
- Use `Omit<>` and `Pick<>` to refine extended interfaces when needed
