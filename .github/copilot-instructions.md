# Copilot Instructions for Code Connect Trials

## Project Overview
Next.js 16 + React 19 component library with Storybook 10, using Tailwind CSS v4 and Figma design integration via MCP. Testing via Storybook stories with Vitest + Playwright.

**Package Manager**: `pnpm` (not npm/yarn)

## Quality Gates (Zero Tolerance)
Before completing any work, ALL must pass:
- `pnpm lint` - zero errors/warnings
- `pnpm typecheck` - zero errors
- `pnpm test:ci` - 100% passing, 90%+ coverage

## Key Commands
- `pnpm dev` - Next.js dev server (port 3000)
- `pnpm storybook` - Storybook dev (port 6006)
- `pnpm test:ci` - CI mode with coverage
- `pnpm lint:fix` - Auto-fix linting issues

## Detailed Guides
For specific tasks, refer to these focused guides:

- **[Component Architecture](./instructions/component-architecture.md)** - Structure, props patterns, TSDoc requirements
- **[Styling Guide](./instructions/styling-guide.md)** - Tailwind v4 specifics, design tokens, CSS patterns
- **[Testing Strategy](./instructions/testing-strategy.md)** - Story-driven testing, coverage requirements
- **[Figma Workflow](./instructions/figma-workflow.md)** - Design import process, token naming
- **[Code Conventions](./instructions/code-conventions.md)** - Naming, exports, imports

## Essential Project Files
- `.github/instructions/` - Domain-specific guidelines (a11y, agents, markdown, GitHub Actions)
- `.github/prompts/` - Reusable AI workflows (Figma import)
- `.github/agents/` - Specialized agent personas
- `src/lib/utils.ts` - `cn()` utility for className merging
- `src/app/globals.css` - Design tokens in `@theme inline` block
