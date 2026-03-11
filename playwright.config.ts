import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
	},
	testDir: 'e2e',
	use: {
		launchOptions: {
			// Keep headless WebGL stable in CI/headless by using software rendering.
			args: ['--use-gl=angle', '--use-angle=swiftshader'],
		},
	},
});
