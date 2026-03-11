import { expect, test } from '@playwright/test';

test('App shell switches layouts on resize without remounting map', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });

	await page.goto('/', {
		waitUntil: 'domcontentloaded',
	});

	await expect(page.getByTestId('app-shell')).toBeVisible();
	await expect(page.getByTestId('map')).toHaveCount(1);
	await expect(page.getByTestId('sheet')).toBeVisible();
	await expect(page.getByTestId('sidebar')).toHaveCount(0);

	const initialMapHandle = await page.getByTestId('map').elementHandle();
	if (!initialMapHandle) {
		throw new Error('Map element was not found at mobile viewport');
	}

	await page.setViewportSize({ width: 1280, height: 900 });

	await expect(page.getByTestId('sidebar')).toBeVisible();
	await expect(page.getByTestId('sheet')).toHaveCount(0);

	const desktopMapHandle = await page.getByTestId('map').elementHandle();
	if (!desktopMapHandle) {
		throw new Error('Map element was not found at desktop viewport');
	}

	const sameMapOnDesktop = await initialMapHandle.evaluate(
		(mapElement, currentMapElement) => mapElement === currentMapElement,
		desktopMapHandle,
	);
	expect(sameMapOnDesktop).toBe(true);

	await page.setViewportSize({ width: 390, height: 844 });

	await expect(page.getByTestId('sheet')).toBeVisible();
	await expect(page.getByTestId('sidebar')).toHaveCount(0);

	const mobileMapHandle = await page.getByTestId('map').elementHandle();
	if (!mobileMapHandle) {
		throw new Error('Map element was not found after returning to mobile viewport');
	}

	const sameMapOnMobile = await initialMapHandle.evaluate(
		(mapElement, currentMapElement) => mapElement === currentMapElement,
		mobileMapHandle,
	);
	expect(sameMapOnMobile).toBe(true);
});
