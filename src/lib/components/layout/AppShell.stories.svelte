<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, waitFor, within } from 'storybook/test';
	import { Map } from '$lib/components/ui/Map';
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
</script>

{#snippet MapSnippet()}
	<Map class="h-full w-full" markers={shelterMarkers} defaultZoom={13} />
{/snippet}

{#snippet DefaultTemplate()}
	<AppShell>
		{#snippet map()}
			{@render MapSnippet()}
		{/snippet}

		<div class="space-y-4 p-4">
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
	name="Default"
	template={DefaultTemplate}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await expect(canvas.getByTestId('app-shell')).toBeInTheDocument();
		await expect(canvas.getByTestId('nav')).toBeInTheDocument();

		await waitFor(() => {
			expect(canvas.getAllByTestId('map-marker').length).toBeGreaterThan(0);
		});

		await expect(canvas.getByText('Shelter Results')).toBeInTheDocument();
	}}
/>
