import { expect, test } from '@playwright/test';

test('production map serves its MapLibre worker', async ({ page }) => {
	const workerResponse = page.waitForResponse((response) =>
		/maplibre-gl-worker[^/]*\.(?:mjs|js)$/.test(new URL(response.url()).pathname),
	);

	await page.goto('/location/', { waitUntil: 'domcontentloaded' });
	await expect(page.getByTestId('map')).toBeVisible();

	const response = await workerResponse;
	expect(response.ok(), `MapLibre worker failed to load: ${response.url()}`).toBe(true);
});
