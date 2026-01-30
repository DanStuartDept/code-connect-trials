---
description: 'Story-driven testing philosophy, coverage requirements, and Vitest + Playwright integration'
applyTo: 'src/components/**/*.stories.tsx, src/**/*.test.tsx'
---

# Testing Strategy

## Philosophy: Tests ARE Stories

**Core principle**: Every Storybook story is automatically a test via `@storybook/addon-vitest`.

**Why**: Stories document components, enable visual testing, and run as automated tests - one artifact, multiple uses.

## Coverage Requirements

- **Target**: 100% test coverage
- **Minimum**: 90% coverage (enforced in CI)
- **Check coverage**: `pnpm test:ci`

## Required Story Types

Every component must have these stories:

1. **Default**: Component with typical/default props
2. **All Variants**: Each distinct visual variant (primary, secondary, large, small, etc.)
3. **Edge Cases**:
   - Empty state (no data, no children)
   - Long text / overflow scenarios
   - Minimum and maximum data bounds
   - Loading states (if applicable)
   - Error states (if applicable)

## Story File Structure

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, expect } from 'storybook/test';  // NOT @storybook/test
import { Button } from './button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    onClick: fn(),  // Auto-mock for interaction tracking
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    children: 'Click me',
    variant: 'primary',
  },
};

// Variant stories
export const Secondary: Story = {
  args: {
    children: 'Click me',
    variant: 'secondary',
  },
};

// Edge case: Long text
export const LongText: Story = {
  args: {
    children: 'This is a very long button label that tests overflow behavior',
    variant: 'primary',
  },
};

// Interactive test with play function
export const InteractiveTest: Story = {
  args: {
    children: 'Click to test',
    variant: 'primary',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    
    // Test interaction
    await userEvent.click(button);
    
    // Verify mock was called
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
```

## Critical Import Path

**Import from `storybook/test`**, NOT `@storybook/test`:

```tsx
// ✅ Correct
import { fn, userEvent, expect, within } from 'storybook/test';

// ❌ Incorrect
import { fn, userEvent, expect } from '@storybook/test';
```

**Why**: The project uses the Vitest adapter integration which aliases to `storybook/test`.

## Meta Configuration

Use `@storybook/nextjs-vite` for type imports:

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
```

## Play Functions for Interaction Testing

Use `play` functions to test interactive behavior:

```tsx
export const InteractiveSubmit: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Find elements
    const input = canvas.getByLabelText('Email');
    const submitButton = canvas.getByRole('button', { name: /submit/i });
    
    // Interact
    await userEvent.type(input, 'test@example.com');
    await userEvent.click(submitButton);
    
    // Assert
    await expect(args.onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
    });
  },
};
```

## Running Tests

### Development (watch mode)
```bash
pnpm test
```

### CI/Production (with coverage)
```bash
pnpm test:ci
```

**Always run `pnpm test:ci` after making changes** to ensure coverage targets are met.

## Accessibility Testing

The project has `@storybook/addon-a11y` enabled with `test: 'todo'` mode in preview.

**Manual testing**: Check the "Accessibility" tab in Storybook for each story.

## Storybook Server

**Check first**: Storybook may already be running at `http://localhost:6006/`.

```bash
# Start Storybook if not running
pnpm storybook
```

**Don't restart unnecessarily** - check the terminal or browser first.

## Testing Best Practices

- **Write stories first**: Stories guide component implementation
- **Test user behavior**: Focus on what users see and do, not implementation details
- **Mock external dependencies**: Use `fn()` for callbacks, mock API calls
- **Test all states**: Loading, error, empty, success
- **Verify accessibility**: Use semantic HTML and ARIA attributes
- **Keep tests focused**: One concern per story when possible

## Example: Comprehensive Component Testing

```tsx
// card.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, expect, within } from 'storybook/test';
import { Card } from './card';

const meta = {
  title: 'Components/Card',
  component: Card,
  args: {
    buttonProps: {
      onClick: fn(),
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Card Title',
    description: 'This is a card description',
    buttonProps: {
      children: 'Learn More',
    },
  },
};

export const NoButton: Story = {
  args: {
    title: 'Card without action',
    description: 'This card has no button',
  },
};

export const LongContent: Story = {
  args: {
    title: 'Very Long Title That Tests Overflow Behavior In Card Headers',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10),
    buttonProps: {
      children: 'Read Full Article',
    },
  },
};

export const WithInteraction: Story = {
  args: {
    title: 'Interactive Card',
    description: 'Click the button to test',
    buttonProps: {
      children: 'Click Me',
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /click me/i });
    
    await userEvent.click(button);
    await expect(args.buttonProps?.onClick).toHaveBeenCalled();
  },
};
```

## Coverage Verification

After running `pnpm test:ci`, check:
- Console output for coverage percentages
- `coverage/` directory for detailed HTML report
- Coverage must be ≥90% for all files

## Troubleshooting

**Stories not running as tests?**
- Verify `@storybook/addon-vitest` is installed
- Check `vitest.config.ts` has correct Storybook plugin configuration
- Ensure imports use `storybook/test`, not `@storybook/test`

**Coverage gaps?**
- Add more stories covering untested branches
- Add `play` functions for interactive paths
- Verify all variants are represented
