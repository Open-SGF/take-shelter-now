<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { ComponentProps } from 'svelte';
	import { expect, fireEvent, fn, waitFor, within } from 'storybook/test';
	import Map from './Map.svelte';

	const springfieldCenter = { latitude: 37.208957, longitude: -93.292299 };
	type MapArgs = ComponentProps<typeof Map>;
	type StoryMarker = NonNullable<MapArgs['markers']>[number];

	const markers: StoryMarker[] = [
		{ id: 'north', label: 'North Point', latitude: 37.2465, longitude: -93.3013 },
		{ id: 'downtown', label: 'Downtown Point', latitude: 37.2082, longitude: -93.2926 },
		{ id: 'south', label: 'South Point', latitude: 37.1601, longitude: -93.2719 },
	];

	const replacementMarkers: StoryMarker[] = [
		{ id: 'replacement', label: 'Replacement Point', latitude: 37.1981, longitude: -93.3034 },
	];

	const markersWithInvalidPoints: StoryMarker[] = [
		{ id: 'valid-a', label: 'Valid A', latitude: 37.2441, longitude: -93.3371 },
		{ id: 'invalid-lat', label: 'Invalid Lat', latitude: Number.NaN, longitude: -93.2999 },
		{ id: 'valid-b', label: 'Valid B', latitude: 37.1855, longitude: -93.2578 },
		{
			id: 'invalid-lng',
			label: 'Invalid Lng',
			latitude: 37.201,
			longitude: Number.POSITIVE_INFINITY,
		},
	];

	const { Story } = defineMeta({
		title: 'Layout/Map',
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

	const locationHarnessMarkers: StoryMarker[] = [
		{ id: 'loc-a', label: 'Location A', latitude: 37.214, longitude: -93.302 },
		{ id: 'loc-b', label: 'Location B', latitude: 37.198, longitude: -93.284 },
	];
	const initialCurrentLocation = { latitude: 37.205, longitude: -93.285 };
	const recenterMovedCurrentLocation = { latitude: 37.214, longitude: -93.279 };
	const movedCurrentLocationNorthEast = { latitude: 37.235, longitude: -93.252 };
	const movedCurrentLocationSouthWest = { latitude: 37.178, longitude: -93.328 };

	let recenterMarkers = $state<StoryMarker[]>([...markers]);
	let recenterCurrentLocation = $state<MapArgs['currentLocation']>(null);
	let recenterViewportEventCount = $state(0);
	let recenterViewportLastMode = $state<'default' | 'single' | 'bounds' | 'none'>('none');

	let locationMarkers = $state<StoryMarker[]>([...locationHarnessMarkers]);
	let locationCurrentLocation = $state<MapArgs['currentLocation']>(initialCurrentLocation);
	let locationViewportEventCount = $state(0);
	let locationViewportLastMode = $state<'default' | 'single' | 'bounds' | 'none'>('none');

	let selectionMarkers = $state<StoryMarker[]>([...markers]);
	let selectionViewportEventCount = $state(0);
	let selectionViewportLastMode = $state<'default' | 'single' | 'bounds' | 'none'>('none');

	let centerPinEnabled = $state(false);
	let centerPinLocation = $state<MapArgs['centerPinLocation']>(springfieldCenter);
	let centerChangeEventCount = $state(0);
	let centerChangeLastLocation = $state<NonNullable<MapArgs['centerPinLocation']> | null>(null);

	const resetRecenterState = () => {
		recenterMarkers = [...markers];
		recenterCurrentLocation = null;
		recenterViewportEventCount = 0;
		recenterViewportLastMode = 'none';
	};

	const resetCurrentLocationState = () => {
		locationMarkers = [...locationHarnessMarkers];
		locationCurrentLocation = initialCurrentLocation;
		locationViewportEventCount = 0;
		locationViewportLastMode = 'none';
	};

	const resetSelectionState = () => {
		selectionMarkers = [...markers];
		selectionViewportEventCount = 0;
		selectionViewportLastMode = 'none';
	};

	const resetCenterPinState = () => {
		centerPinEnabled = false;
		centerPinLocation = springfieldCenter;
		centerChangeEventCount = 0;
		centerChangeLastLocation = null;
	};

	const selectMarker = (id: string) => {
		selectionMarkers = selectionMarkers.map((m) => ({
			...m,
			isSelected: m.id === id,
		}));
	};

	const deselectAllMarkers = () => {
		selectionMarkers = selectionMarkers.map((m) => ({ ...m, isSelected: false }));
	};
</script>

{#snippet StoryShell(args: MapArgs)}
	<div class={mapShellClass}>
		<Map {...args} class="h-full w-full" />
	</div>
{/snippet}

{#snippet DefaultTemplate(args: MapArgs)}
	{@render StoryShell(args)}
{/snippet}

{#snippet RecenterHarnessTemplate()}
	<div class={mapShellClass}>
		<div
			class="absolute top-3 left-3 z-[1000] flex max-w-[20rem] flex-wrap gap-2 rounded-lg bg-white/95 p-2 shadow-md"
		>
			<button
				type="button"
				class="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
				data-testid="reset-harness"
				onclick={resetRecenterState}
			>
				Reset harness
			</button>
			<button
				type="button"
				class="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
				data-testid="restore-initial-markers"
				onclick={() => (recenterMarkers = [...markers])}
			>
				Restore markers
			</button>
			<button
				type="button"
				class="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
				data-testid="replace-markers"
				onclick={() => (recenterMarkers = [...replacementMarkers])}
			>
				Replace markers
			</button>
			<button
				type="button"
				class="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
				data-testid="clear-markers"
				onclick={() => (recenterMarkers = [])}
			>
				Clear markers
			</button>
			<button
				type="button"
				class="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
				data-testid="move-current-location"
				onclick={() => (recenterCurrentLocation = recenterMovedCurrentLocation)}
			>
				Move current location
			</button>
			<button
				type="button"
				class="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
				data-testid="clear-current-location"
				onclick={() => (recenterCurrentLocation = null)}
			>
				Clear current location
			</button>
			<div class="w-full text-xs text-slate-700">
				Viewport events: <span data-testid="viewport-event-count">{recenterViewportEventCount}</span
				>
			</div>
			<div class="w-full text-xs text-slate-700">
				Last viewport mode: <span data-testid="viewport-last-mode">{recenterViewportLastMode}</span>
			</div>
		</div>

		<Map
			class="h-full w-full"
			defaultCenter={springfieldCenter}
			defaultZoom={13}
			markers={recenterMarkers}
			currentLocation={recenterCurrentLocation}
			onViewportChanged={(detail) => {
				recenterViewportEventCount += 1;
				recenterViewportLastMode = detail.mode;
			}}
		/>
	</div>
{/snippet}

{#snippet CurrentLocationHarnessTemplate()}
	<div class={mapShellClass}>
		<div
			class="absolute top-3 left-3 z-[1000] flex max-w-[20rem] flex-wrap gap-2 rounded-lg bg-white/95 p-2 shadow-md"
		>
			<button
				type="button"
				class="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
				data-testid="reset-harness"
				onclick={resetCurrentLocationState}
			>
				Reset harness
			</button>
			<button
				type="button"
				class="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
				data-testid="move-current-location"
				onclick={() => (locationCurrentLocation = movedCurrentLocationNorthEast)}
			>
				Move location northeast
			</button>
			<button
				type="button"
				class="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
				data-testid="move-current-location-again"
				onclick={() => (locationCurrentLocation = movedCurrentLocationSouthWest)}
			>
				Move location southwest
			</button>
			<button
				type="button"
				class="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
				data-testid="clear-current-location"
				onclick={() => (locationCurrentLocation = null)}
			>
				Clear current location
			</button>
			<div class="w-full text-xs text-slate-700">
				Viewport events: <span data-testid="viewport-event-count">{locationViewportEventCount}</span
				>
			</div>
			<div class="w-full text-xs text-slate-700">
				Last viewport mode: <span data-testid="viewport-last-mode">{locationViewportLastMode}</span>
			</div>
		</div>

		<Map
			class="h-full w-full"
			defaultCenter={springfieldCenter}
			defaultZoom={13}
			markers={locationMarkers}
			currentLocation={locationCurrentLocation}
			onViewportChanged={(detail) => {
				locationViewportEventCount += 1;
				locationViewportLastMode = detail.mode;
			}}
		/>
	</div>
{/snippet}

{#snippet SelectionHarnessTemplate()}
	<div class={mapShellClass}>
		<div
			class="absolute top-3 left-3 z-[1000] flex max-w-[20rem] flex-wrap gap-2 rounded-lg bg-white/95 p-2 shadow-md"
		>
			<button
				type="button"
				class="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
				data-testid="reset-harness"
				onclick={resetSelectionState}
			>
				Reset harness
			</button>
			<button
				type="button"
				class="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
				data-testid="select-north-marker"
				onclick={() => selectMarker('north')}
			>
				Select north marker
			</button>
			<button
				type="button"
				class="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
				data-testid="select-south-marker"
				onclick={() => selectMarker('south')}
			>
				Select south marker
			</button>
			<button
				type="button"
				class="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
				data-testid="deselect-all"
				onclick={deselectAllMarkers}
			>
				Deselect all
			</button>
			<div class="w-full text-xs text-slate-700">
				Viewport events: <span data-testid="viewport-event-count"
					>{selectionViewportEventCount}</span
				>
			</div>
			<div class="w-full text-xs text-slate-700">
				Last viewport mode: <span data-testid="viewport-last-mode">{selectionViewportLastMode}</span
				>
			</div>
		</div>

		<Map
			class="h-full w-full"
			defaultCenter={springfieldCenter}
			defaultZoom={13}
			markers={selectionMarkers}
			onViewportChanged={(detail) => {
				selectionViewportEventCount += 1;
				selectionViewportLastMode = detail.mode;
			}}
		/>
	</div>
{/snippet}

{#snippet CenterPinHarnessTemplate()}
	<div class={mapShellClass}>
		<div
			class="absolute top-3 left-3 z-[1000] flex max-w-[20rem] flex-wrap gap-2 rounded-lg bg-white/95 p-2 shadow-md"
		>
			<button
				type="button"
				class="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
				data-testid="reset-harness"
				onclick={resetCenterPinState}
			>
				Reset harness
			</button>
			<button
				type="button"
				class="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
				data-testid="enable-center-pin"
				onclick={() => {
					centerPinEnabled = true;
					centerChangeEventCount = 0;
					centerChangeLastLocation = null;
				}}
			>
				Enable center pin
			</button>
			<button
				type="button"
				class="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
				data-testid="disable-center-pin"
				onclick={() => (centerPinEnabled = false)}
			>
				Disable center pin
			</button>
			<div class="w-full text-xs text-slate-700">
				Center pin: <span data-testid="center-pin-status">{centerPinEnabled ? 'on' : 'off'}</span>
			</div>
			<div class="w-full text-xs text-slate-700">
				Change events: <span data-testid="center-change-count">{centerChangeEventCount}</span>
			</div>
			{#if centerChangeLastLocation}
				<div class="w-full text-xs text-slate-700">
					Last location: <span data-testid="center-last-location">
						{centerChangeLastLocation.latitude.toFixed(4)}, {centerChangeLastLocation.longitude.toFixed(
							4,
						)}
					</span>
				</div>
			{/if}
		</div>

		<Map
			class="h-full w-full"
			defaultCenter={springfieldCenter}
			defaultZoom={13}
			markers={[]}
			centerPin={centerPinEnabled}
			{centerPinLocation}
			onCenterChange={(location) => {
				centerChangeEventCount += 1;
				centerChangeLastLocation = location;
			}}
		/>
	</div>
{/snippet}

<Story name="Default" template={DefaultTemplate} />

<Story
	name="Multiple Markers"
	args={{ markers: markersWithInvalidPoints }}
	template={DefaultTemplate}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(() => {
			expect(canvas.getAllByTestId('map-marker')).toHaveLength(2);
			expect(canvas.getAllByTestId('map-marker').length).toBeGreaterThan(1);
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
		const canvas = within(canvasElement);
		await waitFor(() => {
			expect(canvas.getAllByTestId('map-marker')).toHaveLength(3);
			expect(canvas.getAllByTestId('map-current-location')).toHaveLength(1);
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
		const canvas = within(canvasElement);
		await waitFor(() => {
			expect(canvas.getAllByTestId('map-marker').length).toBeGreaterThan(0);
		});

		const [firstMarker] = canvas.getAllByTestId('map-marker');
		await expect(firstMarker).toBeTruthy();

		await fireEvent.click(firstMarker!);
		await expect(args.onMarkerTap).toHaveBeenCalledTimes(1);
		await expect(args.onMarkerTap).toHaveBeenCalledWith(expect.objectContaining({ id: 'north' }));
	}}
/>

<Story
	name="Recenter On Marker Changes"
	template={RecenterHarnessTemplate}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const getEventCount = () =>
			Number(canvas.getByTestId('viewport-event-count').textContent ?? '0');

		await fireEvent.click(canvas.getByTestId('reset-harness'));

		await waitFor(() => {
			expect(canvas.getAllByTestId('map-marker')).toHaveLength(3);
			expect(getEventCount()).toBeGreaterThan(0);
		});

		const initialEventCount = getEventCount();

		await fireEvent.click(canvas.getByTestId('replace-markers'));
		await waitFor(() => {
			expect(canvas.getAllByTestId('map-marker')).toHaveLength(1);
			expect(getEventCount()).toBe(initialEventCount + 1);
			expect(canvas.getByTestId('viewport-last-mode')).toHaveTextContent('single');
		});

		await fireEvent.click(canvas.getByTestId('clear-markers'));
		await waitFor(() => {
			expect(canvas.queryAllByTestId('map-marker')).toHaveLength(0);
			expect(getEventCount()).toBe(initialEventCount + 2);
			expect(canvas.getByTestId('viewport-last-mode')).toHaveTextContent('default');
		});

		await fireEvent.click(canvas.getByTestId('restore-initial-markers'));
		await waitFor(() => {
			expect(canvas.getAllByTestId('map-marker')).toHaveLength(3);
			expect(getEventCount()).toBe(initialEventCount + 3);
			expect(canvas.getByTestId('viewport-last-mode')).toHaveTextContent('bounds');
		});
	}}
/>

<Story
	name="Current Location Changes Do Not Recenter"
	template={CurrentLocationHarnessTemplate}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const getEventCount = () =>
			Number(canvas.getByTestId('viewport-event-count').textContent ?? '0');
		const getShelterMarkerPosition = () => {
			const [marker] = canvas.getAllByTestId('map-marker');
			const { x, y } = marker.getBoundingClientRect();
			return { x, y };
		};
		const expectMarkerPositionStable = (
			before: { x: number; y: number },
			after: { x: number; y: number },
		) => {
			expect(Math.abs(after.x - before.x)).toBeLessThan(1);
			expect(Math.abs(after.y - before.y)).toBeLessThan(1);
		};

		await fireEvent.click(canvas.getByTestId('reset-harness'));

		await waitFor(() => {
			expect(canvas.getAllByTestId('map-marker')).toHaveLength(2);
			expect(canvas.getAllByTestId('map-current-location')).toHaveLength(1);
			expect(getEventCount()).toBeGreaterThan(0);
		});

		const initialEventCount = getEventCount();
		const initialMarkerPosition = getShelterMarkerPosition();

		await fireEvent.click(canvas.getByTestId('move-current-location'));
		await waitFor(() => {
			expect(canvas.getAllByTestId('map-current-location')).toHaveLength(1);
		});
		expect(getEventCount()).toBe(initialEventCount);
		expectMarkerPositionStable(initialMarkerPosition, getShelterMarkerPosition());

		await fireEvent.click(canvas.getByTestId('move-current-location-again'));
		await waitFor(() => {
			expect(canvas.getAllByTestId('map-current-location')).toHaveLength(1);
		});
		expect(getEventCount()).toBe(initialEventCount);
		expectMarkerPositionStable(initialMarkerPosition, getShelterMarkerPosition());

		await fireEvent.click(canvas.getByTestId('clear-current-location'));
		await waitFor(() => {
			expect(canvas.queryAllByTestId('map-current-location')).toHaveLength(0);
		});
		expect(getEventCount()).toBe(initialEventCount);
	}}
/>

<Story
	name="Fly To Selected Marker"
	template={SelectionHarnessTemplate}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await fireEvent.click(canvas.getByTestId('reset-harness'));

		await waitFor(() => {
			expect(canvas.getAllByTestId('map-marker')).toHaveLength(3);
		});

		await fireEvent.click(canvas.getByTestId('select-north-marker'));

		await waitFor(() => {
			expect(canvas.getAllByTestId('map-marker')).toHaveLength(3);
		});
	}}
/>

<Story
	name="Recenter When Deselected"
	template={SelectionHarnessTemplate}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const getEventCount = () =>
			Number(canvas.getByTestId('viewport-event-count').textContent ?? '0');

		await fireEvent.click(canvas.getByTestId('reset-harness'));

		await waitFor(() => {
			expect(canvas.getAllByTestId('map-marker')).toHaveLength(3);
			expect(getEventCount()).toBeGreaterThan(0);
		});

		await fireEvent.click(canvas.getByTestId('select-north-marker'));

		const eventCountAfterSelection = getEventCount();

		await fireEvent.click(canvas.getByTestId('deselect-all'));
		await waitFor(
			() => {
				expect(getEventCount()).toBe(eventCountAfterSelection + 1);
				expect(canvas.getByTestId('viewport-last-mode')).toHaveTextContent('bounds');
			},
			{ timeout: 3000 },
		);
	}}
/>

<Story
	name="Center Pin Mode"
	template={CenterPinHarnessTemplate}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await fireEvent.click(canvas.getByTestId('reset-harness'));

		await waitFor(() => {
			expect(canvas.getByTestId('center-pin-status')).toHaveTextContent('off');
			expect(canvas.queryByTestId('center-pin')).not.toBeInTheDocument();
		});

		await fireEvent.click(canvas.getByTestId('enable-center-pin'));

		await waitFor(() => {
			expect(canvas.getByTestId('center-pin-status')).toHaveTextContent('on');
			expect(canvas.getByTestId('center-pin')).toBeInTheDocument();
		});

		await fireEvent.click(canvas.getByTestId('disable-center-pin'));

		await waitFor(() => {
			expect(canvas.getByTestId('center-pin-status')).toHaveTextContent('off');
			expect(canvas.queryByTestId('center-pin')).not.toBeInTheDocument();
		});
	}}
/>
