# AGENTS.md

This file provides guidance to agentic coding agents working in this repository.

## Build/Lint/Test Commands

### Development

```bash
npm run dev              # Start dev server
npm run dev -- --open    # Start dev server and open browser
```

### Building & Preview

```bash
npm run build            # Build for production (static site)
npm run preview          # Preview production build locally
```

### Code Quality

```bash
npm run check            # Type check with svelte-check (fails on warnings)
npm run check:watch      # Type check in watch mode
npm run lint             # Run prettier check and eslint
npm run format           # Format all files with prettier
```

### Testing

```bash
npm run test:unit        # Run Vitest unit tests in watch mode
npm run test:unit -- --run  # Run unit tests once
npm run test:unit:coverage  # Run unit tests with coverage report
npm run test:e2e         # Run Playwright e2e tests (builds first)
npm run test             # Run all tests (unit + e2e)
```

### Running Single Tests

```bash
# Unit tests (Vitest)
npm run test:unit path/to/file.test.ts
npm run test:unit -- path/to/file.test.ts  # Alternative syntax

# E2E tests (Playwright)
npm run test:e2e path/to/test.spec.ts
```

### Data Management

```bash
npm run fetch-shelters   # Fetch shelter data from Google Sheets and convert to JSON
```

## Code Style Guidelines

### Imports

- Use `$lib/` for internal imports (SvelteKit convention)
- Group imports: external libraries first, then internal modules
- Use named imports for components: `import { Header } from '$lib/components/ui/Header'`
- Default imports for Svelte components: `import GetLocation from '$lib/components/ui/GetLocation/GetLocation.svelte'`

### Formatting

- Prettier handles all formatting (configured in package.json)
- Use `npm run format` to format all files
- No manual formatting required - let Prettier handle it
- Line endings: LF (Unix style)

### TypeScript

- Strict mode enabled in tsconfig.json
- Use `lang="ts"` in all Svelte script blocks
- Define interfaces for data structures (see `src/lib/stores/global.ts`)
- Use proper typing for function parameters and return values
- Avoid `any` type - use proper typing or `unknown` when necessary

### Naming Conventions

- **Components**: PascalCase (e.g., `ShelterCard`, `GetLocation`)
- **Files**: kebab-case for directories, PascalCase for component files
- **Variables**: camelCase
- **Stores**: camelCase with descriptive names (e.g., `userLocation`, `hasLocation`)
- **Functions**: camelCase with descriptive verbs (e.g., `calculateDistance`, `loadAndSortShelters`)

### Component Structure

- Each UI component lives in its own directory under `src/lib/components/ui/`
- Directory structure: `ComponentName/ComponentName.svelte` + `index.ts`
- Export components from `index.ts` for clean imports
- Use shadcn-svelte patterns for component props and styling

### State Management

- Use Svelte stores for global state (`src/lib/stores/global.ts`)
- Subscribe to stores in components using `$store` syntax
- Update stores via store methods (`.set()`, `.update()`)
- Keep store interfaces well-typed

### Error Handling

- Use try-catch blocks for async operations
- Log errors with `console.error()` for debugging
- Handle fetch errors gracefully
- Don't throw errors in UI components - handle them locally

### Styling

- Use Tailwind CSS utility classes
- Use `cn()` utility function for conditional classes
- Responsive design with `max-md:` prefixes for mobile
- Global styles in component `<style>` blocks with `:global()` modifier
- No CSS modules or styled-components

### Testing

- Unit tests: `**/*.svelte.test.ts` for components, `**/*.test.ts` for utilities
- E2E tests: `e2e/*.spec.ts` with Playwright
- Use Testing Library for Svelte component testing
- Test user behavior, not implementation details
- Mock external dependencies (fetch, geolocation, etc.)

### Svelte Specific

- Use Svelte 5 syntax (runes where applicable)
- Prefer `onMount` for initialization logic
- Use `{#if}` blocks for conditional rendering
- Use `{#each}` with key for lists
- Bind DOM elements with `bind:this={element}`
- Use `$store` syntax for reactive store values

### Performance

- Static site generation - no backend server
- Minimize bundle size for fast loading
- Use `preferCanvas: true` for Leaflet maps
- Lazy load components when appropriate
- Optimize images and assets

### Git & Commits

- Conventional commit messages preferred
- Run `npm run lint` and `npm run check` before committing
- Include tests for new features
- Update documentation when needed

## Architecture Notes

- **Static Site**: No backend - all data bundled at build time
- **Data Flow**: Google Sheets → JSON → static assets → client
- **Maps**: Leaflet.js with OpenStreetMap tiles
- **Styling**: Tailwind CSS 4 + shadcn-svelte components
- **Testing**: Vitest (unit) + Playwright (e2e)
- **Node Version**: 22.x

## Important Files

- `src/routes/+page.svelte` - Main page with map and UI
- `src/lib/stores/global.ts` - Global state management
- `src/lib/utils.ts` - Utilities including distance calculation
- `scripts/fetch-shelters.ts` - Data fetching script
- `vite.config.ts` - Build and test configuration
