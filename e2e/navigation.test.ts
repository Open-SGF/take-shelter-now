import { expect, test } from '@playwright/test';

const savedLocation = { latitude: 37.208957, longitude: -93.292299, address: '123 Main St' };

test('location redirects replace history and preserve the app shell', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/');
	await expect(page).toHaveURL(/\/location\/?$/);

	const historyLength = await page.evaluate(() => history.length);
	await page.evaluate((location) => {
		localStorage.setItem('take-shelter-location', JSON.stringify(location));
	}, savedLocation);
	await page.reload();
	await expect(page.getByTestId('location-back')).toBeVisible();
	await page.getByTestId('nav-menu-trigger').click();
	await expect(page.getByTestId('nav-menu-edit-location')).toHaveCount(0);
	await page.keyboard.press('Escape');
	await page.getByTestId('location-back').click();
	await expect(page).toHaveURL(/\/$/);
	await expect(page.getByTestId('shelter-list')).toBeVisible();
	await expect(page.getByTestId('map')).toHaveCount(1);
	// The initial redirect replaced the root entry, while the Back link adds one entry.
	expect(await page.evaluate(() => history.length)).toBe(historyLength + 1);
	expect(errors).toEqual([]);
});

test('filter changes replace the URL without closing the popover or adding history entries', async ({
	page,
}) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.addInitScript((location) => {
		localStorage.setItem('take-shelter-location', JSON.stringify(location));
	}, savedLocation);
	await page.goto('/?pets=true');
	await expect(page.getByTestId('shelter-list')).toBeVisible();
	const historyLength = await page.evaluate(() => history.length);
	await page.getByTestId('filter-trigger').click();
	await expect(page.getByTestId('filter-pets-checkbox')).toBeChecked();
	await page.getByTestId('filter-accessibility-checkbox').click();
	await expect(page).toHaveURL(/\/\?pets=true&accessible=true$/);
	await expect(page.getByTestId('filter-popover')).toBeVisible();
	await expect(page.getByTestId('filter-accessibility-checkbox')).toBeFocused();
	await page.getByTestId('clear-filters-button').click();
	await expect(page).toHaveURL(/\/$/);
	expect(await page.evaluate(() => history.length)).toBe(historyLength);
	expect(errors).toEqual([]);
});

test('prerendered data, detail routes, and metadata remain usable', async ({ request, page }) => {
	const shelters = await request.get('/shelters.json');
	expect(shelters.ok()).toBe(true);
	expect(shelters.headers()['content-type']).toContain('application/json');
	const data: { slug: string }[] = await shelters.json();
	expect(Array.isArray(data)).toBe(true);

	const sitemap = await request.get('/sitemap.xml');
	expect(sitemap.ok()).toBe(true);
	expect(sitemap.headers()['content-type']).toContain('xml');
	expect(await sitemap.text()).toContain('<urlset');

	const robots = await request.get('/robots.txt');
	expect(robots.ok()).toBe(true);
	expect(await robots.text()).toContain('User-agent: *');

	const image = await request.get('/og.png');
	expect(image.ok()).toBe(true);
	expect(image.headers()['content-type']).toContain('image/png');

	// Builds without a sheet still serve metadata, but have no detail routes to visit.
	if (data.length > 0) {
		const slug = data[0].slug;
		const detail = await request.get(`/shelters/${slug}/`);
		expect(detail.ok()).toBe(true);
		expect(await detail.text()).toContain('data-testid="shelter-detail"');
		const detailImage = await request.get(`/shelters/${slug}/og.png`);
		expect(detailImage.ok()).toBe(true);
		expect(detailImage.headers()['content-type']).toContain('image/png');

		await page.addInitScript((location) => {
			localStorage.setItem('take-shelter-location', JSON.stringify(location));
			sessionStorage.setItem(
				'take-shelter-return-filters',
				JSON.stringify({
					openNow: false,
					petFriendly: true,
					accessibility: false,
					hasBackupPower: false,
					categories: [],
				}),
			);
		}, savedLocation);
		await page.goto(`/shelters/${slug}/`);
		await page.getByTestId('shelter-detail-back').click();
		await expect(page).toHaveURL(/\/\?pets=true$/);
		await expect(page.getByTestId('shelter-list')).toBeVisible();
	}
});
