---
description: 'Process for importing Figma designs via MCP and converting to components'
applyTo: 'src/components/**'
---

# Figma Workflow

## Overview

Import Figma designs into React components using the Figma MCP integration. This workflow ensures design tokens, component structure, and styling align with the design system.

## Workflow Steps

Follow `.github/prompts/figma-component-import.prompt.md` for the complete process. Summary:

### 1. Extract Design Context from Figma

Use Figma MCP tools to:
- Get design context and measurements
- Extract color values, spacing, typography
- Identify component structure and hierarchy
- Document design intent and variants

### 2. Check for Existing Child Components

**Before creating sub-components**, check if they already exist:

```typescript
// Use Storybook MCP tool to query existing components
mcp_storybook-mcp_get-documentation({ id: 'button' })
```

**Reuse existing components** instead of duplicating. If existing component is close but needs modification, prefer extending over recreating.

### 3. Add Design Tokens to `globals.css`

Add extracted design tokens to `src/app/globals.css` in the `@theme inline` block:

```css
@theme inline {
  /* Existing tokens... */
  
  /* New tokens from Figma - use semantic names */
  --color-grey-light: #f5f5f5;
  --color-grey-dark: #333333;
  --spacing-5: 1.25rem;
  --spacing-8: 2rem;
  --column-width-span-12: 1200px;
  --border-radius-card: 0.75rem;
}
```

### 4. Implement Component

Create component following:
- [Component Architecture](.github/instructions/component-architecture.md) - Structure and props
- [Styling Guide](.github/instructions/styling-guide.md) - Tailwind v4 patterns
- [Code Conventions](.github/instructions/code-conventions.md) - Naming and exports

### 5. Create Comprehensive Stories

Create stories following:
- [Testing Strategy](.github/instructions/testing-strategy.md) - Required story types and coverage

Stories should cover:
- Default state matching Figma
- All variants shown in Figma
- Responsive behavior
- Edge cases (empty, overflow, etc.)

### 6. Verify Quality Gates

Run all quality checks:

```bash
pnpm lint && pnpm typecheck && pnpm test:ci
```

**All must pass** with zero errors before considering work complete.

## Design Token Naming Convention

Match Figma's semantic naming convention:

### Colors
```css
--color-primary
--color-secondary
--color-grey-light
--color-grey-dark
--color-error
--color-success
```

### Spacing
```css
--spacing-1    /* 0.25rem / 4px */
--spacing-2    /* 0.5rem / 8px */
--spacing-4    /* 1rem / 16px */
--spacing-5    /* 1.25rem / 20px */
--spacing-8    /* 2rem / 32px */
```

### Typography
```css
--font-family-headings
--font-family-body
--font-size-sm
--font-size-base
--font-size-lg
--font-size-xl
```

### Layout
```css
--column-width-span-4
--column-width-span-6
--column-width-span-12
--container-max-width
```

### Borders
```css
--border-radius-sm
--border-radius-md
--border-radius-lg
--border-radius-card
```

## Best Practices

### Token Organization
- Group related tokens (colors together, spacing together)
- Add comments to document token purpose
- Use semantic names, not implementation details
- Maintain consistent naming patterns

### Component Fidelity
- Match Figma designs as closely as possible
- Document intentional deviations
- Test responsive behavior across breakpoints
- Verify interactive states (hover, focus, active)

### Reuse Over Recreation
- Check Storybook for existing components first
- Reuse child components (Button, Input, Card, etc.)
- Only create new components when necessary
- Consider composition patterns before creating variants

### Documentation
- Document design decisions in component TSDoc
- Add comments explaining complex calculations
- Link to Figma file/frame when relevant
- Document responsive breakpoint choices

## Common Patterns

### Extracting Multiple Tokens

When Figma uses a value multiple times, create a token:

```css
/* Instead of hardcoding #0066cc everywhere */
--color-primary: #0066cc;
--color-link: var(--color-primary);
--color-button-primary: var(--color-primary);
```

### Responsive Spacing

Figma often shows desktop sizes. Add responsive tokens:

```css
--spacing-section-mobile: 2rem;
--spacing-section-tablet: 3rem;
--spacing-section-desktop: 4rem;
```

### Component-Specific Tokens

For complex components, consider namespaced tokens:

```css
--card-padding: 1.5rem;
--card-gap: 1rem;
--card-border-radius: 0.75rem;
--card-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
```

## Troubleshooting

**Figma MCP not responding?**
- Check VS Code Copilot MCP integration is enabled
- Verify Figma file permissions
- Try refreshing the Figma file

**Design tokens not applying?**
- Verify tokens added to `@theme inline` block in `globals.css`
- Check Tailwind v4 syntax: `text-(--token-name)` not `text-[var(--token-name)]`
- Restart dev server after adding new tokens

**Component doesn't match Figma?**
- Double-check extracted measurements
- Verify responsive behavior at different breakpoints
- Check for font/spacing tokens that need custom utilities
- Review Figma interaction details (hover, focus states)

## Example: Complete Import Flow

1. **Extract from Figma**: "Button with primary/secondary variants, 48px height, 16px padding"
2. **Check existing**: Query Storybook - Button component already exists
3. **Add tokens**: None needed, existing tokens sufficient
4. **Implement**: Reuse existing Button component
5. **Create stories**: Add stories for new context if needed
6. **Verify**: `pnpm lint && pnpm typecheck && pnpm test:ci` ✅

## Reference

- **Complete workflow**: `.github/prompts/figma-component-import.prompt.md`
- **Design tokens location**: `src/app/globals.css`
- **Component structure**: `src/components/[component-name]/`
