<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { ComponentProps } from 'svelte';
	import { expect, fireEvent, fn, waitFor } from 'storybook/test';
	import Map from './Map.svelte';

	const springfieldCenter = { latitude: 37.208957, longitude: -93.292299 };
	type MapArgs = ComponentProps<typeof Map>;
	type StoryMarker = NonNullable<MapArgs['markers']>[number];

	const markers: StoryMarker[] = [
		{ id: 'north', label: 'North Point', latitude: 37.2465, longitude: -93.3013 },
		{ id: 'downtown', label: 'Downtown Point', latitude: 37.2082, longitude: -93.2926 },
		{ id: 'south', label: 'South Point', latitude: 37.1601, longitude: -93.2719 },
	];

	const { Story } = defineMeta({
		title: 'UI/Map',
		component: Map,
		args: {
			defaultCenter: springfieldCenter,
			defaultZoom: 13,
			markers: [],
		},
	});
</script>

<script lang="ts">
	const mapShellClass =
		'relative h-dvh w-full overflow-hidden bg-[linear-gradient(180deg,#f5f7fa_0%,#dde4ea_100%)]';
</script>

{#snippet StoryShell(args: MapArgs)}
	<div class={mapShellClass}>
		<Map {...args} class="h-full w-full" />
	</div>
{/snippet}

{#snippet DefaultTemplate(args: MapArgs)}
	{@render StoryShell(args)}
{/snippet}

<Story name="Default" template={DefaultTemplate} />

<Story
	name="Multiple Markers"
	args={{ markers }}
	template={DefaultTemplate}
	play={async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement.querySelectorAll('.tsn-map-marker-icon').length).toBe(3);
		});
	}}
/>

<Story
	name="With Current Location"
	args={{
		markers,
		currentLocation: { latitude: 37.205, longitude: -93.285 },
	}}
	template={DefaultTemplate}
	play={async ({ canvasElement }) => {
		await waitFor(() => {
			expect(canvasElement.querySelectorAll('.tsn-map-marker-icon').length).toBe(3);
			expect(canvasElement.querySelectorAll('.tsn-current-location-icon').length).toBe(1);
		});
	}}
/>

<Story
	name="Marker Tap Callback"
	args={{
		markers,
		onMarkerTap: fn(),
	}}
	template={DefaultTemplate}
	play={async ({ canvasElement, args }) => {
		await waitFor(() => {
			expect(canvasElement.querySelectorAll('.tsn-map-marker-icon').length).toBeGreaterThan(0);
		});

		const firstMarker = canvasElement.querySelector('.tsn-map-marker-icon');
		expect(firstMarker).toBeTruthy();

		await fireEvent.click(firstMarker!);
		await expect(args.onMarkerTap).toHaveBeenCalledTimes(1);
	}}
/>
