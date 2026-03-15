import 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import tailwindcss from '@tailwindcss/vite';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { svelteTesting } from '@testing-library/svelte/vite';
import { playwright } from '@vitest/browser-playwright';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

function getVersion(): string {
	try {
		const versionFile = fs.readFileSync('version.json', 'utf-8');
		const { version } = JSON.parse(versionFile);
		return version;
	} catch {
		// version.json doesn't exist, fall through to other methods
	}

	if (process.env.COMMIT_REF) {
		return process.env.COMMIT_REF.slice(0, 7);
	}

	return 'dev';
}

export default defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify(getVersion()),
	},
	optimizeDeps: {
		include: ['storybook/preview-api', '@storybook/svelte/entry-preview'],
	},
	plugins: [tailwindcss(), sveltekit()],
	test: {
		coverage: {
			exclude: [
				'.svelte-kit/**',
				'build/**',
				'eslint.config.js',
				'playwright.config.ts',
				'svelte.config.js',
				'vite.config.ts',
			],
		},
		projects: [
			{
				extends: './vite.config.ts',
				plugins: [svelteTesting()],
				test: {
					name: 'unit',
					environment: 'jsdom',
					clearMocks: true,
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest/setup.ts'],
				},
			},
			{
				extends: './vite.config.ts',
				plugins: [
					storybookTest({
						configDir: path.join(rootDir, '.storybook'),
						storybookScript: 'npm run storybook -- --no-open',
					}),
				],
				test: {
					name: 'storybook',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium' }],
						headless: true,
					},
					setupFiles: ['./vitest/setup-storybook.ts'],
				},
			},
		],
	},
});
