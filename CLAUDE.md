# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Take Shelter Now is a static website helping people in weather emergencies find nearby shelters quickly. The site currently targets the Springfield, MO region and prioritizes fast loading times and zero hosting costs.

## Key Commands

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

### Data Management

```bash
npm run fetch-shelters   # Fetch shelter data from Google Sheets and convert to JSON
```

This script fetches the latest shelter data from a public Google Sheet, converts the CSV to JSON, and saves it to `static/shelters.json`. Run this whenever shelter data needs to be updated.

## Architecture

### Tech Stack

- **Framework**: Svelte 5 + SvelteKit with static adapter (no backend)
- **Styling**: Tailwind CSS 4 + shadcn-svelte components
- **Maps**: Leaflet.js with OpenStreetMap tiles
- **Testing**: Vitest (unit) + Playwright (e2e)
- **Data**: Google Sheets → static JSON at build time

### Project Structure

#### Core Application

- `src/routes/+page.svelte` - Main page with Leaflet map and shelter UI
- `src/routes/+layout.svelte` - Root layout
- `src/lib/stores/global.ts` - Svelte stores for `hasLocation`, `userLocation`, and `shelters`
- `src/lib/utils.ts` - Utilities including `calculateDistance()` (Haversine formula)

#### Components

All UI components live in `src/lib/components/ui/` with each component in its own directory:

- `Header/` - Site header
- `Sheet/` - Sidebar container (responsive: sidebar on desktop, bottom sheet on mobile)
- `GetLocation/` - Location permission prompt shown when user hasn't granted location access
- `ShelterList/` - Displays shelters sorted by distance from user location
- `ShelterCard/` - Individual shelter card with name, address, distance

Each component directory contains the `.svelte` file and an `index.ts` for exports.

#### Data Flow

1. `scripts/fetch-shelters.ts` fetches CSV from Google Sheets and converts to JSON
2. Shelter data saved to `static/shelters.json` (tracked in git)
3. `npm run prebuild` automatically runs `fetch-shelters` before each build
4. `ShelterList.svelte` fetches `/shelters.json` and sorts by distance using `calculateDistance()`

### State Management

Global state uses Svelte stores (`src/lib/stores/global.ts`):

- `hasLocation`: Boolean tracking if user granted location permission
- `userLocation`: Object with `{ latitude, longitude }` or `null`
- `shelters`: Array of shelter objects with calculated distances

When `userLocation` changes:

1. Main page (`+page.svelte`) updates the map marker with pulsing ring animation
2. `ShelterList.svelte` recalculates distances and re-sorts shelters
3. Map automatically fits bounds to show all shelters and user location

### Testing Strategy

**Unit Tests** (Vitest):

- File pattern: `**/*.svelte.test.ts` for Svelte components, `**/*.test.ts` for other files
- Two test projects in `vite.config.ts`:
  - `client`: jsdom environment for Svelte components (`src/**/*.svelte.{test,spec}.{js,ts}`)
  - `server`: node environment for other code (`src/**/*.{test,spec}.{js,ts}` excluding Svelte tests)
- Setup file: `vitest-setup-client.ts` for client tests
- Example: `src/routes/page.svelte.test.ts`

**E2E Tests** (Playwright):

- Located in `e2e/` directory
- Runs against built production bundle (`npm run build && npm run preview`)
- Configured in `playwright.config.ts` to auto-build and start preview server

### Map Implementation

The Leaflet map in `+page.svelte`:

- Default center: Springfield, MO (37.208957, -93.292299)
- Zoom levels: min 13, max 30
- Custom user location marker with pulsing ring animation (CSS in component `<style>`)
- User marker updates reactively via `userLocation.subscribe()`
- Shelter markers added via `shelters.subscribe()` with popups showing name and address
- Auto-fits bounds to show all shelters and user location when shelters load

### Styling Patterns

- Uses Tailwind CSS 4 utility classes
- shadcn-svelte provides base components (imported from `$lib/components/ui/`)
- `cn()` utility function (from `$lib/utils.ts`) merges Tailwind classes with `clsx` + `tailwind-merge`
- Responsive design: sidebar on desktop (`w-[400px]`), bottom sheet on mobile (`max-md:` utilities)

## Important Notes

- **Static site**: No backend server. All data bundled at build time
- **Data updates**: The `prebuild` script automatically fetches fresh shelter data before each build
- **Svelte 5**: Uses modern Svelte 5 syntax (runes may appear in newer code)
- **Bundle size**: Priority is small bundle sizes for fast loading on poor connections
- The project uses Node 22.x
