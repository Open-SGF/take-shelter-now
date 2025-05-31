import { test, expect } from '@playwright/test';

test('Page loads without errors', async ({ page }) => {
	const consoleErrors: string[] = [];
	page.on('console', (msg) => {
		if (msg.type() === 'error') {
			consoleErrors.push(msg.text());
		}
	});

	const pageErrors: string[] = [];
	page.on('pageerror', (error) => {
		pageErrors.push(error.message);
	});

	const response = await page.goto('/', {
		waitUntil: 'networkidle'
	});

	expect(response?.status()).toBe(200);

	await page.waitForLoadState('domcontentloaded');

	expect(consoleErrors).toHaveLength(0);

	expect(pageErrors).toHaveLength(0);
});
