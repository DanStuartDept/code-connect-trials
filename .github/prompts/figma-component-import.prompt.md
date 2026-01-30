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

### 1.3 Design Token Integration

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
├── component-name.tsx       (snake_case filename, PascalCase component)
├── component-name.stories.tsx
└── index.ts                 (NOT index.tsx - named export only)
```

**Naming Rules**:
- **Folders**: `snake_case` (e.g., `button`, `card_header`)
- **Files**: `snake_case` (e.g., `button.tsx`, `card_header.stories.tsx`)
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
3. Verify the existing component is up-to-date with current standards
4. If outdated, update it before using

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

## Phase 5: Testing & Validation

**IMPORTANT**: Frontend development is NOT complete until testing is done.

### 5.1 Parallel Testing (Run Simultaneously)

**Accessibility Testing** - DELEGATE TO: #file:../agents/accessibility.agent.md
- Test keyboard navigation
- Verify ARIA attributes and semantic HTML
- Check focus management
- Validate color contrast
- Test with screen reader patterns
- **DO NOT FIX** - Only document findings

**Visual & Functional Testing** - DELEGATE TO: #file:../agents/playwright-tester.agent.md
- Visual regression: Compare rendered component with Figma design
- Basic interactions: Clicks, hovers, keyboard navigation
- Use Storybook stories for coverage (not custom Playwright scripts in codebase)
- Create temporary Playwright scripts for testing (not committed to repo)
- **DO NOT FIX** - Only document discrepancies

### 5.2 Feedback Collection

Both testing agents should provide feedback to #file:../agents/expert-react-frontend-engineer.agent.md in this format:

```markdown
## [Agent Name] Findings

### Issues Found
1. [Description] - Severity: [High/Medium/Low]
   - Location: [file:line or component area]
   - Recommendation: [suggested fix]

### Passes
- [List of things that passed]
```

### 5.3 User Review

**STOP HERE** - Present all findings to the user:

```
## Testing Complete

### Accessibility Findings
[Summary from accessibility agent]

### Visual/Functional Findings
[Summary from playwright agent]

**Action Required**: Please review these findings. Should I proceed with implementing the recommended fixes?
```

Wait for user approval before proceeding.

### 5.4 Fix Implementation

**DELEGATE TO**: #file:../agents/expert-react-frontend-engineer.agent.md

After user approval:
1. Implement all approved fixes
2. Re-run linting and type checking
3. Re-run tests to verify fixes

### 5.5 Retest

After fixes are applied:
1. Re-run accessibility tests
2. Re-run visual/functional tests
3. If new issues found, repeat feedback cycle
4. If all tests pass, proceed to completion

## Phase 6: Completion

### 6.1 Final Checklist

Verify all requirements met:

- [ ] Component file structure follows naming conventions
- [ ] Component extends appropriate HTML attributes
- [ ] TSDoc present on interface and component
- [ ] Each prop has its own comment block
- [ ] Using `cn()` for dynamic classes
- [ ] No default exports (named exports only)
- [ ] Index file is `.ts` not `.tsx`
- [ ] Design tokens added to `globals.css`
- [ ] All existing child components imported and up-to-date
- [ ] Storybook stories created (Default + Variants + Edge cases)
- [ ] Lint passes with zero errors/warnings
- [ ] Type check passes with zero errors
- [ ] Test coverage ≥90%
- [ ] Accessibility tests passed
- [ ] Visual regression tests passed
- [ ] All approved fixes implemented

### 6.2 Completion Report

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
- Accessibility: ✅ Passed
- Visual Regression: ✅ Passed

### Storybook
View at: http://localhost:6006/?path=/story/components-[component-name]--default

The component is ready for use!
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

### If Tests Fail
```
⚠️ Test Failures Detected

[Test failure details]

I'll investigate and fix these issues...
```

## Best Practices

1. **Always check Storybook status first** - Never assume it needs to be started
2. **Resolve dependencies bottom-up** - Create child components before parent components
3. **Design tokens first** - Add tokens to globals.css before implementing components
4. **Quality over speed** - Don't skip quality gates
5. **Document everything** - TSDoc is mandatory, not optional
6. **Test thoroughly** - Stories are tests, so make them comprehensive
7. **User approval** - Always get approval before implementing fixes
8. **No shortcuts** - Follow every step of this workflow

## Notes

- This workflow uses `@storybook/addon-vitest` for component testing via stories
- Playwright scripts for testing are temporary and not committed to the codebase
- The `cn()` utility combines `clsx` and `tailwind-merge` for optimal class handling
- Design tokens should use semantic naming that matches Figma conventions
- Component naming must be consistent across files (PascalCase in code, snake_case in filenames)
