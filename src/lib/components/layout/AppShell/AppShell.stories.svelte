<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, waitFor, within } from 'storybook/test';
	import { Map } from '$lib/components/layout';
	import AppShell from './AppShell.svelte';

	const shelterMarkers = [
		{ id: 'north', label: 'North Shelter', latitude: 37.2392, longitude: -93.2951 },
		{ id: 'center', label: 'Center Shelter', latitude: 37.208957, longitude: -93.292299 },
		{ id: 'south', label: 'South Shelter', latitude: 37.1735, longitude: -93.2868 },
	];

	const { Story } = defineMeta({
		title: 'Layout/App Shell',
		component: AppShell,
	});

	const assertMobileLayout = async (canvasElement: HTMLElement) => {
		const canvas = within(canvasElement);

		await expect(canvas.getByTestId('app-shell')).toBeInTheDocument();
		await expect(canvas.getByTestId('nav')).toBeInTheDocument();
		await expect(canvas.getByTestId('sheet')).toBeInTheDocument();
		await expect(canvas.queryByTestId('sidebar')).not.toBeInTheDocument();

		await waitFor(() => {
			expect(canvas.getAllByTestId('map-marker').length).toBeGreaterThan(0);
		});

		await waitFor(() => {
			expect(canvas.getByTestId('map-viewport-settled-count')).toHaveTextContent(/^[1-9]\d*$/);
		});

		await expect(canvas.getByText('Shelter Results')).toBeInTheDocument();
		await expect(canvas.getAllByTestId('map')).toHaveLength(1);
	};

	const assertDesktopLayout = async (canvasElement: HTMLElement) => {
		const canvas = within(canvasElement);

		await expect(canvas.getByTestId('app-shell')).toBeInTheDocument();
		await expect(canvas.getByTestId('nav')).toBeInTheDocument();

		await waitFor(() => {
			expect(canvas.getByTestId('sidebar')).toBeInTheDocument();
		});

		await expect(canvas.queryByTestId('sheet')).not.toBeInTheDocument();

		await waitFor(() => {
			expect(canvas.getAllByTestId('map-marker').length).toBeGreaterThan(0);
		});

		await waitFor(() => {
			expect(canvas.getByTestId('map-viewport-settled-count')).toHaveTextContent(/^[1-9]\d*$/);
		});

		await expect(canvas.getByText('Shelter Results')).toBeInTheDocument();
		await expect(canvas.getAllByTestId('map')).toHaveLength(1);
	};
</script>

<script lang="ts">
	let mapViewportSettledCount = $state(0);
</script>

{#snippet DefaultTemplate()}
	<AppShell>
		{#snippet map()}
			<Map
				class="h-full w-full"
				markers={{ items: shelterMarkers }}
				viewport={{ defaultZoom: 13 }}
				onViewportChange={{
					onChanged: () => {
						mapViewportSettledCount += 1;
					},
				}}
			/>
		{/snippet}

		<div class="space-y-4 p-4">
			<div class="sr-only" data-testid="map-viewport-settled-count">{mapViewportSettledCount}</div>
			<div>
				<h2 class="text-lg font-semibold text-slate-900">Shelter Results</h2>
				<p class="text-sm text-slate-600">Tap a shelter to update map context.</p>
			</div>
			<div class="space-y-2">
				{#each Array.from({ length: 10 }, (_, index) => index) as index (index)}
					<div class="rounded-lg bg-slate-100 p-3 text-sm">
						<div class="font-semibold text-slate-900">Shelter {index + 1}</div>
						<div class="text-xs text-slate-600">Open now · 1.{index} miles away</div>
					</div>
				{/each}
			</div>
		</div>
	</AppShell>
{/snippet}

<Story
	name="Mobile"
	template={DefaultTemplate}
	globals={{ viewport: { value: 'mobile1', isRotated: false } }}
	play={async ({ canvasElement }) => {
		await assertMobileLayout(canvasElement);
	}}
/>

<Story
	name="Desktop"
	template={DefaultTemplate}
	globals={{ viewport: { value: 'desktop', isRotated: false } }}
	play={async ({ canvasElement }) => {
		await assertDesktopLayout(canvasElement);
	}}
/>
