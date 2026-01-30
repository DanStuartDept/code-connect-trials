---
description: "Comprehensive workflow for importing Figma components via Figma MCP with quality assurance"
tools: ['vscode/runCommand', 'execute', 'read', 'edit', 'search', 'web', 'agent', 'context7/*', 'playwright/*', 'figma/*', 'figma/*', 'storybook-mcp/*', 'todo']
---

# Figma Component Import Workflow

Import and implement a Figma component following our codebase standards with comprehensive testing and quality assurance.

## Pre-Flight Checks

**CRITICAL**: Before starting any work:

1. **Check if Storybook is running** at `http://localhost:6006/` - DO NOT attempt to start it if already running
2. **Verify the Figma URL** is accessible and contains valid component design
3. **Check for child components**: Scan the Figma design for nested components that reference other components in your codebase
4. **Learn about existing components**: Use `mcp_storybook-mcp_get-documentation` to understand component APIs and usage patterns

## Phase 1: Discovery & Dependency Resolution

### 1.1 Extract Design Information

- Fetch the Figma component design using Figma MCP tools
- Extract design tokens (colors, spacing, typography) from Figma variables
- Identify all child components used within the design
- Check if Figma design includes interactive states (hover, focus, active, disabled)
- Note: Only implement states explicitly shown in Figma; don't add "nice to have" states

### 1.2 Dependency Check

**IMPORTANT**: Before proceeding, check if any child components are missing:

```
For each child component in the Figma design:
  1. Check if it exists in ./src/components/
  2. Use 'mcp_storybook-mcp_get-documentation' to learn about the component's props and usage
  3. If missing, FLAG to the user: "Missing component: [ComponentName]. Should I import and create this component first?"
  4. Wait for user confirmation before proceeding
  5. If confirmed, recursively apply this workflow to the missing component first
```

### 1.3 Atomic Design Analysis

**CRITICAL**: Analyze the component's complexity and atomic structure:

```
1. Present the component structure to the user:
   "The [ComponentName] appears to be a [molecule/organism] consisting of:
   - [List child components/atoms]
   - [List sections/groupings]
   
   Atomic Design Approach:
   - Option A: Build as a single component with all elements
   - Option B: Break into smaller atoms/molecules: [suggest breakdown]
   
   Which approach would you prefer?"

2. Wait for user decision before proceeding
3. If breaking down, identify which sub-components to create first
4. Follow bottom-up implementation (atoms → molecules → organisms)
```

**Atomic Design Guidelines**:
- **Atoms**: Basic building blocks (Button, Input, Label, Icon)
- **Molecules**: Simple combinations of atoms (SearchField = Input + Button, FormField = Label + Input)
- **Organisms**: Complex, reusable sections (Header, Card, Navigation)
- **Templates**: Page-level layouts (not typically from Figma components)

### 1.4 Design Token Integration

Automatically extract and add Figma design tokens to `./src/app/globals.css` in the `@theme` block:

```css
@theme inline {
  /* Existing tokens */
  
  /* New Figma tokens */
  --color-[token-name]: #value;
  --spacing-[token-name]: value;
  /* etc */
}
```

Use semantic token names that match Figma's naming convention.

## Phase 2: Component Implementation

**DELEGATE TO**: #file:expert-react-frontend-engineer.agent.md

### 2.1 File Structure & Naming

Create components in `./src/components/[component-name]/` with this structure:

```
./src/components/component-name/
├── component-name.tsx       (kebab-case filename, PascalCase component)
├── component-name.stories.tsx
└── index.ts                 (NOT index.tsx - named export only)
```

**Naming Rules**:
- **Folders**: `kebab-case` (e.g., `button`, `card-header`)
- **Files**: `kebab-case` (e.g., `button.tsx`, `card-header.stories.tsx`)
- **React Components**: `PascalCase` (e.g., `Button`, `CardHeader`)
- **Functions/Utils**: `camelCase` (e.g., `handleClick`, `formatDate`)
- **No default exports** - use named exports: `export const Button = ...`

### 2.2 Component Code Standards

**Interface Definition**:
```tsx
/**
 * Props for the [ComponentName] component
 * @extends React.[HTMLElementType]Attributes<HTML[ElementType]Element>
 */
interface [ComponentName]Props extends React.[HTMLElementType]Attributes<HTML[ElementType]Element> {
  /**
   * [Description of prop]
   * @default [default value if applicable]
   */
  propName?: PropType;
  
  /**
   * [Description of another prop]
   */
  anotherProp: AnotherType;
}
```

**Component Implementation**:
- Use `interface` instead of `type` for props
- Extend appropriate HTML element attributes (`ButtonHTMLAttributes`, `DivHTMLAttributes`, etc.)
- Add comprehensive TSDoc for the component with `@example` usage
- Each prop must have its own comment block describing its purpose
- Use the `cn()` utility from `@/lib/utils` for dynamic class names
- Support `className` prop for style extension
- Use spread operator `{...props}` to pass through HTML attributes

**Tailwind v4 CSS Variable Syntax**:
- Use the shortened syntax for CSS variables: `text-(--color-name)` instead of `text-[var(--color-name)]`
- Use Tailwind's spacing scale when possible: `w-110` instead of `w-[440px]`
- Only use arbitrary values `[]` when the exact value isn't in the Tailwind config

**Component Composition**:
- When a component uses child components, prefer passing props through a dedicated prop
- Example: Use `buttonProps?: React.ComponentProps<typeof Button>` instead of `buttonText`, `buttonVariant`, `onButtonClick`
- This allows users to pass any valid props to the child component without cluttering the parent API

**Component Sizing**:
- Make components `w-full` by default to let parents control width
- Use Storybook decorators to apply width constraints for visual presentation
- Don't hard-code max-width unless it's a fundamental part of the component's design

**Example Pattern**:
```tsx
import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the Button component
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The visual style variant of the button
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary';
}

/**
 * Button component with primary and secondary variants
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onClick={() => console.log('clicked')}>
 *   Click me
 * </Button>
 * ```
 * 
 * @param props - Button properties
 * @returns A styled button element
 */
export const Button = ({ children, variant = 'primary', className, ...props }: ButtonProps) => {
  return (
    <button
      type="button"
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
};
```

### 2.3 Import Existing Components

When the Figma design uses existing components:
1. Use `mcp_storybook-mcp_get-documentation` to understand the component's API, props, and usage examples
2. Import from the component's directory: `import { ComponentName } from '../component-name'`
3. Use existing components as-is; do NOT modify them during this workflow
4. If existing components have issues, document them separately for the user

### 2.4 Index File

Create `index.ts` (NOT `.tsx`) with named export only:

```typescript
export { ComponentName } from './component-name';
```

## Phase 3: Storybook Stories

### 3.1 Required Story Coverage

Create `[component-name].stories.tsx` with the following stories:

1. **Default**: Component with default props
2. **All Variants**: One story per variant/style option
3. **Edge Cases**: 
   - Empty states
   - Long text/content
   - Minimum viable data
   - Maximum reasonable data

**Story Template**:
```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ComponentName } from './component-name';

const meta = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered', // or 'fullscreen' for layout components
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // default props
  },
};

export const VariantName: Story = {
  args: {
    // variant props
  },
};

export const EdgeCaseLongText: Story = {
  args: {
    // edge case props
  },
};
```

### 3.2 Story Quality

- Each story should be self-contained and demonstrate a specific use case
- Use realistic data (not "Lorem ipsum" unless that's the design)
- Stories should showcase the component's API and capabilities

## Phase 4: Quality Assurance

### 4.1 Linting & Type Checking

Run these commands and fix ALL issues:

```bash
pnpm lint
pnpm typecheck
```

**Quality Gates**:
- TypeScript: **Zero errors allowed**
- ESLint: **Zero errors/warnings allowed**
- If any issues exist, fix them before proceeding

### 4.2 Test Coverage

Run tests and verify coverage:

```bash
pnpm test:ci
```

**Coverage Requirements**:
- **Target**: 100% coverage for the component
- **Acceptable**: 90% if achieving 100% requires excessive complexity
- **If below 90%**: Add more test cases via Storybook stories

**Note**: This project uses `@storybook/addon-vitest`, so Storybook stories automatically contribute to test coverage.

### 4.3 Visual QA in Storybook

1. Verify Storybook is running at `http://localhost:6006/`
2. Navigate to the new component stories
3. Verify all stories render correctly
4. Check that variants match Figma design

## Phase 5: Completion

### 5.1 Final Checklist

Verify all requirements met:

- [ ] Component file structure follows naming conventions (kebab-case)
- [ ] Component extends appropriate HTML attributes
- [ ] TSDoc present on interface and component
- [ ] Each prop has its own comment block
- [ ] Using `cn()` for dynamic classes
- [ ] No default exports (named exports only)
- [ ] Index file is `.ts` not `.tsx`
- [ ] Design tokens added to `globals.css`
- [ ] All existing child components imported correctly
- [ ] Storybook stories created (Default + Variants + Edge cases)
- [ ] Lint passes with zero errors/warnings
- [ ] Type check passes with zero errors
- [ ] Test coverage ≥90%

### 5.2 Completion Report

Present to user:

```markdown
## ✅ Component Import Complete: [ComponentName]

### Files Created
- ./src/components/[component-name]/[component-name].tsx
- ./src/components/[component-name]/[component-name].stories.tsx
- ./src/components/[component-name]/index.ts

### Design Tokens Added
- [List of tokens added to globals.css]

### Quality Metrics
- Type Safety: ✅ 0 errors
- Linting: ✅ 0 errors/warnings  
- Test Coverage: ✅ [X]%

### Storybook
View at: http://localhost:6006/?path=/story/components-[component-name]--default

### Next Steps
- Review the component in Storybook
- Test manually for accessibility (keyboard navigation, screen readers)
- Verify visual accuracy against Figma design
- Test on different devices/browsers as needed

The component is ready for review!
```

## Error Handling

### If Storybook is Not Running
```
⚠️ Storybook is not running at http://localhost:6006/

To start Storybook, run: pnpm storybook

Please start Storybook and let me know when it's ready.
```

### If Child Components are Missing
```
⚠️ Missing Component Dependencies

The Figma design references these components that don't exist:
- [ComponentName1]
- [ComponentName2]

Should I import and create these components first? (This will repeat this workflow for each missing component)
```

### If Quality Gates Fail
```
⚠️ Quality Gate Failed: [Gate Name]

[Error details]

I'll fix these issues before proceeding...
```

## Best Practices

1. **Always check Storybook status first** - Never assume it needs to be started
2. **Resolve dependencies bottom-up** - Create child components before parent components
3. **Design tokens first** - Add tokens to globals.css before implementing components
4. **Quality over speed** - Don't skip quality gates
5. **Document everything** - TSDoc is mandatory, not optional
6. **Test thoroughly via stories** - Stories are tests, so make them comprehensive
7. **Use kebab-case** - For all file and folder names

## Notes

- This workflow uses `@storybook/addon-vitest` for component testing via stories
- The `cn()` utility combines `clsx` and `tailwind-merge` for optimal class handling
- Design tokens should use semantic naming that matches Figma conventions
- Component naming: PascalCase in code, kebab-case in filenames
- Manual testing (accessibility, visual, functional) should be done by the developer after component creation
