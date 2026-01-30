---
description: 'Tailwind CSS v4 usage patterns, design tokens, and styling conventions'
applyTo: 'src/**/*.tsx, src/app/globals.css'
---

# Styling Guide

## Tailwind CSS v4 - Key Changes

Tailwind v4 introduces new syntax and patterns. Follow these conventions:

## Design Tokens Location

**All design tokens** are defined in `src/app/globals.css` within the `@theme inline` block:

```css
@theme inline {
  --color-primary: #0066cc;
  --color-secondary: #6c757d;
  --spacing-base: 1rem;
  --font-family-headings: 'Inter', sans-serif;
}
```

## Shortened CSS Variable Syntax

Tailwind v4 allows **direct variable reference** without `var()`:

### ✅ Correct (v4):
```tsx
<div className="text-(--color-primary) bg-(--color-secondary)" />
```

### ❌ Incorrect (v3 syntax):
```tsx
<div className="text-[var(--color-primary)] bg-[var(--color-secondary)]" />
```

## Numeric Scale Values

Use scale values directly when they exist:

### ✅ Correct:
```tsx
<div className="w-110 h-110" />  {/* 440px from scale */}
```

### ❌ Incorrect:
```tsx
<div className="w-[440px] h-[440px]" />  {/* Don't use arbitrary when scale exists */}
```

## Font Properties - Important Limitation

**Arbitrary font properties don't work in Tailwind v4**. Use custom utility classes instead:

### ❌ This Won't Work:
```tsx
<h1 className="font-[var(--font-family-headings)]">Title</h1>
```

### ✅ Correct Approach:

**Step 1**: Add utility class to `globals.css`:
```css
@layer utilities {
  .font-heading {
    font-family: var(--font-family-headings);
  }
  .font-body {
    font-family: var(--font-family-body);
  }
}
```

**Step 2**: Use the utility class:
```tsx
<h1 className="font-heading">Title</h1>
<p className="font-body">Body text</p>
```

## Conditional Styling with cn()

Use the `cn()` utility from `@/lib/utils` for conditional className merging:

```tsx
import { cn } from '@/lib/utils';

export function Button({ variant, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'px-4 py-2 rounded font-medium transition-colors',
        // Conditional styles
        variant === 'primary' && 'bg-(--color-primary) text-white',
        variant === 'secondary' && 'bg-(--color-secondary) text-white',
        // User overrides last
        className
      )}
      {...props}
    />
  );
}
```

**Key principle**: User-provided `className` comes last to enable overrides.

## Component Width Convention

Components default to `w-full` - parents control width:

```tsx
export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'w-full',  // Full width by default
        'p-6 rounded-lg shadow-md',
        className
      )}
      {...props}
    />
  );
}

// Parent controls width:
<Card className="max-w-md" />
```

## Responsive Design

Use Tailwind's responsive prefixes:

```tsx
<div className="
  w-full
  md:w-1/2
  lg:w-1/3
  p-4
  md:p-6
  lg:p-8
">
  Responsive component
</div>
```

## Dark Mode Support

If implementing dark mode, use the `dark:` variant:

```tsx
<div className="
  bg-white text-gray-900
  dark:bg-gray-900 dark:text-white
">
  Content
</div>
```

## Adding New Design Tokens

When adding design tokens (especially from Figma), add them to `globals.css`:

```css
@theme inline {
  /* Existing tokens... */
  
  /* New token from Figma */
  --color-accent: #ff6b6b;
  --spacing-card-gap: 1.5rem;
  --border-radius-card: 0.75rem;
}
```

**Naming convention**: Use semantic names that match Figma's convention:
- `--color-grey-light`
- `--spacing-5`
- `--column-width-span-12`

## Best Practices

- **Keep tokens semantic**: `--color-error` not `--color-red-500`
- **Document token purpose**: Add comments above complex tokens
- **Reuse tokens**: Don't hardcode colors/spacing that should be tokens
- **Test dark mode**: If implementing, test both light/dark variants
- **Use utilities layer**: For complex patterns not supported by Tailwind config
