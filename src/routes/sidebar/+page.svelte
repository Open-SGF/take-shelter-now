<script lang="ts">
	import { Sidebar } from '$lib/components/ui/Sidebar';
	import L from 'leaflet';
	import { onMount } from 'svelte';

	let mapElement: HTMLDivElement | undefined;
	let map: L.Map;

	const SIDEBAR_WIDTH = 360;
	const testItems = Array.from({ length: 20 }, (_, i) => i + 1);

	onMount(() => {
		map = L.map(mapElement!, {
			center: [37.208957, -93.292299],
			zoom: 13,
			preferCanvas: true,
		});

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 30,
			minZoom: 13,
			referrerPolicy: 'no-referrer',
			detectRetina: true,
			crossOrigin: false,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		}).addTo(map);

		// Invalidate map size after render to ensure proper sizing
		setTimeout(() => {
			map.invalidateSize();
		}, 100);
	});
</script>

<div class="relative h-dvh bg-[#e2e0e1]">
	<!-- Map container: adjusts width on desktop to accommodate sidebar -->
	<div
		class="h-dvh md:mr-[var(--sidebar-width)]"
		style="--sidebar-width: {SIDEBAR_WIDTH}px;"
		bind:this={mapElement}
	></div>

	<Sidebar width={SIDEBAR_WIDTH}>
		<div class="p-6">
			<h1 class="mb-4 text-2xl font-bold">Sidebar Test Page</h1>
			<p class="text-muted-foreground mb-4">
				This page demonstrates the desktop sidebar component. The sidebar:
			</p>
			<ul class="mb-6 list-inside list-disc space-y-2 text-sm">
				<li>Has a configurable width (currently {SIDEBAR_WIDTH}px)</li>
				<li>Is fixed on the right side of the screen</li>
				<li>Takes up the full height of the viewport</li>
				<li>Has an independently scrollable content area</li>
				<li>Hides automatically on mobile devices</li>
			</ul>

			<h2 class="mb-3 text-lg font-semibold">Scroll Test Content</h2>
			<p class="text-muted-foreground mb-4 text-sm">
				The content below demonstrates independent scrolling within the sidebar.
			</p>

			{#each testItems as item (item)}
				<div class="border-sidebar-border bg-sidebar-accent mb-3 rounded-lg border p-4">
					<h3 class="font-medium">Item {item}</h3>
					<p class="text-muted-foreground text-sm">
						This is sample content to test scrolling behavior in the sidebar.
					</p>
				</div>
			{/each}
		</div>
	</Sidebar>
</div>
