# SvelteKit 3

The app uses SvelteKit 3 and adapter-static 4. It still deploys as a static site. Shelter JSON, detail pages, sitemaps, and social images are generated during the build.

## Configuration and imports

- SvelteKit options and preprocessing live in `vite.config.ts`. There is no `svelte.config.js`.
- `tsconfig.json` extends `$app/tsconfig` and includes application code, tests, Storybook, and root configuration files.
- Library imports use the `#lib` subpath imports in `package.json`. Include a file extension, such as `#lib/config.js`, `#lib/geo/index.js`, or `#lib/components/layout/Map/Map.svelte`. TypeScript resolves `.js` imports to the corresponding `.ts` source.
- Route components and handlers use generated `./$types` where they accept route data, children, or request events.

## Environment variables

`src/env.ts` declares the settings imported through `$app/env/public` and `$app/env/private`. They are static so the deployed site does not need a runtime environment endpoint. Changes require a rebuild.

`PUBLIC_SITE_ENV` defaults to `development`, which disables indexing and analytics. `PUBLIC_SHELTERS_JSON_URL` defaults to `/shelters.json`. The Google Sheet ID and gid remain private and optional. Without a sheet ID, builds produce an empty shelter dataset.

The canonical site URL still comes from the Vite build constant. `PUBLIC_SITE_URL` takes precedence over Netlify's `DEPLOY_PRIME_URL`, then the production URL.

## Navigation

Use route IDs with `resolve`, including `/(requires-location)` for the list. Pathnames passed to `resolve` do not start with `/` in SvelteKit 3.

`goto` uses `replace` instead of `replaceState`. Filter URL updates also use `reset: false` to preserve focus and scroll. Returning from a detail page resolves the list route before appending filter parameters, so a query cannot leave the user on the detail route.

## Dependency and preview compatibility

`runed`, pulled in by bits-ui and svelte-toolbelt, still declares an optional SvelteKit 2 peer. The scoped override in `package.json` uses the app's SvelteKit 3 version rather than introducing a second Kit installation. Remove this override when runed's peer range includes Kit 3. The app does not use runed's SvelteKit search-parameter helper.

Storybook and unit tests run outside SvelteKit's browser bootstrap. They use `.storybook/mocks/env-public.ts` for public settings, so previews use local mock shelter data and do not enable production analytics. Storybook's runtime preview entry point currently has no exported TypeScript declarations, which is documented at its import in `vitest/setup-storybook.ts`.

See the [official migration guide](https://svelte.dev/docs/kit/migrating-to-sveltekit-3) for the full list of changes.
